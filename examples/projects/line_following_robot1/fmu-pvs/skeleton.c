/*! \file skeleton.c 
 * In this file there are the implementations
 * of the fuctions declared in fmu.h
 * along with the data needed.
 */
#include "fmu.h"
#include "libwebsockets.h"
#include "signal.h"
#include "misraC/line_following_robot1.h"


State st; /*!< structure containing the state of the model */
int first = 0; /* variable for execution of setup option during first step only */

/**
  the following are variables used to create the websocket server for remote control
 */
int port = 0;
int initial_port = 8084;
int websocket_open = FALSE;
struct lws_context* context;
enum lws_callback_reasons callback_reason;
void* callback_in;
struct lws* callback_wsi;
int force_exit = 0;
char lwssendstate[LWS_SEND_BUFFER_PRE_PADDING + LWS_SEND_BUFFER_POST_PADDING+128];
char lwssendvariables[LWS_SEND_BUFFER_PRE_PADDING + LWS_SEND_BUFFER_POST_PADDING+128];

 /**
       * function for the initialization of the model.
       * It calls the init function of the model and
       * 	sets the output
       * @param location is the directory where the fmu has been unzipped. Might be used in future version
       * 
       */


void initialize(const char* location) {
    init(&st);
    fmiBuffer.realBuffer[3] = st.motorspeed_left;
    fmiBuffer.realBuffer[4] = st.motorspeed_right;
    
    
}

/**
 * function that performs a step of the simulation model.
 * At first the inputs of the are updated with the values fom the master algorithm
 * Then the tick function is called
 * Finally the outputs of the model are forwarded to the master algorithm 
 * @param action is the action to perform. Might be used in future version
 */
void doStep(const char* action) { 
if(first == 0){

    
    first = 1;
}
	
    st.lightsensor_left = fmiBuffer.realBuffer[1];
    st.lightsensor_right = fmiBuffer.realBuffer[2];
	
    tick(&st);
    
    
    fmiBuffer.realBuffer[3] = st.motorspeed_left;
    fmiBuffer.realBuffer[4] = st.motorspeed_right;
    /**/
}

void terminate(){ }


/**
 * functions for websocket copied from the pacemaker example
 */
void sighandler(int sig) { force_exit = 1; }

/**
 * this is the callback function where we handle messages received from a PVSio-web user interface prototype
 */
static int WebSocketCallback(struct lws* wsi, enum lws_callback_reasons reason, void* user, void* in, size_t len) {
    /* global vars */
    callback_reason = reason;
    callback_in = in;
    callback_wsi = wsi;

    /* Callback */
    switch (callback_reason) {
    case LWS_CALLBACK_ESTABLISHED:
        printf("LWS_CALLBACK_ESTABLISHED\n");
        printf("**********************************************\n");
        printf("***              (FMI Protocol)           ****\n");
        printf("**********************************************\n");
        break;
    case LWS_CALLBACK_CLOSED:
        printf("CLIENT DISCONNECTED!\n\n");
        break;
    case LWS_CALLBACK_RECEIVE:
        printf("LWS_CALLBACK_RECEIVE\n");
        //printf("Received message: %s\n", (char*) in);
/*        sendToPVS((char*) in);
        strcpy(tempstate,state);
        memset(variables,0,2000); // we need to clean the variables before reusing them
	    sprintf(variables,";(# linear := %f,\n   angular := %f,\n   x := %f,\n   y := %f,\n   left_rotation := %f,\n   right_rotation := %f #)\n", fmiBuffer.realBuffer[8],fmiBuffer.realBuffer[9],fmiBuffer.realBuffer[6],fmiBuffer.realBuffer[7],fmiBuffer.realBuffer[10],fmiBuffer.realBuffer[11]);
		//printf("%s\n",variables);
		strcat(tempstate,variables);
        memcpy(lwssendstate + LWS_SEND_BUFFER_PRE_PADDING, tempstate, strlen(tempstate) );
        lws_write(wsi,(unsigned char *)lwssendstate + LWS_SEND_BUFFER_PRE_PADDING,strlen(tempstate),LWS_WRITE_TEXT);*/
        break;
    case LWS_CALLBACK_HTTP:
        printf("LWS_CALLBACK_HTTP\n");
        break;
    case LWS_CALLBACK_LOCK_POLL:
        printf("LWS_CALLBACK_LOCK_POLL\n");
        break;
    case LWS_CALLBACK_ADD_POLL_FD:
        printf("LWS_CALLBACK_ADD_POLL_FD\n");
        break;
    case LWS_CALLBACK_UNLOCK_POLL:
        printf("LWS_CALLBACK_UNLOCK_POLL\n");
        break;
    case LWS_CALLBACK_PROTOCOL_INIT:
        printf("LWS_CALLBACK_PROTOCOL_INIT\n");
        break;
    case LWS_CALLBACK_GET_THREAD_ID:
        printf("TIMEOUT\n");
        printf("LWS_CALLBACK_GET_THREAD_ID\n");
        break;
    case LWS_CALLBACK_WSI_DESTROY:
        printf("Timeout Happened %i\n", callback_reason);
        break;
    default:
        printf("Unmanaged Callback Reason! %i\n", callback_reason);
        break;
    }
    return 0;
}

/* list of supported protocols and callbacks */
static struct lws_protocols protocols[] = {
    {
        "FMI",              /* name */
        WebSocketCallback,  /* callback */
        0,                  /* per_session_data_size */
        0,                  /* max frame size / rx buffer */
    },
    {
        NULL, NULL, 0, 0   /* End of list */
    }
};

/* create websocket context */
int open_websocket() {
    const char *interface = NULL; /* NULL means
                                     "all interfaces" */
    lwsl_notice("libwebsockets test server - "
                "(C) Copyright 2010-2013 Andy Green <andy@warmcat.com> - "
                "licensed under LGPL2.1\n");
    struct lws_context_creation_info info;
    memset(&info, 0, sizeof(info));
    info.port = port;
    info.iface = interface;
    info.protocols = protocols;
    info.ssl_cert_filepath = NULL;
    info.ssl_private_key_filepath = NULL;
    info.gid = -1;
    info.uid = -1;
    info.options = 0;

    context = lws_create_context(&info);  /* global var */

    if (context == NULL) {
        printf("libwebsocket init failed\n");
        return FALSE;
    }

    printf("open_websocket on port %i\n", port);
    return TRUE;
}

int WebsocketServer(/* input variables */
                const double Aget,
                const double Vget
                /* output variables */
                ) {
    //printf("BLOCK STARTED\n");

    time_t rt;           /* real time */
    rt = time(0);

    /* Open Websocket */
    if (websocket_open == FALSE) {
        port = initial_port;
        websocket_open = open_websocket();
        if (websocket_open == FALSE) {
            initial_port++; /* change port so that a new port
                            can be tried at the next attempt */
        } else {
            printf("WEBSOCKET OPENED\n");
            signal(SIGINT, sighandler);   /* handle user interrupts */
        }
        printf("RETURNING PORT %i\n", port);
        return port;
    } else {
        int repeat = TRUE;
        while (repeat) {   /* iterate until connection established */
            if (!force_exit) {
                /* wait for incoming msg, up to 100 ms */
                lws_service(context, 0);
                repeat = FALSE;
            } else {
                close_websocket();
                repeat = FALSE;
            }
        } /* END while */
       // printf("BLOCK END\n");
        return port;
    }
}

void close_websocket() {
    lws_context_destroy(context);
    websocket_open = FALSE;
    printf("close_websocket\n");
}


/*! \file skeleton.c 
 * In this file there are the implementations
 * of the fuctions declared in fmu.h
 * along with the data needed.
 */
#include "fmu.h"
#include <string.h>

static int WebSocketCallback(struct lws*, enum lws_callback_reasons, void*, void*, size_t);

/** 
 * List of supported protocols and callbacks 
 */
static struct lws_protocols protocols[] = {
	{
        "FMI",              // Name
        WebSocketCallback,  // Callback
        0,                  // Per_session_data_size
        0,                  // Rx_buffer_size
    },
    { NULL, NULL, 0, 0 }	// End of list
};

 /**
 * Function for the initialization of the model.
 * It calls the init function of the model and sets the output.
 * It initializes the semaphore and creates the websocket thread.
 * @param location is the directory where the fmu has been unzipped. Might be used in future version
 * 
 */
void initialize(ModelInstance* comp, const char* location) {
    init(&comp->st);
    
    comp->fmiBuffer.realBuffer[9] = comp->st.servoLeftVal;
    comp->fmiBuffer.realBuffer[10] = comp->st.servoRightVal;

    comp->first = 0;   
}

/**
 * Function used to initialize the websocket
 */
void create_websocket(ModelInstance* comp, int initial_port) {
	// Open websocket
    if (comp->websocket_open == 0) {
        comp->port = initial_port;
        comp->websocket_open = open_websocket(comp);
        if (comp->websocket_open == 0) {
            initial_port++; // Change port so that a new port can be tried at the next attempt
        } else {
            printf("WEBSOCKET OPENED\n");
        }
        printf("RETURNING PORT %i\n", comp->port);
    }
}

/**
 * Function used to open the websocket
 */
int open_websocket(ModelInstance* comp) {	
    const char *interface = NULL; // NULL means "all interfaces"
    lwsl_notice("libwebsockets test server - "
                "(C) Copyright 2010-2013 Andy Green <andy@warmcat.com> - "
                "licensed under LGPL2.1\n");			
                
    struct lws_context_creation_info info;
    memset(&info, 0, sizeof(info));
    info.port = comp->port;
    info.iface = interface;
    info.protocols = protocols;
    info.ssl_cert_filepath = NULL;
    info.ssl_private_key_filepath = NULL;
    info.gid = -1;
    info.uid = -1;
    info.options = 0;
    info.user = comp;    

    comp->context = lws_create_context(&info);

    if (comp->context == NULL) {
        printf("Libwebsocket init failed\n");
        return 0;
    }

    printf("Open websocket on port %i\n", comp->port);
    return 1;
}

/**
 * Function that performs a step of the simulation model.
 * At first the inputs of the are updated with the values fom the master algorithm.
 * Then the tick function is called inside the mutex, in order to guarantee mutual exlusion.
 * Finally the outputs of the model are forwarded to the master algorithm 
 * @param action is the action to perform. Might be used in future version.
 */
void doStep(ModelInstance* comp, const char* action) {
	if(comp->first == 0) {
	
		comp->st.backwardRotate = comp->fmiBuffer.realBuffer[1];
		comp->st.forwardRotate = comp->fmiBuffer.realBuffer[2];
		comp->st.forwardSpeed = comp->fmiBuffer.realBuffer[3];
		comp->st.time = comp->fmiBuffer.realBuffer[11];
		
		comp->first = 1;
	}
	
    comp->st.lfLeftVal = comp->fmiBuffer.realBuffer[4];
    comp->st.lfRightVal = comp->fmiBuffer.realBuffer[5];
    comp->st.posx = comp->fmiBuffer.realBuffer[7];
    comp->st.posy = comp->fmiBuffer.realBuffer[8];
	
    tick(&comp->st);
       
    
    comp->fmiBuffer.realBuffer[9] = comp->st.servoLeftVal;
    comp->fmiBuffer.realBuffer[10] = comp->st.servoRightVal;
    /*
    comp->fmiBuffer.realBuffer[1] = comp->st.backwardRotate;
    comp->fmiBuffer.realBuffer[2] = comp->st.forwardRotate;
    comp->fmiBuffer.realBuffer[3] = comp->st.forwardSpeed;
    comp->fmiBuffer.realBuffer[11] = comp->st.time;
    comp->fmiBuffer.intBuffer[6] = comp->st.port;*/
    
    if (comp->websocket_open == 1) {
		lws_service(comp->context, 0);
	}
	
	printf("Time: %f\n", comp->fmiBuffer.realBuffer[11]);
	comp->fmiBuffer.realBuffer[11] += 0.01;
	comp->st.time = comp->fmiBuffer.realBuffer[11];
	
}

void terminate(ModelInstance* comp) {
	close_websocket(comp);
}

/**
 * Callback function used to handle the received messages.
 */
static int WebSocketCallback(struct lws* wsi, enum lws_callback_reasons reason, void* user, void* in, size_t len) {
	struct lws_context* context = lws_get_context(wsi);
	ModelInstance* comp = (ModelInstance*)lws_context_user(context);
	
    // Callback
    switch (reason) {
		case LWS_CALLBACK_ESTABLISHED:
			printf("LWS_CALLBACK_ESTABLISHED\n");
			printf("**********************************************\n");
			printf("***             (FMI Protocol)             ***\n");
			printf("**********************************************\n");
			break;
		case LWS_CALLBACK_CLOSED:
			printf("CLIENT DISCONNECTED!\n\n");
			break;
		case LWS_CALLBACK_RECEIVE:
			printf("LWS_CALLBACK_RECEIVE\n");
			// 'len' is the length of the received message. It has some post padding.
			char* received_msg = (char*)malloc(len);
			memcpy(received_msg, (char*)in, len);
			messageHandler(comp, received_msg);
			free(received_msg);
			char* response = (char*)malloc(1024);
			stateToString(comp->st, response);
			memcpy(comp->lwssendstate + LWS_SEND_BUFFER_PRE_PADDING, response, strlen(response));
			lws_write(wsi, (unsigned char *)(comp->lwssendstate + LWS_SEND_BUFFER_PRE_PADDING), strlen(response), LWS_WRITE_TEXT);
			free(response);
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
			printf("Timeout Happened %i\n", reason);
			break;
		default:
			printf("Unmanaged Callback Reason! %i\n", reason);
			break;
    }
    return 0;
}

/**
* Function used to convert the state into a string
*/
void stateToString(State st, char* str) {
	char* temp = (char*)malloc(1024);
	
	strcpy(str, "(#");
	
	sprintf(temp, " backwardRotate := %f,", st.backwardRotate);
	strcat(str, temp);
	sprintf(temp, " forwardRotate := %f,", st.forwardRotate);
	strcat(str, temp);
	sprintf(temp, " forwardSpeed := %f,", st.forwardSpeed);
	strcat(str, temp);
	sprintf(temp, " lfLeftVal := %f,", st.lfLeftVal);
	strcat(str, temp);
	sprintf(temp, " lfRightVal := %f,", st.lfRightVal);
	strcat(str, temp);
	sprintf(temp, " port := %ld,", st.port);
	strcat(str, temp);
	sprintf(temp, " posx := %f,", st.posx);
	strcat(str, temp);
	sprintf(temp, " posy := %f,", st.posy);
	strcat(str, temp);
	sprintf(temp, " servoLeftVal := %f,", st.servoLeftVal);
	strcat(str, temp);
	sprintf(temp, " servoRightVal := %f,", st.servoRightVal);
	strcat(str, temp);
	sprintf(temp, " time := %f,", st.time);
	strcat(str, temp);	
	//Remove the last char ','
	temp[strlen(str)-1] = '\0';	
	strcat(str, " #);");

	free(temp);
}

/**
 * Function used to handle the received command
 */ 
void messageHandler(ModelInstance* comp, char* msg) {	
	if (strstr(msg, "refresh") == NULL) {
		
		if (strstr(msg, "click_accelerate") != NULL) {
			accelerate(&comp->st);
		}
		
		if (strstr(msg, "click_autopilot") != NULL) {
			autopilot(&comp->st);
		}
		
		if (strstr(msg, "click_brake") != NULL) {
			brake(&comp->st);
		}
		
		if (strstr(msg, "click_drive") != NULL) {
			drive(&comp->st);
		}
		
		if (strstr(msg, "click_left") != NULL) {
			left(&comp->st);
		}
		
		if (strstr(msg, "click_reverse") != NULL) {
			reverse(&comp->st);
		}
		
		if (strstr(msg, "click_right") != NULL) {
			right(&comp->st);
		}
		
		if (strstr(msg, "click_tick") != NULL) {
			tick(&comp->st);
		}
		
	}	
}	

/**
 * Function used to close the websocket
 */
void close_websocket(ModelInstance* comp) {
    lws_context_destroy(comp->context);
    comp->websocket_open = 0;
    printf("Close websocket\n");
}

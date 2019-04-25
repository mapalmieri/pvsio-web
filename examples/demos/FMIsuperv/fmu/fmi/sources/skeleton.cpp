/*! \file skeleton.c 
 * In this file there are the implementations
 * of the fuctions declared in fmu.h
 * 
 */
#include "fmu.h"
#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <unistd.h>
#include <signal.h>
#include <locale.h>
#include <pthread.h>
#include "libwebsockets.h"

#define TRUE    1
#define FALSE   0
#define SUCCESS 1
#define FAIL    0

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_t child1;

char action[MAX_MEMORY];	//last command sent to PVSio
char sendbuff[MAX_MEMORY]; // string sent to PVSio
char state[MAX_MEMORY];		// PVS state
char temp_state[MAX_MEMORY]; 	// state saved before step
char tempvar[MAX_MEMORY];		// string used to retrieve external variables
char externalvariables[MAX_MEMORY];	// external variables
char extendedstate[MAX_MEMORY];		//state extended with external variables
char banner[20000];					//string for reading the initial banner of PVSio
char receivebuff[MAX_MEMORY];		//string received from PVSio

/*battery of temp string*/
char r5[MAX_MEMORY];
char r1[MAX_MEMORY];
char r2[MAX_MEMORY];
char r3[MAX_MEMORY];
char r4[MAX_MEMORY];
char r6[MAX_MEMORY];
char r7[MAX_MEMORY];
char r8[MAX_MEMORY];
char r9[MAX_MEMORY];
char r0[MAX_MEMORY];

char a[100];
char b[100];
char c[100];
char e[100];
char f[200];

char* as ;
char* bs ;
char* cs ;
char* ds ;


/*battery of indexes to surf the PVS state*/
int index_state;
int index_state1;
int index_state2;

int watchdog=0;

int FtS[2]; 		// Father to Son
int StF[2];			// Son to Father
int FtS1[2]; 		// Father to Son
int StF1[2];			// Son to Father
int pid_of_son;
int pid_of_son1;

int first = 0;

double temp1,temp2;
FILE* fd;
FILE* fd1;

fd_set rfds;
struct timeval tv;
int retval;


extern FmiBuffer fmiBuffer;
extern const fmi2CallbackFunctions *g_functions;
extern std::string* name;



template <class T>
static void log(const fmi2CallbackFunctions *functions, fmi2ComponentEnvironment componentEnvironment,
		fmi2String instanceName, fmi2Status status, fmi2String category, fmi2String message,T arg)
{
	if (functions != NULL && functions->logger != NULL)
	{
		functions->logger(componentEnvironment, instanceName, status, category, message,arg);
	}
}

template <class T>
static void fmiprintf(fmi2String message,T arg)
{
	if (g_functions != NULL)
	{
		log(g_functions, (void*) 2, name->c_str(), fmi2OK, "logAll",message, arg);
	}
}
static void fmiprintf(fmi2String message)
{
	if (g_functions != NULL)
	{
		log(g_functions, (void*) 2, name->c_str(), fmi2OK, "logAll",message, NULL);
	}
}



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
char lwssendstate[LWS_SEND_BUFFER_PRE_PADDING + LWS_SEND_BUFFER_POST_PADDING+2800];
char lwssendvariables[LWS_SEND_BUFFER_PRE_PADDING + LWS_SEND_BUFFER_POST_PADDING+2800];

void sighandler(int sig) { force_exit = 1; }

/*code for handling watchdog*/
void watchdog_function(int sig){
	watchdog=1;
}
/*
* body of the pthread that takes messages from the HMI
*/
void *GUI_process(void * arg){
    while(1){
		//usleep(240000);	
		handleUserAction();
	}
}

 /**
       * function for the initialization of the model.
       * It calls the init function of the model and
       * 	sets the output
       * @param location is the directory where the fmu has been unzipped.
       * 
       */
void initialize(const char* location) {

/* this arrays of character are used to manipulate the strings of the 
 * PVS folders and PVS theory
 */
    
	strcpy(a, location);
	strcat(a,"/");
	strcpy(b, location);
	strcat(b,"/");
	strcpy(c, location);
	strcat(c,"/");
	strcpy(e,c);
	strcat(c, "pvs-6.0-ix86_64-Linux-allegro/pvsio");
	strcat(a,"pvsio");
	strcat(b,"Supervisor.pvs");
	strcpy(e,c);
	strcat(e,"/bin/relocate");
	
	// these istructions remove the "file://" part of the string
	////////////////////////////////////////////////////////
	 as = a;
	 bs = b;
	 cs = c;
	 ds = e;
	ds= ds+5;
	bs= bs+5;
	as= as+5;
	cs= cs+5;
	/////////////////////////////////////////////////////////
	
	char *parmList1[] = {"/bin/chmod", "+x","-R", (char*)&location[5],NULL};

	/* creation of the 2 pipes for communication from and to PVSio*/
	
    
   
	/*first we give execution permission to the PVS folder */
    pid_of_son=fork();
    if ( pid_of_son == 0){
			execvp("chmod", parmList1);
	}
	else{wait(NULL);}
	
	/* then we execute the relocate bash program needed by PVSio */
	getcwd(f,sizeof(f));
	chdir((char*)&location[5]);
	chdir("pvs-6.0-ix86_64-Linux-allegro/");
	usleep(10);
	
	system("./bin/relocate");

    usleep(10);
    chdir(f);
    /*finally we execute the PVSio process with the PVS theory*/
    setlocale(LC_ALL, "C");						// needed for INTO-CPS
	start_PVSio_process(pid_of_son);
	
	
	
	receiveFromPVSio();
	


	
	
	
	
	
	
	
	
	
    index_state=findVariable("monitor_connected",state);
    if ( index_state != -1){
	writeOutputVariableBool(index_state,2);
	}
	
    index_state=findVariable("supervisor_connected",state);
    if ( index_state != -1){
	writeOutputVariableBool(index_state,4);
	}
	
	
	
    index_state=findVariable("mode",state);
    if (index_state != -1){
	writeOutputVariableString(index_state,1);
	}
	
    index_state=findVariable("pumpcmd",state);
    if (index_state != -1){
	writeOutputVariableString(index_state,3);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	strcpy(fmiBuffer.r[26],state);
	fmiBuffer.stringBuffer[26]=fmiBuffer.r[26];
	
	
	/*we need to open the websocket server*/
	 while(websocket_open == FALSE) {
        port = initial_port;
        websocket_open = open_websocket();
        if (websocket_open == FALSE) {
            initial_port++; /* change port so that a new port
                            can be tried at the next attempt */
        } else {
            printf("WEBSOCKET OPENED\n");
            signal(SIGINT, sighandler);   /* handle user interrupts */
        }
	}
	/*finally we create the thread to take messages from the HMI*/
	signal(SIGALRM, watchdog_function);
    pthread_create(&child1, NULL, &GUI_process, NULL);
}


/**
 * function that performs a step of the simulation model.
 * At first the inputs of the are updated with the values fom the master algorithm
 * Then the tick function is called
 * Finally the outputs of the model are forwarded to the master algorithm 
 * @param action is the action to perform. Might be used in future version
 */
void doStep() { 	
	fflush(fd);
	
	
	/*since we are about to access global var state we acquire lock mutex*/
	pthread_mutex_lock(&mutex);
	watchdog=0;
	
	
	 if(first == 0){
		
	
	
	
	
	
	
	
	
	
	
		first = 1;
	 }
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("spo2", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[6],6);
	}
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("spo2_max", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[7],7);
	}
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("spo2_min", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[8],8);
	}
	
	
	
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("rra", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[12],12);
	}
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("rra_max", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[13],13);
	}
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("rra_min", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[14],14);
	}
	
	
	
	
	
	
	
	
	
    index_state=findVariable("pump",state);
    if ( index_state != -1){
		index_state1=findVariable("rate", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[22],22);
	}
	
	
    index_state=findVariable("pump",state);
    if ( index_state != -1){
		index_state1=findVariable("volume", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[23],23);
	}
	
	
    index_state=findVariable("pump",state);
    if ( index_state != -1){
		index_state1=findVariable("vtbi", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[24],24);
	}
	
	
    index_state=findVariable("pump",state);
    if ( index_state != -1){
		index_state1=findVariable("time", &state[index_state]);
		readInputVariableDouble(index_state1+index_state,fmiBuffer.realBuffer[25],25);
	}
	
	
	
	
	
	
	
	
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("spo2_fail", &state[index_state]);
		readInputVariableBool(index_state1+index_state,fmiBuffer.booleanBuffer[11],11);
	}
	
	
	
	
	
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("rra_fail", &state[index_state]);
		readInputVariableBool(index_state1+index_state,fmiBuffer.booleanBuffer[17],17);
	}
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("isOn", &state[index_state]);
		readInputVariableBool(index_state1+index_state,fmiBuffer.booleanBuffer[18],18);
	}
	
	
	
	
    index_state=findVariable("pump",state);
    if ( index_state != -1){
		index_state1=findVariable("isOn", &state[index_state]);
		readInputVariableBool(index_state1+index_state,fmiBuffer.booleanBuffer[21],21);
	}
	
	
	
	
	
	
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("id", &state[index_state]);
		readInputVariableString(index_state1+index_state,fmiBuffer.stringBuffer[5],5);
	}
	
	
	
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("spo2_label", &state[index_state]);
		readInputVariableString(index_state1+index_state,fmiBuffer.stringBuffer[9],9);
	}
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("spo2_alarm", &state[index_state]);
		readInputVariableString(index_state1+index_state,fmiBuffer.stringBuffer[10],10);
	}
	
	
	
	
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("rra_label", &state[index_state]);
		readInputVariableString(index_state1+index_state,fmiBuffer.stringBuffer[15],15);
	}
	
	
    index_state=findVariable("monitor",state);
    if ( index_state != -1){
		index_state1=findVariable("rra_alarm", &state[index_state]);
		readInputVariableString(index_state1+index_state,fmiBuffer.stringBuffer[16],16);
	}
	
	
	
	
    index_state=findVariable("pump",state);
    if ( index_state != -1){
		index_state1=findVariable("id", &state[index_state]);
		readInputVariableString(index_state1+index_state,fmiBuffer.stringBuffer[19],19);
	}
	
	
    index_state=findVariable("pump",state);
    if ( index_state != -1){
		index_state1=findVariable("topline", &state[index_state]);
		readInputVariableString(index_state1+index_state,fmiBuffer.stringBuffer[20],20);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	watchdog=0;
	strcpy(temp_state,state); 	 // save state before execution of tick
	alarm(MAX_TIME);					 // set alarm of 10 seconds
	sendToPVSio("tick");
	receiveFromPVSio();
	ualarm(0,0);				 // disable alarm
	if(watchdog==1){			 // if the watchdog fired
		strcpy(state,temp_state);// restore the state
		restart_PVSio();		 // kill PVSio and then start it over
	}

	
	
	
	
	
	
	
	
	
    index_state=findVariable("monitor_connected",state);
    if ( index_state != -1){
	writeOutputVariableBool(index_state,2);
	}
	
    index_state=findVariable("supervisor_connected",state);
    if ( index_state != -1){
	writeOutputVariableBool(index_state,4);
	}
	
	
	
    index_state=findVariable("mode",state);
    if (index_state != -1){
	writeOutputVariableString(index_state,1);
	}
	
    index_state=findVariable("pumpcmd",state);
    if (index_state != -1){
	writeOutputVariableString(index_state,3);
	}
	


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	strcpy(fmiBuffer.r[26],state);
	fmiBuffer.stringBuffer[26]=fmiBuffer.r[26];
	
	
	
	/* end of crit section*/
	pthread_mutex_unlock(&mutex);
}
	
    	

void sendToPVSio(const char* _action){
		strcpy(action,_action);
		sprintf(sendbuff,"%s(",_action);
		strcat(sendbuff,state);
		strcat(sendbuff,");\n");
		//fmiprintf("%s\n",sendbuff);
		write(FtS[1], sendbuff , strlen(sendbuff));
}

void receiveFromPVSio(){
	int ret = 0;
	memset(state,0,MAX_MEMORY); // cleans state before using it
	if(PVSioStatus() == 1){	
		if(watchdog == 0)ret = fread(state,1,1,fd);
		while(!findPVSioPrompt(state) ){
			if(watchdog==1)break;
			ret+= fread(&state[ret],1,1,fd);
		}
	//fmiprintf("state:%s",state);
	state[ret-8]='\0'; // removes PVSio prompt
	}
}
    
bool findPVSioPrompt(const char* _state){
	if ( findVariable("<PVSio>",state) == -1) return 0;
	else return 1;
}


void terminate(){ 
	pthread_cancel(child1);
	usleep(100); 
	sprintf(sendbuff,"exit;\n");
	write(FtS[1], sendbuff,strlen(sendbuff));
	//kill(child1,SIGUSR1);
	close_websocket();
}

void start_PVSio_process(int& pid){
	pipe(FtS);
    pipe(StF);
    printf("prima della fork\n");
    sleep(10);
	pid_of_son = fork();
	if ( pid_of_son == 0) {
		// son
		close( 0 );			//
		dup( FtS[0] );		// chiudo lo stdin

		close( FtS[0] );	// e lo sostituisco con Fts[0]
		close( FtS[1] );	//

		close ( 1 );		//
		dup( StF[1] );		// chiudo lo stdout

		close( StF[1] );	// e lo sostituisco con StF[1]
		close( StF[0] );	//

		// il processo lanciato da execlp eredita
		// i pipe dal processo che l'ha lanciato
		execlp(cs,"pvsio",bs , NULL);
    }
    //father
	close(FtS[0]);	//	closes the unnecessary pipe extremity
	close(StF[1]);	//  closes the unnecessary pipe extremity

	//usleep(400000);	// BEWARE this value may depend on the processor... if problems try to increase
	
	read(StF[0], banner, sizeof(banner));		// removes the  banner
	fd=fdopen(StF[0], "r");
	sprintf(sendbuff,"init(0);");
	write(FtS[1], sendbuff,strlen(sendbuff));
}

void restart_PVSio(){
	/*sprintf(sendbuff,"exit;\n");
	write(FtS[1], sendbuff,strlen(sendbuff));*/
	fclose(fd);
	kill(pid_of_son,SIGKILL);
	start_PVSio_process(pid_of_son);
	
	}	

/**
 * this is the callback function where we handle messages received from a PVSio-web user interface prototype
 */
static int Callback(struct lws* wsi, enum lws_callback_reasons reason, void* user, void* in, size_t len) {
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
    
        strcpy(receivebuff,(char*) in);
        /*since we are about to access global var state we acquire lock mutex*/
        pthread_mutex_lock(&mutex);
        
			if(strcmp("refresh",receivebuff) == 0){
				//do nothing
			}
			else{
				watchdog=0;
				strcpy(temp_state,state); 	 // save state before execution of tick
				alarm(MAX_TIME);					 // set alarm of 10 seconds
				sendToPVSio(receivebuff);
				receiveFromPVSio();
				ualarm(0,0);				 // disable alarm
				if(watchdog==1){			 // if the watchdog fired
					strcpy(state,temp_state);// restore the state
					restart_PVSio();		 // kill PVSio and then start it over
				}

			}
			
		retrieveExternalVariables();
		strcpy(extendedstate,state);
		strcat(extendedstate,externalvariables);
		
		/*end of crit section*/
		pthread_mutex_unlock(&mutex);
		
        memcpy(lwssendstate + LWS_SEND_BUFFER_PRE_PADDING, extendedstate, strlen(extendedstate) );
        lws_write(wsi,(unsigned char *)lwssendstate + LWS_SEND_BUFFER_PRE_PADDING,strlen(extendedstate),LWS_WRITE_TEXT);
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
        //printf("TIMEOUT\n");
       // printf("LWS_CALLBACK_GET_THREAD_ID\n");
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
        Callback,  /* callback */
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
    memset(&context,0,sizeof(context));
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

void retrieveExternalVariables(){
	 memset(externalvariables,0,MAX_MEMORY); // we need to clean the variables before reusing them
	    if( findVariable("mode", state)== -1){
			if ( strlen(externalvariables) == 0) {
				sprintf(tempvar,";(# mode := %f\n",fmiBuffer.realBuffer[1]); 
				strcat(externalvariables,tempvar);
				}
			else {
				sprintf(tempvar,",mode := %f\n",fmiBuffer.realBuffer[1]);
				strcat(externalvariables,tempvar);
				} 
	    }if( findVariable("monitor_connected", state)== -1){
			if ( strlen(externalvariables) == 0) {
				sprintf(tempvar,";(# monitor_connected := %f\n",fmiBuffer.realBuffer[2]); 
				strcat(externalvariables,tempvar);
				}
			else {
				sprintf(tempvar,",monitor_connected := %f\n",fmiBuffer.realBuffer[2]);
				strcat(externalvariables,tempvar);
				} 
	    }if( findVariable("pumpcmd", state)== -1){
			if ( strlen(externalvariables) == 0) {
				sprintf(tempvar,";(# pumpcmd := %f\n",fmiBuffer.realBuffer[3]); 
				strcat(externalvariables,tempvar);
				}
			else {
				sprintf(tempvar,",pumpcmd := %f\n",fmiBuffer.realBuffer[3]);
				strcat(externalvariables,tempvar);
				} 
	    }if( findVariable("supervisor_connected", state)== -1){
			if ( strlen(externalvariables) == 0) {
				sprintf(tempvar,";(# supervisor_connected := %f\n",fmiBuffer.realBuffer[4]); 
				strcat(externalvariables,tempvar);
				}
			else {
				sprintf(tempvar,",supervisor_connected := %f\n",fmiBuffer.realBuffer[4]);
				strcat(externalvariables,tempvar);
				} 
	    }
		strcat(externalvariables," #)");
}

void handleUserAction() {
           lws_service(context, 1000);    
}

int PVSioStatus (){
	memset(r3,0,MAX_MEMORY);
	FD_ZERO(&rfds);
    FD_SET(StF[0], &rfds);
    tv.tv_sec = MAX_TIME;
    tv.tv_usec = 0;
    retval = select(StF[0]+1, &rfds, NULL, NULL, &tv);
    if( retval > 0){
		if(FD_ISSET(StF[0],&rfds) ==1){ 
			while( findIndex("==>",r3) ==-1){
				fgets(r3, sizeof(r3),fd);
			}
			return 1;
		}
	}
	return 0;
}

void close_websocket() {
    lws_context_destroy(context);
    websocket_open = FALSE;
    printf("Supervisor close_websocket\n");
}

int findVariable(const char tosearch[], const char state[]){
	int tmp_index=0;
	int success=0;
	while(success != 1){
		if(strchr(&state[tmp_index],tosearch[0]) != NULL){
			tmp_index=strchr(&state[tmp_index],tosearch[0]) - state;
			for(int i = 1; i< strlen(tosearch);i++){
				if(state[tmp_index+i] == tosearch[i]){
					success = 1;
				}
				else{
					success=0;
					tmp_index++;
					break;
				}
			}
		}
		else return -1;
	}
	if(tmp_index == -1)return -1; // not found
	while (state[tmp_index] != '='){
		 tmp_index++;
		}
	return tmp_index+2; // tmp_index contiene l'inizio del valore, ora dovrebbe andare bene anche per findState
}

int findIndex(const char tosearch[], const char state[]){
	int tmp_index=0;
	int success=0;
	while(success != 1){
		if(strchr(&state[tmp_index],tosearch[0]) != NULL){
			tmp_index=strchr(&state[tmp_index],tosearch[0]) - state;
			for(int i = 1; i< strlen(tosearch);i++){
				if(state[tmp_index+i] == tosearch[i]){
					success = 1;
				}
				else{
					success=0;
					tmp_index++;
					break;
				}
			}
		}
		else return -1;
	}
	if(tmp_index == -1)return -1; // not found
	return tmp_index+(strlen(tosearch)); // tmp_index contiene l'inizio della stringa cercata, +strlen aggiunge la lunghezza della stringa e +4 aggiunge " := " e quindi restituiamo esattamente l'indice dove si trovail valore
}
void writeOutputVariableDouble(int state_index, int buffer_index){
	int offset = 0;
	temp1=0;
	temp2=0;
	memset(r2,0,MAX_MEMORY);
	memset(r1,0,MAX_MEMORY);
	if(atof(&state[state_index]) == 0){
		fmiBuffer.realBuffer[buffer_index] = 0;
	}
	else{
		while(state[state_index+offset] != ',' && state[state_index+offset] != '.' && state[state_index+offset] != ' ' && state[state_index+offset] != '/' && state[state_index+offset] != 'E' && state[state_index+offset] != 'e')offset++;
		switch(state[state_index+offset]){
			case 'e' :
				sscanf(&state[state_index],"%[^'e']e%s %*s",r1,r2);
				temp1=atof(r1);
				temp2=atof(r2);
				temp1=temp1*pow(10,temp2);
			break;
			case 'E' : 
				sscanf(&state[state_index],"%[^'E']E%s %*s",r1,r2);
				temp1=atof(r1);
				temp2=atof(r2);
				temp1=temp1*pow(10,temp2);
			break;
			case ',' :
			temp1=atof(&state[state_index]);
			break;
			case '.' :
			temp1=atof(&state[state_index]); break;
			case ' ' :
			temp1=atof(&state[state_index]); break;
			case '/' :
			sscanf(&state[state_index],"%[^'/']/%s %*s",r1,r2);
				temp1=atof(r1);
				temp2=atof(r2);
				temp1=temp1/temp2;
				
			break;
				}
				fmiBuffer.realBuffer[buffer_index] =temp1;
			
		
	}
}

void writeOutputVariableInt(int state_index, int buffer_index){
	fmiBuffer.intBuffer[buffer_index] = atoi(&state[state_index]);
	
}
void writeOutputVariableBool(int state_index, int buffer_index){
	if(state[state_index] == 'T')fmiBuffer.booleanBuffer[buffer_index]=1;
	else fmiBuffer.booleanBuffer[buffer_index]=0;
}

void writeOutputVariableString(int state_index, int buffer_index){
	int sret;
	char temp[MAX_MEMORY];
	char* token;
	strcpy(temp,state);
	sscanf(&temp[state_index],"%s",fmiBuffer.r[buffer_index]);
	
	//printf("%s\n",fmiBuffer.r[buffer_index]);
	
	if(fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] == ','){
		fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] = '\0';
	
		fmiBuffer.stringBuffer[buffer_index]=fmiBuffer.r[buffer_index];
	}
	else if(fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] == ':'){//list a list should never be the last variable to appear in state
		token=strtok(&temp[state_index+strlen(fmiBuffer.r[buffer_index])],"\n");
		while( findIndex(":),",fmiBuffer.r[buffer_index]) == -1  ) {
			strcat(fmiBuffer.r[buffer_index],token);
			token = strtok(NULL, "\n");
			token=&token[10];
			
			
		}
	fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] = '\0';
	fmiBuffer.stringBuffer[buffer_index]=fmiBuffer.r[buffer_index];
	
	}
	else { 
		fmiBuffer.stringBuffer[buffer_index]=fmiBuffer.r[buffer_index];
		}
	
	//printf("%s\n",fmiBuffer.r[buffer_index]);
	
}

void convertStateToList(int state_index, int buffer_index){
	int sret;
	char temp[MAX_MEMORY];
	char* token;
	strcpy(temp,state);
	sscanf(&temp[state_index],"%s",fmiBuffer.r[buffer_index]);
	
	if(fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] == ','){
		fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] = '\0';
	
		fmiBuffer.stringBuffer[buffer_index]=fmiBuffer.r[buffer_index];
	}
	else{
		token=strtok(&temp[state_index+strlen(fmiBuffer.r[buffer_index])],"\n");
		while( findIndex(":),",fmiBuffer.r[buffer_index]) == -1  ) {
			strcat(fmiBuffer.r[buffer_index],token);
			token = strtok(NULL, "\n");
			token=&token[10];
			
			
		}
	fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] = '\0';
	fmiBuffer.stringBuffer[buffer_index]=fmiBuffer.r[buffer_index];
	
	}
}
	


void readInputVariableDouble(int state_index, double value,int buffer_index){
char temp[MAX_MEMORY];
	char temp_value[20];
	int offset=0;

	while(state[state_index+offset] != ' ' && state[state_index+offset] != ',') offset++;

	strcpy(temp,&state[state_index+offset]);
	state[state_index-1]='\0';
	sprintf(temp_value,"%g",value);
	if(state[state_index+offset-1] == ',') strcat(temp_value,",");
	strcat(state, " ");
	strcat(state,temp_value);
	strcat(state,temp);
}


void readInputVariableInt(int state_index, int value,int buffer_index){
	char temp[MAX_MEMORY];
	char temp_value[20];
	int offset=0;

	while(state[state_index+offset] != ' ' && state[state_index+offset] != ',') offset++;
	
	strcpy(temp,&state[state_index+offset]);
	state[state_index-1]='\0';
	sprintf(temp_value,"%d",value);
	if(state[state_index+offset-1] == ',') strcat(temp_value,",");
	strcat(state, " ");
	strcat(state,temp_value);
	strcat(state,temp);
}

void readInputVariableBool(int state_index, bool value,int buffer_index){
	char temp[MAX_MEMORY];
	char temp_value[20];
	int offset=0;
	
	while(state[state_index+offset] != ' ' && state[state_index+offset] != ',') offset++;
	
	
	strcpy(temp,&state[state_index+offset]);
	state[state_index-1]='\0';
	if(value == true)	sprintf(temp_value,"TRUE");
	else sprintf(temp_value,"FALSE");
	if(state[state_index+offset-1] == ',') strcat(temp_value,",");
	
	strcat(state, " ");
	strcat(state,temp_value);
	strcat(state,temp);
}

void readInputVariableString(int state_index, const char* value,int buffer_index){
	char temp[MAX_MEMORY];
	char temp_value[MAX_MEMORY];
	int offset=0;
	
	if(value){
		if(state[state_index]=='(' && state[state_index+1]=='#'){ // if in the state the variable begins with "(#" then it is a state and the offset is where "#)" is
			offset = findIndex("#)",(char*) &state[state_index]);
		}
		else{													  // else in the state it's a string that terminates with ","	
			while(state[state_index+offset] != ' ' && state[state_index+offset] != ',') offset++;
		}
			
		strcpy(temp,(char*) &state[state_index+offset]);
		state[state_index]='\0';
		strcat(state,value);
		//strcat(state,",\n");
		strcat(state,temp);
	}
}

/*! \file skeleton.c 
 * In this file there are the implementations
 * of the fuctions declared in fmu.h
 * along with the data needed.
 */
#include "fmu.h"
#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <unistd.h>
#include <signal.h>
#include <locale.h>
#include "libwebsockets.h"

#define TRUE    1
#define FALSE   0
#define SUCCESS 1
#define FAIL    0


char sendbuff[1000];
char state[2000];
char tempvar[2000];
char variables[2000];
char tempstate[2000];
char banner[20000];
char receivebuff[1000];
char r5[1000];
char r1[1000];
char r2[1000];
char r3[1000];
char r4[1000];
char r6[1000];
char r7[1000];
char r8[1000];
char r9[1000];
char r0[1000];
int ret;
int index_state;
int index_state1;
int index_state2;
int FtS[2]; 		// Father to Son
int StF[2];			// Son to Father
int pid_of_son;
int first = 0;

double temp1,temp2;
FILE* fd;
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
int initial_port = 9092;
int websocket_open = FALSE;
struct lws_context* context;
enum lws_callback_reasons callback_reason;
void* callback_in;
struct lws* callback_wsi;
int force_exit = 0;
char lwssendstate[LWS_SEND_BUFFER_PRE_PADDING + LWS_SEND_BUFFER_POST_PADDING+2800];
char lwssendvariables[LWS_SEND_BUFFER_PRE_PADDING + LWS_SEND_BUFFER_POST_PADDING+2800];

 /**
       * function for the initialization of the model.
       * It calls the init function of the model and
       * 	sets the output
       * @param location is the directory where the fmu has been unzipped. Might be used in future version
       * 
       */


void initialize(const char* location) {

    char a[100];
	char b[100];
	char c[100];
	char e[100];
	char f[200];
	//printf("%s\n",location);
	strcpy(a, location);
	strcat(a,"/");
	strcpy(b, location);
	strcat(b,"/");
	strcpy(c, location);
	strcat(c,"/");
	strcpy(e,c);
	strcat(c, "PVS6.0");
	strcat(a,"pvsio");
	strcat(b,"coordination.pvs");
	strcpy(e,c);
	strcat(e,"/bin/relocate");
	// these istructions remove the "file://" part of the string
	////////////////////////////////////////////////////////
	char* as = a;
	char* bs = b;
	char* cs = c;
	char* ds = e;
	ds= ds+5;
	bs= bs+5;
	as= as+5;
	cs= cs+5;
	printf("%s\n",as);
	printf("%s\n",bs);
	/////////////////////////////////////////////////////////
	char *parmList1[] = {"/bin/chmod", "+x","-R", (char*)&location[5],NULL};


	pipe(FtS);
    pipe(StF);

    pid_of_son=fork();
    if ( pid_of_son == 0){
			execvp("chmod", parmList1);
	}
	else{wait(NULL);}
	getcwd(f,sizeof(f));
	chdir((char*)&location[5]);
	chdir("PVS6.0/");
	sleep(1);
	system("./bin/relocate");

    sleep(0.01);
    chdir(f);
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
		execlp(as,"pvsio",cs , bs, NULL);
    }
    //father
	close(FtS[0]);	//	closes the unnecessary pipe extremity
	close(StF[1]);	//  closes the unnecessary pipe extremity

	sleep(2);
	read(StF[0], banner, sizeof(banner));		// removes the  banner
	fd=fdopen(StF[0], "r");
	setlocale(LC_ALL, "C");						// needed for INTO-CPS
	sprintf(sendbuff,"init;");
	write(FtS[1], sendbuff,strlen(sendbuff));
	fgets(r3, sizeof(r3),fd);
	//printf("%s\n", r3);
	ret = fread(state,1,1,fd); 
	while(findVariable("<PVSio>",state) == -1){
		ret+= fread(&state[ret],1,1,fd);
	}
	//printf("%s\n",state);
	state[ret-8]='\0'; // removes PVSio prompt
	//printf("%s\n",state);
	


	
	
    index_state=findVariable("x_d",state);
    if ( index_state != -1){
	//	convertNotation("x_d",1);
		convertStateToDouble(index_state,1);
	}
	
	
    index_state=findVariable("y_d",state);
    if ( index_state != -1){
	//	convertNotation("y_d",2);
		convertStateToDouble(index_state,2);
	}
	
	
    index_state=findVariable("z_d",state);
    if ( index_state != -1){
	//	convertNotation("z_d",3);
		convertStateToDouble(index_state,3);
	}
	
	index_state=findVariable("x_actual",state);
    if ( index_state != -1){
	//	convertNotation("z_d",3);
		convertStateToDouble(index_state,11);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//WebsocketServer(0,0);
	
	//sleep(1);
}

/**
 * function that performs a step of the simulation model.
 * At first the inputs of the are updated with the values fom the master algorithm
 * Then the tick function is called
 * Finally the outputs of the model are forwarded to the master algorithm 
 * @param action is the action to perform. Might be used in future version
 */
void doStep(const char* action) { 	
	fflush(fd);
	
	/**
	 *
	 * we need to change the state according to the input of the FMU
	 *since we DO change the state we have to access all variables one by one
	 * **/
	 if(first == 0){
		
	
	
	
	
	
	
	
	
    index_state=findVariable("delay",state);
    if ( index_state != -1){
	convertDoubleToState(index_state,fmiBuffer.realBuffer[8],8);
	}
	
	
    index_state=findVariable("delayMax",state);
    if ( index_state != -1){
	convertDoubleToState(index_state,fmiBuffer.realBuffer[9],9);
	}
	
	
    index_state=findVariable("id",state);
    if ( index_state != -1){
	convertDoubleToState(index_state,fmiBuffer.realBuffer[10],10);
	}
	
	
	
	
	
	
	
		first = 1;
	 }
	
	
	
	
	
    index_state=findVariable("x_prec",state);
    if ( index_state != -1){
	convertDoubleToState(index_state,fmiBuffer.realBuffer[4],4);
	}
	
	
    index_state=findVariable("x_foll",state);
    if ( index_state != -1){
	convertDoubleToState(index_state,fmiBuffer.realBuffer[5],5);
	}
	
	
    index_state=findVariable("y_prec",state);
    if ( index_state != -1){
	convertDoubleToState(index_state,fmiBuffer.realBuffer[6],6);
	}
	
	
    index_state=findVariable("y_foll",state);
    if ( index_state != -1){
	convertDoubleToState(index_state,fmiBuffer.realBuffer[7],7);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	//if(strcmp(action,"tick")==0) WebsocketServer(0,0); // we want to check the websocket only during the fmi2DoStep call
	
	
	sprintf(sendbuff,"%s(",action);
	strcat(sendbuff,state);
	strcat(sendbuff,");");
	fmiprintf("%s\n",sendbuff);
	memset(state,0,2000); // cleans state before using it
	write(FtS[1], sendbuff,strlen(sendbuff));
	do{
		fgets(r3, sizeof(r3),fd);
		//printf("%s\n", r3);
	}
	while((strcmp(" ==>\n",r3)!=0) && (strcmp("==>\n",r3)!=0) && (strcmp("<PVSio> ==>\n",r3)!=0));//  ";;;;;GC:;;;;;finished"  followed by "==>" without whitespace

	ret = fread(state,1,1,fd); // 
	while(findVariable("<PVSio>",state) == -1){
		ret+= fread(&state[ret],1,1,fd);

	}

	state[ret-8]='\0'; // removes PVSio prompt
	fmiprintf("%s\n", state);

	/**
	 * we need to change the output of the FMU according to the state
	 * since we don't change state we can start from the first and then advance till the last
	 * **/
	
	 
    index_state=findVariable("x_d",state);
    if (index_state != -1){
   // convertNotation("x_d",1);
	convertStateToDouble(index_state,1);
	}
	
	 
    index_state=findVariable("y_d",state);
    if (index_state != -1){
 //   convertNotation("y_d",2);
	convertStateToDouble(index_state,2);
	}
	
	 
    index_state=findVariable("z_d",state);
    if (index_state != -1){
    //convertNotation("z_d",3);
	convertStateToDouble(index_state,3);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	


	

	
}
	
    
    


void terminate(){ 
	sprintf(sendbuff,"exit;\n");
	write(FtS[1], sendbuff,strlen(sendbuff));
	close_websocket();
}


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
        printf("Received message: %s\n", (char*) in);
        strcpy(receivebuff,(char*) in);
        
        if(findVariable("tick",(char*) in) != -1){
        }
        else{
        doStep(receivebuff);
        }
        strcpy(tempstate,state);
        memset(variables,0,2000); // we need to clean the variables before reusing them
	    
	    if( findVariable("x_d", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# x_d := %f\n",fmiBuffer.realBuffer[1]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",x_d := %f\n",fmiBuffer.realBuffer[1]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
	    if( findVariable("y_d", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# y_d := %f\n",fmiBuffer.realBuffer[2]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",y_d := %f\n",fmiBuffer.realBuffer[2]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
	    if( findVariable("z_d", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# z_d := %f\n",fmiBuffer.realBuffer[3]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",z_d := %f\n",fmiBuffer.realBuffer[3]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
	    if( findVariable("x_prec", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# x_prec := %f\n",fmiBuffer.realBuffer[4]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",x_prec := %f\n",fmiBuffer.realBuffer[4]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
	    if( findVariable("x_foll", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# x_foll := %f\n",fmiBuffer.realBuffer[5]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",x_foll := %f\n",fmiBuffer.realBuffer[5]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
	    if( findVariable("y_prec", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# y_prec := %f\n",fmiBuffer.realBuffer[6]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",y_prec := %f\n",fmiBuffer.realBuffer[6]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
	    if( findVariable("y_foll", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# y_foll := %f\n",fmiBuffer.realBuffer[7]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",y_foll := %f\n",fmiBuffer.realBuffer[7]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
	    if( findVariable("delay", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# delay := %f\n",fmiBuffer.realBuffer[8]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",delay := %f\n",fmiBuffer.realBuffer[8]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
	    if( findVariable("delayMax", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# delayMax := %f\n",fmiBuffer.realBuffer[9]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",delayMax := %f\n",fmiBuffer.realBuffer[9]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
	    if( findVariable("id", state)== -1){
			if ( strlen(variables) == 0) {
				sprintf(tempvar,";(# id := %f\n",fmiBuffer.realBuffer[10]); 
				strcat(variables,tempvar);
				}
			else {
				sprintf(tempvar,",id := %f\n",fmiBuffer.realBuffer[10]);
				strcat(variables,tempvar);
				} 
	    }
	    //printf("%s\n",variables);
		
		strcat(variables," #)");
		strcat(tempstate,variables);
        memcpy(lwssendstate + LWS_SEND_BUFFER_PRE_PADDING, tempstate, strlen(tempstate) );
        lws_write(wsi,(unsigned char *)lwssendstate + LWS_SEND_BUFFER_PRE_PADDING,strlen(tempstate),LWS_WRITE_TEXT);
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
       
            if (!force_exit) {
                /* wait for incoming msg, up to 100 ms */
                lws_service(context, 0);
                repeat = FALSE;
            } else {
                close_websocket();
                repeat = FALSE;
            }

       // printf("BLOCK END\n");
        return port;
    }
}

void close_websocket() {
    lws_context_destroy(context);
    websocket_open = FALSE;
    printf("close_websocket\n");
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

int findState(const char tosearch[], const char state[]){
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
	return tmp_index+(strlen(tosearch))+9; // tmp_index contiene l'inizio della stringa cercata, +strlen aggiunge la lunghezza della stringa e +9 per gli stati sono 9
}

void convertStateToDouble(int state_index, int buffer_index){
	int offset = 0;
	temp1=0;
	temp2=0;
	memset(r2,0,1000);
	memset(r1,0,1000);
	if(atof(&state[state_index]) == 0){
		fmiBuffer.realBuffer[buffer_index] = 0;
	}
	else{
		while(state[state_index+offset] != ',' && state[state_index+offset] != '.' && state[state_index+offset] != ' ' && state[state_index+offset] != '/' && state[state_index+offset] != 'E' && state[state_index+offset] != 'e')offset++;
		switch(state[state_index+offset]){
			case 'e' :
				sscanf(&state[state_index],"%[^'E']E%s %*s",r1,r2);
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

void convertStateToInt(int state_index, int buffer_index){
	fmiBuffer.intBuffer[buffer_index] = atoi(&state[state_index]);
	
}
void convertStateToBool(int state_index, int buffer_index){
	if(state[state_index] == 'T')fmiBuffer.booleanBuffer[buffer_index]=1;
	else fmiBuffer.booleanBuffer[buffer_index]=0;
}
void convertStateToString(int state_index, int buffer_index){
	int sret;
	char temp[2000];
	char* token;
	strcpy(temp,state);
	sscanf(&temp[state_index],"%s",fmiBuffer.r[buffer_index]);
	
	if(fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] == ','){
		fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] = '\0';
	
		fmiBuffer.stringBuffer[buffer_index]=fmiBuffer.r[buffer_index];
	}
	else{
		token=strtok(&temp[state_index+strlen(fmiBuffer.r[buffer_index])],"\n");
		while( findVariable("#),",fmiBuffer.r[buffer_index]) == -1  ) {
			strcat(fmiBuffer.r[buffer_index],token);
			token = strtok(NULL, "\n");
			token=&token[10];
			
			
		}
	fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] = '\0';
	fmiBuffer.stringBuffer[buffer_index]=fmiBuffer.r[buffer_index];
	
	}
	
}

void convertStateToList(int state_index, int buffer_index){
	int sret;
	char temp[2000];
	char* token;
	strcpy(temp,state);
	sscanf(&temp[state_index],"%s",fmiBuffer.r[buffer_index]);
	
	if(fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] == ','){
		fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] = '\0';
	
		fmiBuffer.stringBuffer[buffer_index]=fmiBuffer.r[buffer_index];
	}
	else{
		token=strtok(&temp[state_index+strlen(fmiBuffer.r[buffer_index])],"\n");
		while( findVariable(":),",fmiBuffer.r[buffer_index]) == -1  ) {
			strcat(fmiBuffer.r[buffer_index],token);
			token = strtok(NULL, "\n");
			token=&token[10];
			
			
		}
	fmiBuffer.r[buffer_index][strlen(fmiBuffer.r[buffer_index])-1] = '\0';
	fmiBuffer.stringBuffer[buffer_index]=fmiBuffer.r[buffer_index];
	
	}
}
	


void convertDoubleToState(int state_index, double value,int buffer_index){
char temp[1000];
	char temp_value[20];
	int offset;

	offset=0;
	while(state[state_index+offset] != ' ' && state[state_index+offset] != ',') offset++;
//	printf("offset:%d\n",offset);
	strcpy(temp,&state[state_index+offset]);
	state[state_index-1]='\0';
	sprintf(temp_value,"%f",value);
	if(state[state_index+offset-1] == ',') strcat(temp_value,",");
	strcat(state, " ");
	strcat(state,temp_value);
	strcat(state,temp);
}


void convertIntToState(int state_index, int value,int buffer_index){
	char temp[1000];
	char temp_value[20];
	int offset;

	offset=strchr(&state[state_index],' ')-&state[state_index];
	strcpy(temp,&state[state_index+offset]);
	state[state_index-1]='\0';
	sprintf(temp_value,"%d",value);
	if(state[state_index+offset-1] == ',') strcat(temp_value,",");
	strcat(state, " ");
	strcat(state,temp_value);
	strcat(state,temp);
}

void convertBoolToState(int state_index, bool value,int buffer_index){
	char temp[1000];
	char temp_value[20];
	int offset;
	
	offset=strchr(&state[state_index],' ')-&state[state_index];
	strcpy(temp,&state[state_index+offset]);
	state[state_index-1]='\0';
	if(value == true)	sprintf(temp_value,"TRUE");
	else sprintf(temp_value,"FALSE");
	if(state[state_index+offset-1] == ',') strcat(temp_value,",");
	
	strcat(state, " ");
	strcat(state,temp_value);
	strcat(state,temp);
}

void convertStringToState(int state_index, const char* value,int buffer_index){
		char temp[2000];
	char temp_value[2000];
	int offset;
	
	
	offset = findVariable("#)",(char*) &state[state_index]);
	strcpy(temp,(char*) &state[state_index+offset]);
	
	
	state[state_index]='\0';
	strcat(state,value);
	strcat(state,",\n");
	strcat(state,temp);
	
	
}


void convertNotation(const char name[], int buffer_index){
	index_state=findVariable(name,state);  
	sscanf(&state[index_state],"%s,%*s",r2 );
	//fmiprintf("%s\n", r2);
	if(r2[strlen(r2)-1] == ',')r2[strlen(r2)-1]='\0'; // removes comma
	if(strcmp(r2,"0")==0)return;
	sprintf(sendbuff,"str2real(\"%s\");\n",r2);				
	write(FtS[1], sendbuff,strlen(sendbuff));
	do{
		fgets(r3, sizeof(r3),fd);
		//printf("%s\n", r3);
	}
	while((strcmp(" ==>\n",r3)!=0) && (strcmp("==>\n",r3)!=0) && (strcmp("<PVSio> ==>\n",r3)!=0));
	fgets(r3, sizeof(r3),fd);
	//printf("%s\n", r3);
	sscanf(r3,"%[^'/']/%s",r1,r2);
	temp1=atof(r1);
	temp2=atof(r2);
	//printf("%s\n", r1);
	//printf("%s\n", r2);
	//printf("%f\n", temp1);
	//printf("%f\n", temp2);
	//printf("%f\n", temp1/temp2);
	fgets(r3,sizeof(r3),fd);	
	if ( temp1 == temp2 )  convertDoubleToState(index_state,temp1,buffer_index);
	else{
		if(temp1 != 0)	convertDoubleToState(index_state,temp1/temp2,buffer_index);	// sometimes this might not be sufficient, see function convertStringtoDouble
		else{
			convertDoubleToState(index_state,temp1,buffer_index);
		}
	}	
}

void convertNotation(const char name[], int buffer_index, int index_state){
	sscanf(&state[index_state],"%s,%*s",r2 );
	//fmiprintf("%s\n", r2);
	if(r2[strlen(r2)-1] == ',')r2[strlen(r2)-1]='\0'; // removes comma
	if(strcmp(r2,"0")==0)return;
	sprintf(sendbuff,"str2real(\"%s\");\n",r2);				
	write(FtS[1], sendbuff,strlen(sendbuff));
	do{
		fgets(r3, sizeof(r3),fd);
		//printf("%s\n", r3);
	}
	while((strcmp(" ==>\n",r3)!=0) && (strcmp("==>\n",r3)!=0) && (strcmp("<PVSio> ==>\n",r3)!=0));
	fgets(r3, sizeof(r3),fd);
	//printf("%s\n", r3);
	sscanf(r3,"%[^'/']/%s",r1,r2);
	temp1=atof(r1);
	temp2=atof(r2);
	//printf("%s\n", r1);
	//printf("%s\n", r2);
	//printf("%f\n", temp1);
	//printf("%f\n", temp2);
	//printf("%f\n", temp1/temp2);
	fgets(r3,sizeof(r3),fd);	
	if ( temp1 == temp2 )  convertDoubleToState(index_state,temp1,buffer_index);
	else{
		if(temp1 != 0)	convertDoubleToState(index_state,temp1/temp2,buffer_index);	// sometimes this might not be sufficient, see function convertStringtoDouble
		else{
			convertDoubleToState(index_state,temp1,buffer_index);
		}
	}	
}

/*! \file fmu.h
 * This file contains the definitions of the functions used by myfmu.cpp:
 * 		initialize(fmi2String );
 * 			this one needs the string as parameter to forward the path where the resources folder is unzipped
 *		void doStep(const char*);
 * 			this is the function called every time the fmi2DoStep is invoked
 *		void terminate();
 * 			this is the function called when the co-simulation terminates
 * 		FmiBuffer
 * 			This structure maintains all the variables that are accessed by means of fmi2GetXXX and fmi2SetXXX
 *
 **/
#ifndef FMU_H
#define FMU_H

#include "./fmi/fmi2Functions.h"
#include "FmuGUID.h"
#include "misraC/LFR_environment.h"
#include <libwebsockets.h>

#define BOOL_COUNT 11
#define INT_COUNT 11
#define REAL_COUNT 11
#define STRING_COUNT 11
#define FMI_COSIMULATION

typedef struct {
     fmi2Boolean booleanBuffer[BOOL_COUNT];
     fmi2Integer intBuffer[INT_COUNT];
     fmi2Real realBuffer[REAL_COUNT];
     fmi2String stringBuffer[STRING_COUNT];
} FmiBuffer;;

typedef struct {
	FmiBuffer fmiBuffer;
	State st; 		// Structure containing the state of the model
	int first;	 	// Variable for execution of setup option during first step only
	int port;
	int websocket_open;
	struct lws_context* context;
	char lwssendstate[LWS_SEND_BUFFER_PRE_PADDING + LWS_SEND_BUFFER_POST_PADDING+2800];
} ModelInstance;

void initialize(ModelInstance*, fmi2String);
void create_websocket(ModelInstance*, int);
int open_websocket(ModelInstance*);
void doStep(ModelInstance*, const char*);
void terminate(ModelInstance*);
void stateToString(State, char*);
void messageHandler(ModelInstance*, char*);
void close_websocket(ModelInstance*);


#endif // FMU_H

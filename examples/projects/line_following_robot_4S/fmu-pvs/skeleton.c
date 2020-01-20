/*! \file skeleton.c 
 * In this file there are the implementations
 * of the fuctions declared in fmu.h
 * along with the data needed.
 */
#include "fmu.h"


 /**
 * Function for the initialization of the model.
 * It calls the init function of the model and sets the output.
 * It initializes the semaphore and creates the websocket thread.
 * @param location is the directory where the fmu has been unzipped. Might be used in future version
 * 
 */
void initialize(ModelInstance* comp, const char* location) {
    init(&comp->st);
    
    comp->fmiBuffer.realBuffer[11] = comp->st.servoLeftVal;
    comp->fmiBuffer.realBuffer[12] = comp->st.servoRightVal;
    
    comp->fmiBuffer.realBuffer[1] = comp->st.forwardSpeed;
    comp->fmiBuffer.realBuffer[2] = comp->st.highRotate;
    comp->fmiBuffer.realBuffer[7] = comp->st.lowRotate;
    comp->fmiBuffer.realBuffer[8] = comp->st.mediumRotate;

    comp->first = 0;   
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
	
		comp->st.forwardSpeed = comp->fmiBuffer.realBuffer[1];
		comp->st.highRotate = comp->fmiBuffer.realBuffer[2];
		comp->st.lowRotate = comp->fmiBuffer.realBuffer[7];
		comp->st.mediumRotate = comp->fmiBuffer.realBuffer[8];
		
		comp->first = 1;
	}
	
    comp->st.lfFarLeftVal = comp->fmiBuffer.realBuffer[3];
    comp->st.lfFarRightVal = comp->fmiBuffer.realBuffer[4];
    comp->st.lfMidLeftVal = comp->fmiBuffer.realBuffer[5];
    comp->st.lfMidRightVal = comp->fmiBuffer.realBuffer[6];
    comp->st.posx = comp->fmiBuffer.realBuffer[9];
    comp->st.posy = comp->fmiBuffer.realBuffer[10];
	
    tick(&comp->st);
       
    
    comp->fmiBuffer.realBuffer[11] = comp->st.servoLeftVal;
    comp->fmiBuffer.realBuffer[12] = comp->st.servoRightVal;
    
    //comp->fmiBuffer.realBuffer[1] = comp->st.forwardSpeed;
    //comp->fmiBuffer.realBuffer[2] = comp->st.highRotate;
    //comp->fmiBuffer.realBuffer[7] = comp->st.lowRotate;
    //comp->fmiBuffer.realBuffer[8] = comp->st.mediumRotate;
    
    
}

void terminate(ModelInstance* comp) {
	
}



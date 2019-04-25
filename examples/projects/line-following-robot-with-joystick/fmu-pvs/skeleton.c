/*! \file skeleton.c 
 * In this file there are the implementations
 * of the fuctions declared in fmu.h
 * along with the data needed.
 */
#include "fmu.h"
#include "misraC/line-following-robot-with-joystick.h"


State st; /*!< structure containing the state of the model */
int first = 0; /* variable for execution of setup option during first step only */


 /**
       * function for the initialization of the model.
       * It calls the init function of the model and
       * 	sets the output
       * @param location is the directory where the fmu has been unzipped. Might be used in future version
       * 
       */


void initialize(const char* location) {
    init(&st);
    fmiBuffer.realBuffer[7] = st.out1;
    fmiBuffer.realBuffer[8] = st.out2;
    fmiBuffer.realBuffer[9] = st.out3;
    fmiBuffer.realBuffer[10] = st.out4;
    fmiBuffer.realBuffer[11] = st.servoLeftVal;
    fmiBuffer.realBuffer[12] = st.servoRightVal;
    
    
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

    st.backwardRotate = fmiBuffer.realBuffer[1] ;
    st.forwardRotate = fmiBuffer.realBuffer[2] ;
    st.forwardSpeed = fmiBuffer.realBuffer[3] ;
    st.LSR_THRESHOLD = fmiBuffer.realBuffer[6] ;
    
    first = 1;
}
	
    st.lfLeftVal = fmiBuffer.realBuffer[4];
    st.lfRightVal = fmiBuffer.realBuffer[5];
	
    tick(&st);
    
    
    fmiBuffer.realBuffer[7] = st.out1;
    fmiBuffer.realBuffer[8] = st.out2;
    fmiBuffer.realBuffer[9] = st.out3;
    fmiBuffer.realBuffer[10] = st.out4;
    fmiBuffer.realBuffer[11] = st.servoLeftVal;
    fmiBuffer.realBuffer[12] = st.servoRightVal;
    /*
    fmiBuffer.realBuffer[1] = st.backwardRotate;
    fmiBuffer.realBuffer[2] = st.forwardRotate;
    fmiBuffer.realBuffer[3] = st.forwardSpeed;
    fmiBuffer.realBuffer[6] = st.LSR_THRESHOLD;*/
}

void terminate(){ }



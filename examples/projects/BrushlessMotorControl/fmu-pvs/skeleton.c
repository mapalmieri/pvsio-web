/*! \file skeleton.c 
 * In this file there are the implementations
 * of the fuctions declared in fmu.h
 * along with the data needed.
 */
#include "fmu.h"
#include "misraC/BrushlessMotorControl.h"


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
    fmiBuffer.realBuffer[6] = st.error_theta;
    fmiBuffer.realBuffer[7] = st.error_xd;
    fmiBuffer.realBuffer[12] = st.J1;
    fmiBuffer.realBuffer[13] = st.J2;
    fmiBuffer.realBuffer[14] = st.J3;
    fmiBuffer.realBuffer[30] = st.Ud_control;
    fmiBuffer.realBuffer[31] = st.Uq_control;
    
    
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

    st.a1 = fmiBuffer.realBuffer[1] ;
    st.a2 = fmiBuffer.realBuffer[2] ;
    st.a3 = fmiBuffer.realBuffer[3] ;
    st.b = fmiBuffer.realBuffer[5] ;
    st.J = fmiBuffer.realBuffer[11] ;
    st.k = fmiBuffer.realBuffer[15] ;
    st.k11 = fmiBuffer.realBuffer[16] ;
    st.k12 = fmiBuffer.realBuffer[17] ;
    st.k21 = fmiBuffer.realBuffer[18] ;
    st.k22 = fmiBuffer.realBuffer[19] ;
    st.L = fmiBuffer.realBuffer[20] ;
    st.p = fmiBuffer.realBuffer[22] ;
    st.R = fmiBuffer.realBuffer[23] ;
    st.T1 = fmiBuffer.realBuffer[24] ;
    st.T2 = fmiBuffer.realBuffer[25] ;
    st.T3 = fmiBuffer.realBuffer[26] ;
    st.T4 = fmiBuffer.realBuffer[27] ;
    st.v1 = fmiBuffer.realBuffer[32] ;
    st.v2 = fmiBuffer.realBuffer[33] ;
    st.x1 = fmiBuffer.realBuffer[34] ;
    st.x2 = fmiBuffer.realBuffer[35] ;
    st.x3 = fmiBuffer.realBuffer[36] ;
    st.x4 = fmiBuffer.realBuffer[37] ;
    st.y1 = fmiBuffer.realBuffer[38] ;
    st.y1_des = fmiBuffer.realBuffer[39] ;
    st.y2 = fmiBuffer.realBuffer[40] ;
    st.y2_des = fmiBuffer.realBuffer[41] ;
    st.z = fmiBuffer.realBuffer[42] ;
    
    first = 1;
}
	
    st.Id = fmiBuffer.realBuffer[8];
    st.Id_des = fmiBuffer.realBuffer[9];
    st.Iq = fmiBuffer.realBuffer[10];
    st.Omega = fmiBuffer.realBuffer[21];
    st.Theta = fmiBuffer.realBuffer[28];
    st.Theta_des = fmiBuffer.realBuffer[29];
	
    tick(&st);
    
    
    fmiBuffer.realBuffer[6] = st.error_theta;
    fmiBuffer.realBuffer[7] = st.error_xd;
    fmiBuffer.realBuffer[12] = st.J1;
    fmiBuffer.realBuffer[13] = st.J2;
    fmiBuffer.realBuffer[14] = st.J3;
    fmiBuffer.realBuffer[30] = st.Ud_control;
    fmiBuffer.realBuffer[31] = st.Uq_control;
    /*
    fmiBuffer.realBuffer[32] = st.v1;
    fmiBuffer.realBuffer[33] = st.v2;
    fmiBuffer.realBuffer[34] = st.x1;
    fmiBuffer.realBuffer[35] = st.x2;
    fmiBuffer.realBuffer[36] = st.x3;
    fmiBuffer.realBuffer[37] = st.x4;
    fmiBuffer.realBuffer[38] = st.y1;
    fmiBuffer.realBuffer[39] = st.y1_des;
    fmiBuffer.realBuffer[40] = st.y2;
    fmiBuffer.realBuffer[41] = st.y2_des;*/
}

void terminate(){ }



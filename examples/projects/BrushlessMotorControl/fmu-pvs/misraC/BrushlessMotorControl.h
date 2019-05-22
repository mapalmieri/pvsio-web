#ifndef _misraC_BrushlessMotorControl_
#define _misraC_BrushlessMotorControl_

#include <assert.h>
#include <stdio.h>
#include <math.h>

#include "misraC_basic_types.h"
/**
 * operating modes
 */
typedef enum { X1 } Mode;

/**
 * state attributes
 */
typedef struct { 
    Mode mode;
    Mode previous_mode;
    float64_t a1; //-- real
    float64_t a2; //-- real
    float64_t a3; //-- real
    float64_t a4; //-- real
    float64_t b; //-- real
    float64_t error_theta; //-- real
    float64_t error_xd; //-- real
    float64_t Id; //-- real
    float64_t Id_des; //-- real
    float64_t Iq; //-- real
    float64_t J; //-- real
    float64_t J1; //-- real
    float64_t J2; //-- real
    float64_t J3; //-- real
    float64_t J4;
    float64_t k; //-- real
    float64_t k11; //-- real
    float64_t k12; //-- real
    float64_t k21; //-- real
    float64_t k22; //-- real
    float64_t L; //-- real
    float64_t Omega; //-- real
    float64_t p; //-- real
    float64_t R; //-- real
    float64_t T1; //-- real
    float64_t T2; //-- real
    float64_t T3; //-- real
    float64_t T4; //-- real
    float64_t Theta; //-- real
    float64_t Theta_des; //-- real
    float64_t Ud_control; //-- real
    float64_t Uq_control; //-- real
    float64_t v1; //-- real
    float64_t v2; //-- real
    float64_t x1; //-- real
    float64_t x2; //-- real
    float64_t x3; //-- real
    float64_t x4; //-- real
    float64_t y1; //-- real
    float64_t y1_des; //-- real
    float64_t y2; //-- real
    float64_t y2_des; //-- real
    float64_t z; //-- real
} State;

/**
 * init function
 */
void init(State* st);

/**
 * triggers
 */
bool per_tick(State* st);
State* tick(State* st);


/**
 * leave/enter functions
 */
void enter(Mode m, State* st);
void leave(Mode m, State* st);

#endif

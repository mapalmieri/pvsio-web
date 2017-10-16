#ifndef _misraC_LFRController_
#define _misraC_LFRController_

#include <assert.h>
#include <stdio.h>
#include "pvsioweb_utils.h"
#include "misraC_basic_types.h"
/**
 * user-defined datatypes
 */
typedef enum { BLACK, WHITE } Color;
typedef enum { AUTO, MANUAL } ControlMode;
typedef enum { DRIVE, REVERSE, NEUTRAL } Gear;

/**
 * operating modes
 */
typedef enum { AUTO, MANUAL } Mode;

/**
 * state attributes
 */
typedef struct { 
    Mode mode;
    Gear gear;
    D_64 lightsensor_left; //-- real
    D_64 lightsensor_right; //-- real
    D_64 motorspeed_left; //-- real
    D_64 motorspeed_right; //-- real
} State;

/**
 * init function
 */
void init(State* st);

/**
 * triggers
 */
bool per_accelerate(State* st);
State* accelerate(State* st);
bool per_autopilot(State* st);
State* autopilot(State* st);
bool per_brake(State* st);
State* brake(State* st);
bool per_tick(State* st);
State* tick(State* st);


/**
 * leave/enter functions
 */
void enter(Mode m, State* st);
void leave(Mode m, State* st);

#endif

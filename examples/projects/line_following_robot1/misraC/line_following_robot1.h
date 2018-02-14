#ifndef _misraC_line_following_robot1_
#define _misraC_line_following_robot1_

#include <assert.h>
#include <stdio.h>
#include "pvsioweb_utils.h"
#include "misraC_basic_types.h"
/**
 * user-defined datatypes
 */
typedef enum { BLACK, WHITE } Color;
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
    Mode previous_mode;
    Gear gear;
    float64_t lightsensor_left; //-- real
    float64_t lightsensor_right; //-- real
    float64_t motorspeed_left; //-- real
    float64_t motorspeed_right; //-- real
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

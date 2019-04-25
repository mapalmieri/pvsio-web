#ifndef _misraC_line-following-robot-with-joystick_
#define _misraC_line-following-robot-with-joystick_

#include <assert.h>
#include <stdio.h>
#include "pvsioweb_utils.h"
#include "misraC_basic_types.h"
/**
 * operating modes
 */
typedef enum { Auto, Manual } Mode;

/**
 * state attributes
 */
typedef struct { 
    Mode mode;
    Mode previous_mode;
    float64_t backwardRotate; //-- real
    float64_t forwardRotate; //-- real
    float64_t forwardSpeed; //-- real
    float64_t lfLeftVal; //-- real
    float64_t lfRightVal; //-- real
    float64_t LSR_THRESHOLD; //-- real
    float64_t out1; //-- real
    float64_t out2; //-- real
    float64_t out3; //-- real
    float64_t out4; //-- real
    float64_t servoLeftVal; //-- real
    float64_t servoRightVal; //-- real
} State;

/**
 * init function
 */
void init(State* st);

/**
 * triggers
 */
bool per_accellerate(State* st);
State* accellerate(State* st);
bool per_autopilot(State* st);
State* autopilot(State* st);
bool per_brake(State* st);
State* brake(State* st);
bool per_tick(State* st);
State* tick(State* st);
bool per_turnLeft(State* st);
State* turnLeft(State* st);
bool per_turnRight(State* st);
State* turnRight(State* st);


/**
 * leave/enter functions
 */
void enter(Mode m, State* st);
void leave(Mode m, State* st);

#endif

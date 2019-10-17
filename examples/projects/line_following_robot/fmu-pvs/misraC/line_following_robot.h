#ifndef _misraC_line_following_robot_
#define _misraC_line_following_robot_

#include <assert.h>
#include <stdio.h>
#include "misraC_basic_types.h"
/**
 * operating modes
 */
typedef enum { AUTO, DRIVE, REVERSE } Mode;

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
    int64_t port; //-- int
    float64_t posx; //-- real
    float64_t posy; //-- real
    float64_t servoLeftVal; //-- real
    float64_t servoRightVal; //-- real
    float64_t time; //-- real
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
bool per_drive(State* st);
State* drive(State* st);
bool per_left(State* st);
State* left(State* st);
bool per_reverse(State* st);
State* reverse(State* st);
bool per_right(State* st);
State* right(State* st);
bool per_tick(State* st);
State* tick(State* st);


/**
 * leave/enter functions
 */
void enter(Mode m, State* st);
void leave(Mode m, State* st);

#endif

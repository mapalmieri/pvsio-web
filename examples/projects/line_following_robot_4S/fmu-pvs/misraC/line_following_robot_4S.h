#ifndef _misraC_line_following_robot_4S_
#define _misraC_line_following_robot_4S_

#include <assert.h>
#include <stdio.h>
#include "misraC_basic_types.h"
/**
 * operating modes
 */
typedef enum { AUTO } Mode;

/**
 * state attributes
 */
typedef struct { 
    Mode mode;
    Mode previous_mode;
    float64_t forwardSpeed; //-- real
    float64_t highRotate; //-- real
    float64_t lfFarLeftVal; //-- real
    float64_t lfFarRightVal; //-- real
    float64_t lfMidLeftVal; //-- real
    float64_t lfMidRightVal; //-- real
    float64_t lowRotate; //-- real
    float64_t mediumRotate; //-- real
    float64_t posx; //-- real
    float64_t posy; //-- real
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
bool per_tick(State* st);
State* tick(State* st);


/**
 * leave/enter functions
 */
void enter(Mode m, State* st);
void leave(Mode m, State* st);

#endif

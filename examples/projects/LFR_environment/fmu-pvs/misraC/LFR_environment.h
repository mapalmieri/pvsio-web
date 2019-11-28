#ifndef _misraC_LFR_environment_
#define _misraC_LFR_environment_

#include <assert.h>
#include <stdio.h>
#include "misraC_basic_types.h"
/**
 * operating modes
 */
typedef enum { DISPLAY } Mode;

/**
 * state attributes
 */
typedef struct { 
    Mode mode;
    Mode previous_mode;
    float64_t output; //-- real
    int32_t port; //-- int
    float64_t posx1; //-- real
    float64_t posx2; //-- real
    float64_t posx3; //-- real
    float64_t posy1; //-- real
    float64_t posy2; //-- real
    float64_t posy3; //-- real
    float64_t tickSize; //-- real
    float64_t time; //-- real
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

#include "LFR_environment.h"
/**
 * init function
 */
void init(State* st) { 
    st->previous_mode = DISPLAY;
    st->mode = DISPLAY;
    st->output = 1.0f;
    st->port = 8084;
    st->posx1 = 0.0f;
    st->posx2 = 0.0f;
    st->posx3 = 0.0f;
    st->posy1 = 0.0f;
    st->posy2 = 0.0f;
    st->posy3 = 0.0f;
    st->tickSize = 0.01f;
    st->time = 0.0f;
}

/**
 * leave/enter functions
 */
void enter(Mode m, State* st) { 
    st->mode = m;
}
void leave(Mode m, State* st) { 
    st->previous_mode = m;
}

/**
 * triggers
 */
bool per_tick(State* st) {
    return (st->mode == DISPLAY);
}
State* tick(State* st) {
    // assert( per_tick(st) );
    if (st->mode == DISPLAY) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DISPLAY");
        #endif
        leave(DISPLAY, st);
        st->time = st->time + st->tickSize;
        enter(DISPLAY, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}





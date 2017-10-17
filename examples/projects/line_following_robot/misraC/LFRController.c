#include "LFRController.h"
/**
 * user-defined constants
 */
const float64_t ACC_STEP = 0.1f;
const float64_t BRAKE_STEP = 0.1f;
const float64_t LSR_THRESHOLD = 150.0f;
const float64_t SPEED1 = 0.1f;
const float64_t SPEED4 = 0.4f;
const float64_t SPEED5 = 0.5f;

/**
 * init function
 */
void init(State* st) { 
    st->mode = AUTO;
    st->gear = DRIVE;
    st->lightsensor_left = 0.0f;
    st->lightsensor_right = 0.0f;
    st->motorspeed_left = 0.0f;
    st->motorspeed_right = 0.0f;
}

/**
 * leave/enter functions
 */
void enter(Mode m, State* st) { 
    st->mode = m;
}
void leave(Mode m, State* st) { 
    //-- nothing to do, previous state is not part of the state variables
}

/**
 * triggers
 */
bool per_accelerate(State* st) {
    return (st->mode == AUTO && ( st->gear == NEUTRAL ))
            || (st->mode == AUTO && ( st->gear == REVERSE ))
            || (st->mode == MANUAL && ( st->gear == REVERSE ));
}
State* accelerate(State* st) {
    assert( per_accelerate(st) );
    if (st->mode == AUTO && ( st->gear == NEUTRAL )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->gear == NEUTRAL )");
        #endif
        leave(AUTO, st);
        enter(MANUAL, st);
    } else if (st->mode == AUTO && ( st->gear == REVERSE )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->gear == REVERSE )");
        #endif
        leave(AUTO, st);
        st->motorspeed_left = inc_CCW_speed(st->motorspeed_left,ACC_STEP);
        st->motorspeed_right = inc_CW_speed(st->motorspeed_right,ACC_STEP);
        enter(MANUAL, st);
    } else if (st->mode == MANUAL && ( st->gear == REVERSE )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == MANUAL && ( st->gear == REVERSE )");
        #endif
        leave(MANUAL, st);
        st->motorspeed_left = inc_CCW_speed(st->motorspeed_left,ACC_STEP);
        st->motorspeed_right = inc_CW_speed(st->motorspeed_right,ACC_STEP);
        enter(MANUAL, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_autopilot(State* st) {
    return (st->mode == MANUAL);
}
State* autopilot(State* st) {
    assert( per_autopilot(st) );
    if (st->mode == MANUAL) {
        #ifdef DBG
        _dbg_print_condition("st->mode == MANUAL");
        #endif
        leave(MANUAL, st);
        enter(AUTO, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_brake(State* st) {
    return (st->mode == AUTO)
            || (st->mode == MANUAL);
}
State* brake(State* st) {
    assert( per_brake(st) );
    if (st->mode == AUTO) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO");
        #endif
        leave(AUTO, st);
        st->motorspeed_left = dec_speed(st->motorspeed_left,BRAKE_STEP);
        st->motorspeed_right = dec_speed(st->motorspeed_right,BRAKE_STEP);
        enter(MANUAL, st);
    } else if (st->mode == MANUAL) {
        #ifdef DBG
        _dbg_print_condition("st->mode == MANUAL");
        #endif
        leave(MANUAL, st);
        st->motorspeed_left = dec_speed(st->motorspeed_left,BRAKE_STEP);
        st->motorspeed_right = dec_speed(st->motorspeed_right,BRAKE_STEP);
        enter(MANUAL, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_tick(State* st) {
    return (st->mode == AUTO && ( st->lightsensor_right < LSR_THRESHOLD && st->lightsensor_left < LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lightsensor_right > LSR_THRESHOLD && st->lightsensor_left < LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lightsensor_right > LSR_THRESHOLD && st->lightsensor_left > LSR_THRESHOLD ));
}
State* tick(State* st) {
    assert( per_tick(st) );
    if (st->mode == AUTO && ( st->lightsensor_right < LSR_THRESHOLD && st->lightsensor_left < LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lightsensor_right < LSR_THRESHOLD && st->lightsensor_left < LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->motorspeed_left = SPEED4;
        st->motorspeed_right = - SPEED4;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lightsensor_right > LSR_THRESHOLD && st->lightsensor_left < LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lightsensor_right > LSR_THRESHOLD && st->lightsensor_left < LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->motorspeed_left = SPEED5;
        st->motorspeed_right = - SPEED1;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lightsensor_right > LSR_THRESHOLD && st->lightsensor_left > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lightsensor_right > LSR_THRESHOLD && st->lightsensor_left > LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->motorspeed_left = SPEED1;
        st->motorspeed_right = - SPEED5;
        enter(AUTO, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}





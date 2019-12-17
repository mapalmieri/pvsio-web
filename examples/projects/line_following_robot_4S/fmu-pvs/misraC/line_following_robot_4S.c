#include "line_following_robot_4S.h"
/**
 * user-defined constants
 */
const float64_t ACCELERATION_FACTOR = 0.2f;
const float64_t ACCELERATION_MAX_THRESHOLD = 0.8f;
const float64_t ACCELERATION_MIN_THRESHOLD = 0.2f;
const float64_t LSR_THRESHOLD = 150.0f;
const float64_t NEG_ACCELERATION_MAX_THRESHOLD = -0.8f;
const float64_t NEG_ACCELERATION_MIN_THRESHOLD = -0.2f;

/**
 * init function
 */
void init(State* st) { 
    st->previous_mode = AUTO;
    st->mode = AUTO;
    st->forwardSpeed = 0.6f;
    st->highRotate = 0.45f;
    st->lfFarLeftVal = 0.0f;
    st->lfFarRightVal = 0.0f;
    st->lfMidLeftVal = 0.0f;
    st->lfMidRightVal = 0.0f;
    st->lowRotate = 0.0f;
    st->mediumRotate = 0.3f;
    st->port = 8084;
    st->posx = 0.138f;
    st->posy = -0.08f;
    st->servoLeftVal = 0.0f;
    st->servoRightVal = 0.0f;
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
    return (st->mode == AUTO && ( st->lfFarLeftVal <= LSR_THRESHOLD && st->lfMidLeftVal <= LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfFarLeftVal <= LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal <= LSR_THRESHOLD && st->lfMidRightVal <= LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal <= LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal <= LSR_THRESHOLD && st->lfFarRightVal <= LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal <= LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal <= LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD ));
}
State* tick(State* st) {
    // assert( per_tick(st) );
    if (st->mode == AUTO && ( st->lfFarLeftVal <= LSR_THRESHOLD && st->lfMidLeftVal <= LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfFarLeftVal <= LSR_THRESHOLD && st->lfMidLeftVal <= LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->mediumRotate;
        st->servoRightVal = - st->forwardSpeed;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lfFarLeftVal <= LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfFarLeftVal <= LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->lowRotate;
        st->servoRightVal = - st->forwardSpeed;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal <= LSR_THRESHOLD && st->lfMidRightVal <= LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal <= LSR_THRESHOLD && st->lfMidRightVal <= LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->forwardSpeed;
        st->servoRightVal = - st->forwardSpeed;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal <= LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal <= LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->highRotate;
        st->servoRightVal = - st->forwardSpeed;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal <= LSR_THRESHOLD && st->lfFarRightVal <= LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal <= LSR_THRESHOLD && st->lfFarRightVal <= LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->forwardSpeed;
        st->servoRightVal = - st->mediumRotate;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal <= LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal <= LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->forwardSpeed;
        st->servoRightVal = - st->highRotate;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal <= LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal <= LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->forwardSpeed;
        st->servoRightVal = - st->lowRotate;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfFarLeftVal > LSR_THRESHOLD && st->lfMidLeftVal > LSR_THRESHOLD && st->lfMidRightVal > LSR_THRESHOLD && st->lfFarRightVal > LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        enter(AUTO, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}





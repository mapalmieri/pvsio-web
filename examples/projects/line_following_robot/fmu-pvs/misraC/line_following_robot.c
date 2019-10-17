#include "line_following_robot.h"
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
    st->backwardRotate = 0.1f;
    st->forwardRotate = 0.5f;
    st->forwardSpeed = 0.4f;
    st->lfLeftVal = 0.0f;
    st->lfRightVal = 0.0f;
    st->port = 8084;
    st->posx = 0.138f;
    st->posy = -0.08f;
    st->servoLeftVal = 0.0f;
    st->servoRightVal = 0.0f;
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
bool per_accelerate(State* st) {
    return (st->mode == REVERSE && ( st->servoLeftVal < NEG_ACCELERATION_MAX_THRESHOLD || st->servoRightVal > ACCELERATION_MAX_THRESHOLD || st->backwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardSpeed > ACCELERATION_MAX_THRESHOLD ))
            || (st->mode == DRIVE && ( st->servoLeftVal <= ACCELERATION_MAX_THRESHOLD && st->servoRightVal >= NEG_ACCELERATION_MAX_THRESHOLD ))
            || (st->mode == AUTO && ( st->servoLeftVal <= ACCELERATION_MAX_THRESHOLD && st->servoRightVal >= NEG_ACCELERATION_MAX_THRESHOLD && st->backwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardSpeed <= ACCELERATION_MAX_THRESHOLD ))
            || (st->mode == DRIVE && ( st->servoLeftVal > ACCELERATION_MAX_THRESHOLD || st->servoRightVal < NEG_ACCELERATION_MAX_THRESHOLD ))
            || (st->mode == AUTO && ( st->servoLeftVal > ACCELERATION_MAX_THRESHOLD || st->servoRightVal < NEG_ACCELERATION_MAX_THRESHOLD || st->backwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardSpeed > ACCELERATION_MAX_THRESHOLD ))
            || (st->mode == REVERSE && ( st->servoLeftVal >= NEG_ACCELERATION_MAX_THRESHOLD && st->servoRightVal <= ACCELERATION_MAX_THRESHOLD && st->backwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardSpeed <= ACCELERATION_MAX_THRESHOLD ));
}
State* accelerate(State* st) {
    // assert( per_accelerate(st) );
    if (st->mode == REVERSE && ( st->servoLeftVal < NEG_ACCELERATION_MAX_THRESHOLD || st->servoRightVal > ACCELERATION_MAX_THRESHOLD || st->backwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardSpeed > ACCELERATION_MAX_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE && ( st->servoLeftVal < NEG_ACCELERATION_MAX_THRESHOLD || st->servoRightVal > ACCELERATION_MAX_THRESHOLD || st->backwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardSpeed > ACCELERATION_MAX_THRESHOLD )");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        st->backwardRotate = st->backwardRotate;
        st->forwardRotate = st->forwardRotate;
        st->forwardSpeed = st->forwardSpeed;
        enter(REVERSE, st);
    } else if (st->mode == DRIVE && ( st->servoLeftVal <= ACCELERATION_MAX_THRESHOLD && st->servoRightVal >= NEG_ACCELERATION_MAX_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE && ( st->servoLeftVal <= ACCELERATION_MAX_THRESHOLD && st->servoRightVal >= NEG_ACCELERATION_MAX_THRESHOLD )");
        #endif
        leave(DRIVE, st);
        st->servoLeftVal = st->servoLeftVal + ACCELERATION_FACTOR;
        st->servoRightVal = st->servoRightVal - ACCELERATION_FACTOR;
        enter(DRIVE, st);
    } else if (st->mode == AUTO && ( st->servoLeftVal <= ACCELERATION_MAX_THRESHOLD && st->servoRightVal >= NEG_ACCELERATION_MAX_THRESHOLD && st->backwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardSpeed <= ACCELERATION_MAX_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->servoLeftVal <= ACCELERATION_MAX_THRESHOLD && st->servoRightVal >= NEG_ACCELERATION_MAX_THRESHOLD && st->backwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardSpeed <= ACCELERATION_MAX_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->servoLeftVal + ACCELERATION_FACTOR;
        st->servoRightVal = st->servoRightVal - ACCELERATION_FACTOR;
        st->backwardRotate = st->backwardRotate + ACCELERATION_FACTOR;
        st->forwardRotate = st->forwardRotate + ACCELERATION_FACTOR;
        st->forwardSpeed = st->forwardSpeed + ACCELERATION_FACTOR;
        enter(AUTO, st);
    } else if (st->mode == DRIVE && ( st->servoLeftVal > ACCELERATION_MAX_THRESHOLD || st->servoRightVal < NEG_ACCELERATION_MAX_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE && ( st->servoLeftVal > ACCELERATION_MAX_THRESHOLD || st->servoRightVal < NEG_ACCELERATION_MAX_THRESHOLD )");
        #endif
        leave(DRIVE, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        enter(DRIVE, st);
    } else if (st->mode == AUTO && ( st->servoLeftVal > ACCELERATION_MAX_THRESHOLD || st->servoRightVal < NEG_ACCELERATION_MAX_THRESHOLD || st->backwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardSpeed > ACCELERATION_MAX_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->servoLeftVal > ACCELERATION_MAX_THRESHOLD || st->servoRightVal < NEG_ACCELERATION_MAX_THRESHOLD || st->backwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardRotate > ACCELERATION_MAX_THRESHOLD || st->forwardSpeed > ACCELERATION_MAX_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        st->backwardRotate = st->backwardRotate;
        st->forwardRotate = st->forwardRotate;
        st->forwardSpeed = st->forwardSpeed;
        enter(AUTO, st);
    } else if (st->mode == REVERSE && ( st->servoLeftVal >= NEG_ACCELERATION_MAX_THRESHOLD && st->servoRightVal <= ACCELERATION_MAX_THRESHOLD && st->backwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardSpeed <= ACCELERATION_MAX_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE && ( st->servoLeftVal >= NEG_ACCELERATION_MAX_THRESHOLD && st->servoRightVal <= ACCELERATION_MAX_THRESHOLD && st->backwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardRotate <= ACCELERATION_MAX_THRESHOLD && st->forwardSpeed <= ACCELERATION_MAX_THRESHOLD )");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = st->servoLeftVal - ACCELERATION_FACTOR;
        st->servoRightVal = st->servoRightVal + ACCELERATION_FACTOR;
        st->backwardRotate = st->backwardRotate + ACCELERATION_FACTOR;
        st->forwardRotate = st->forwardRotate + ACCELERATION_FACTOR;
        st->forwardSpeed = st->forwardSpeed + ACCELERATION_FACTOR;
        enter(REVERSE, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_autopilot(State* st) {
    return (st->mode == DRIVE)
            || (st->mode == AUTO)
            || (st->mode == REVERSE);
}
State* autopilot(State* st) {
    // assert( per_autopilot(st) );
    if (st->mode == DRIVE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE");
        #endif
        leave(DRIVE, st);
        enter(AUTO, st);
    } else if (st->mode == AUTO) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO");
        #endif
        leave(AUTO, st);
        enter(AUTO, st);
    } else if (st->mode == REVERSE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = - st->servoLeftVal;
        st->servoRightVal = - st->servoRightVal;
        st->backwardRotate = - st->backwardRotate;
        st->forwardRotate = - st->forwardRotate;
        st->forwardSpeed = - st->forwardSpeed;
        enter(AUTO, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_brake(State* st) {
    return (st->mode == DRIVE && ( st->servoLeftVal < ACCELERATION_MIN_THRESHOLD || st->servoRightVal > NEG_ACCELERATION_MIN_THRESHOLD ))
            || (st->mode == AUTO && ( st->servoLeftVal < ACCELERATION_MIN_THRESHOLD || st->servoRightVal > NEG_ACCELERATION_MIN_THRESHOLD || st->backwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardSpeed < ACCELERATION_MIN_THRESHOLD ))
            || (st->mode == REVERSE && ( st->servoLeftVal <= NEG_ACCELERATION_MIN_THRESHOLD && st->servoRightVal >= ACCELERATION_MIN_THRESHOLD && st->backwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardSpeed >= ACCELERATION_MIN_THRESHOLD ))
            || (st->mode == REVERSE && ( st->servoLeftVal > NEG_ACCELERATION_MIN_THRESHOLD || st->servoRightVal < ACCELERATION_MIN_THRESHOLD || st->backwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardSpeed < ACCELERATION_MIN_THRESHOLD ))
            || (st->mode == DRIVE && ( st->servoLeftVal >= ACCELERATION_MIN_THRESHOLD && st->servoRightVal <= NEG_ACCELERATION_MIN_THRESHOLD ))
            || (st->mode == AUTO && ( st->servoLeftVal >= ACCELERATION_MIN_THRESHOLD && st->servoRightVal <= NEG_ACCELERATION_MIN_THRESHOLD && st->backwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardSpeed >= ACCELERATION_MIN_THRESHOLD ));
}
State* brake(State* st) {
    // assert( per_brake(st) );
    if (st->mode == DRIVE && ( st->servoLeftVal < ACCELERATION_MIN_THRESHOLD || st->servoRightVal > NEG_ACCELERATION_MIN_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE && ( st->servoLeftVal < ACCELERATION_MIN_THRESHOLD || st->servoRightVal > NEG_ACCELERATION_MIN_THRESHOLD )");
        #endif
        leave(DRIVE, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        enter(DRIVE, st);
    } else if (st->mode == AUTO && ( st->servoLeftVal < ACCELERATION_MIN_THRESHOLD || st->servoRightVal > NEG_ACCELERATION_MIN_THRESHOLD || st->backwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardSpeed < ACCELERATION_MIN_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->servoLeftVal < ACCELERATION_MIN_THRESHOLD || st->servoRightVal > NEG_ACCELERATION_MIN_THRESHOLD || st->backwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardSpeed < ACCELERATION_MIN_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        st->backwardRotate = st->backwardRotate;
        st->forwardRotate = st->forwardRotate;
        st->forwardSpeed = st->forwardSpeed;
        enter(AUTO, st);
    } else if (st->mode == REVERSE && ( st->servoLeftVal <= NEG_ACCELERATION_MIN_THRESHOLD && st->servoRightVal >= ACCELERATION_MIN_THRESHOLD && st->backwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardSpeed >= ACCELERATION_MIN_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE && ( st->servoLeftVal <= NEG_ACCELERATION_MIN_THRESHOLD && st->servoRightVal >= ACCELERATION_MIN_THRESHOLD && st->backwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardSpeed >= ACCELERATION_MIN_THRESHOLD )");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = st->servoLeftVal + ACCELERATION_FACTOR;
        st->servoRightVal = st->servoRightVal - ACCELERATION_FACTOR;
        st->backwardRotate = st->backwardRotate - ACCELERATION_FACTOR;
        st->forwardRotate = st->forwardRotate - ACCELERATION_FACTOR;
        st->forwardSpeed = st->forwardSpeed - ACCELERATION_FACTOR;
        enter(REVERSE, st);
    } else if (st->mode == REVERSE && ( st->servoLeftVal > NEG_ACCELERATION_MIN_THRESHOLD || st->servoRightVal < ACCELERATION_MIN_THRESHOLD || st->backwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardSpeed < ACCELERATION_MIN_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE && ( st->servoLeftVal > NEG_ACCELERATION_MIN_THRESHOLD || st->servoRightVal < ACCELERATION_MIN_THRESHOLD || st->backwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardRotate < ACCELERATION_MIN_THRESHOLD || st->forwardSpeed < ACCELERATION_MIN_THRESHOLD )");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        st->backwardRotate = st->backwardRotate;
        st->forwardRotate = st->forwardRotate;
        st->forwardSpeed = st->forwardSpeed;
        enter(REVERSE, st);
    } else if (st->mode == DRIVE && ( st->servoLeftVal >= ACCELERATION_MIN_THRESHOLD && st->servoRightVal <= NEG_ACCELERATION_MIN_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE && ( st->servoLeftVal >= ACCELERATION_MIN_THRESHOLD && st->servoRightVal <= NEG_ACCELERATION_MIN_THRESHOLD )");
        #endif
        leave(DRIVE, st);
        st->servoLeftVal = st->servoLeftVal - ACCELERATION_FACTOR;
        st->servoRightVal = st->servoRightVal + ACCELERATION_FACTOR;
        enter(DRIVE, st);
    } else if (st->mode == AUTO && ( st->servoLeftVal >= ACCELERATION_MIN_THRESHOLD && st->servoRightVal <= NEG_ACCELERATION_MIN_THRESHOLD && st->backwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardSpeed >= ACCELERATION_MIN_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->servoLeftVal >= ACCELERATION_MIN_THRESHOLD && st->servoRightVal <= NEG_ACCELERATION_MIN_THRESHOLD && st->backwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardRotate >= ACCELERATION_MIN_THRESHOLD && st->forwardSpeed >= ACCELERATION_MIN_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->servoLeftVal - ACCELERATION_FACTOR;
        st->servoRightVal = st->servoRightVal + ACCELERATION_FACTOR;
        st->backwardRotate = st->backwardRotate - ACCELERATION_FACTOR;
        st->forwardRotate = st->forwardRotate - ACCELERATION_FACTOR;
        st->forwardSpeed = st->forwardSpeed - ACCELERATION_FACTOR;
        enter(AUTO, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_drive(State* st) {
    return (st->mode == DRIVE)
            || (st->mode == AUTO)
            || (st->mode == REVERSE);
}
State* drive(State* st) {
    // assert( per_drive(st) );
    if (st->mode == DRIVE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE");
        #endif
        leave(DRIVE, st);
        enter(DRIVE, st);
    } else if (st->mode == AUTO) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = 0.0f;
        st->servoRightVal = 0.0f;
        enter(DRIVE, st);
    } else if (st->mode == REVERSE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = 0.0f;
        st->servoRightVal = 0.0f;
        enter(DRIVE, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_left(State* st) {
    return (st->mode == AUTO)
            || (st->mode == REVERSE)
            || (st->mode == DRIVE);
}
State* left(State* st) {
    // assert( per_left(st) );
    if (st->mode == AUTO) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO");
        #endif
        leave(AUTO, st);
        enter(AUTO, st);
    } else if (st->mode == REVERSE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE");
        #endif
        leave(REVERSE, st);
        enter(REVERSE, st);
    } else if (st->mode == DRIVE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE");
        #endif
        leave(DRIVE, st);
        st->servoLeftVal = st->backwardRotate;
        st->servoRightVal = - st->forwardRotate;
        enter(DRIVE, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_reverse(State* st) {
    return (st->mode == REVERSE)
            || (st->mode == AUTO)
            || (st->mode == DRIVE);
}
State* reverse(State* st) {
    // assert( per_reverse(st) );
    if (st->mode == REVERSE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE");
        #endif
        leave(REVERSE, st);
        enter(REVERSE, st);
    } else if (st->mode == AUTO) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = - st->servoLeftVal;
        st->servoRightVal = - st->servoRightVal;
        enter(REVERSE, st);
    } else if (st->mode == DRIVE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE");
        #endif
        leave(DRIVE, st);
        st->servoLeftVal = - st->servoLeftVal;
        st->servoRightVal = - st->servoRightVal;
        enter(REVERSE, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_right(State* st) {
    return (st->mode == AUTO)
            || (st->mode == REVERSE)
            || (st->mode == DRIVE);
}
State* right(State* st) {
    // assert( per_right(st) );
    if (st->mode == AUTO) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO");
        #endif
        leave(AUTO, st);
        enter(AUTO, st);
    } else if (st->mode == REVERSE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE");
        #endif
        leave(REVERSE, st);
        enter(REVERSE, st);
    } else if (st->mode == DRIVE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE");
        #endif
        leave(DRIVE, st);
        st->servoLeftVal = st->forwardRotate;
        st->servoRightVal = - st->backwardRotate;
        enter(DRIVE, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_tick(State* st) {
    return (st->mode == DRIVE)
            || (st->mode == REVERSE && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD ))
            || (st->mode == REVERSE && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD ))
            || (st->mode == REVERSE && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD ))
            || (st->mode == AUTO && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD ))
            || (st->mode == REVERSE && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD ));
}
State* tick(State* st) {
    // assert( per_tick(st) );
    if (st->mode == DRIVE) {
        #ifdef DBG
        _dbg_print_condition("st->mode == DRIVE");
        #endif
        leave(DRIVE, st);
        enter(DRIVE, st);
    } else if (st->mode == REVERSE && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD )");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = - st->forwardSpeed;
        st->servoRightVal = st->forwardSpeed;
        enter(REVERSE, st);
    } else if (st->mode == AUTO && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->forwardSpeed;
        st->servoRightVal = - st->forwardSpeed;
        enter(AUTO, st);
    } else if (st->mode == REVERSE && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD )");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = - st->backwardRotate;
        st->servoRightVal = st->forwardRotate;
        enter(REVERSE, st);
    } else if (st->mode == AUTO && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfLeftVal <= LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->forwardRotate;
        st->servoRightVal = - st->backwardRotate;
        enter(AUTO, st);
    } else if (st->mode == REVERSE && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD )");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = - st->forwardRotate;
        st->servoRightVal = st->backwardRotate;
        enter(REVERSE, st);
    } else if (st->mode == AUTO && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal <= LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->backwardRotate;
        st->servoRightVal = - st->forwardRotate;
        enter(AUTO, st);
    } else if (st->mode == AUTO && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == AUTO && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD )");
        #endif
        leave(AUTO, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        enter(AUTO, st);
    } else if (st->mode == REVERSE && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == REVERSE && ( st->lfLeftVal > LSR_THRESHOLD && st->lfRightVal > LSR_THRESHOLD )");
        #endif
        leave(REVERSE, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        enter(REVERSE, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}





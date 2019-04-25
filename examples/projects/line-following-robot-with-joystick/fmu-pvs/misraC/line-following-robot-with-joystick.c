#include "line-following-robot-with-joystick.h"
/**
 * user-defined constants
 */
const Speed IDLE = 0;
const Speed MAX_SPEED = 255;

/**
 * init function
 */
void init(State* st) { 
    st->previous_mode = Auto;
    st->mode = Auto;
    st->backwardRotate = 1.0f;
    st->forwardRotate = 5.0f;
    st->forwardSpeed = 4.0f;
    st->lfLeftVal = 0.0f;
    st->lfRightVal = 0.0f;
    st->LSR_THRESHOLD = 400.0f;
    st->out1 = 0.0f;
    st->out2 = 0.0f;
    st->out3 = 0.0f;
    st->out4 = 0.0f;
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
bool per_accellerate(State* st) {
    return (st->mode == Auto && ( true ))
            || (st->mode == Manual && ( true ));
}
State* accellerate(State* st) {
    // assert( per_accellerate(st) );
    if (st->mode == Auto && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Auto && ( true )");
        #endif
        leave(Auto, st);
        st->out1 = 1.0f;
        st->out2 = 0.0f;
        st->out3 = 1.0f;
        st->out4 = 0.0f;
        st->servoLeftVal = st->servoLeftVal + 0.1f;
        st->servoRightVal = st->servoRightVal + 0.1f;
        enter(Manual, st);
    } else if (st->mode == Manual && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Manual && ( true )");
        #endif
        leave(Manual, st);
        st->servoLeftVal = st->servoLeftVal + 0.1f;
        st->servoRightVal = st->servoRightVal + 0.1f;
        st->out1 = 1.0f;
        st->out2 = 0.0f;
        st->out3 = 1.0f;
        st->out4 = 0.0f;
        enter(Manual, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_autopilot(State* st) {
    return (st->mode == Manual && ( true ));
}
State* autopilot(State* st) {
    // assert( per_autopilot(st) );
    if (st->mode == Manual && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Manual && ( true )");
        #endif
        leave(Manual, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        enter(Auto, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_brake(State* st) {
    return (st->mode == Auto && ( true ))
            || (st->mode == Manual && ( true ));
}
State* brake(State* st) {
    // assert( per_brake(st) );
    if (st->mode == Auto && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Auto && ( true )");
        #endif
        leave(Auto, st);
        st->out1 = 0.0f;
        st->out2 = 0.0f;
        st->out3 = 0.0f;
        st->out4 = 0.0f;
        enter(Manual, st);
    } else if (st->mode == Manual && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Manual && ( true )");
        #endif
        leave(Manual, st);
        st->out1 = 0.0f;
        st->out2 = 0.0f;
        st->out3 = 0.0f;
        st->out4 = 0.0f;
        enter(Manual, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_tick(State* st) {
    return (st->mode == Auto && ( st->lfRightVal <= st->LSR_THRESHOLD && st->lfLeftVal <= st->LSR_THRESHOLD ))
            || (st->mode == Auto && ( st->lfRightVal <= st->LSR_THRESHOLD && st->lfLeftVal > st->LSR_THRESHOLD ))
            || (st->mode == Auto && ( st->lfRightVal > st->LSR_THRESHOLD && st->lfLeftVal <= st->LSR_THRESHOLD ))
            || (st->mode == Auto && ( st->lfRightVal > st->LSR_THRESHOLD && st->lfLeftVal > st->LSR_THRESHOLD ))
            || (st->mode == Manual && ( true ));
}
State* tick(State* st) {
    // assert( per_tick(st) );
    if (st->mode == Auto && ( st->lfRightVal <= st->LSR_THRESHOLD && st->lfLeftVal <= st->LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Auto && ( st->lfRightVal <= st->LSR_THRESHOLD && st->lfLeftVal <= st->LSR_THRESHOLD )");
        #endif
        leave(Auto, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        st->out1 = st->out1;
        st->out2 = st->out2;
        st->out3 = st->out3;
        st->out4 = st->out4;
        enter(Auto, st);
    } else if (st->mode == Auto && ( st->lfRightVal <= st->LSR_THRESHOLD && st->lfLeftVal > st->LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Auto && ( st->lfRightVal <= st->LSR_THRESHOLD && st->lfLeftVal > st->LSR_THRESHOLD )");
        #endif
        leave(Auto, st);
        st->servoLeftVal = st->forwardRotate;
        st->servoRightVal = st->backwardRotate;
        st->out1 = 0.0f;
        st->out2 = 1.0f;
        st->out3 = 1.0f;
        st->out4 = 0.0f;
        enter(Auto, st);
    } else if (st->mode == Auto && ( st->lfRightVal > st->LSR_THRESHOLD && st->lfLeftVal <= st->LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Auto && ( st->lfRightVal > st->LSR_THRESHOLD && st->lfLeftVal <= st->LSR_THRESHOLD )");
        #endif
        leave(Auto, st);
        st->servoLeftVal = st->backwardRotate;
        st->servoRightVal = st->forwardRotate;
        st->out1 = 1.0f;
        st->out2 = 0.0f;
        st->out3 = 0.0f;
        st->out4 = 1.0f;
        enter(Auto, st);
    } else if (st->mode == Auto && ( st->lfRightVal > st->LSR_THRESHOLD && st->lfLeftVal > st->LSR_THRESHOLD )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Auto && ( st->lfRightVal > st->LSR_THRESHOLD && st->lfLeftVal > st->LSR_THRESHOLD )");
        #endif
        leave(Auto, st);
        st->servoLeftVal = st->forwardSpeed;
        st->servoRightVal = st->forwardSpeed;
        st->out1 = 1.0f;
        st->out2 = 0.0f;
        st->out3 = 1.0f;
        st->out4 = 0.0f;
        enter(Auto, st);
    } else if (st->mode == Manual && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Manual && ( true )");
        #endif
        leave(Manual, st);
        st->servoLeftVal = st->servoLeftVal;
        st->servoRightVal = st->servoRightVal;
        enter(Manual, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_turnLeft(State* st) {
    return (st->mode == Auto && ( true ))
            || (st->mode == Manual && ( true ));
}
State* turnLeft(State* st) {
    // assert( per_turnLeft(st) );
    if (st->mode == Auto && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Auto && ( true )");
        #endif
        leave(Auto, st);
        st->out1 = 1.0f;
        st->out2 = 0.0f;
        st->out3 = 0.0f;
        st->out4 = 1.0f;
        st->servoLeftVal = st->servoLeftVal + 0.05f;
        st->servoRightVal = st->servoRightVal + 0.05f;
        enter(Manual, st);
    } else if (st->mode == Manual && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Manual && ( true )");
        #endif
        leave(Manual, st);
        st->servoLeftVal = st->servoLeftVal + 0.05f;
        st->servoRightVal = st->servoRightVal + 0.05f;
        st->out1 = 1.0f;
        st->out2 = 0.0f;
        st->out3 = 0.0f;
        st->out4 = 1.0f;
        enter(Manual, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}

bool per_turnRight(State* st) {
    return (st->mode == Auto && ( true ))
            || (st->mode == Manual && ( true ));
}
State* turnRight(State* st) {
    // assert( per_turnRight(st) );
    if (st->mode == Auto && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Auto && ( true )");
        #endif
        leave(Auto, st);
        st->out1 = 0.0f;
        st->out2 = 1.0f;
        st->out3 = 1.0f;
        st->out4 = 0.0f;
        st->servoLeftVal = st->servoLeftVal + 0.05f;
        st->servoRightVal = st->servoRightVal + 0.05f;
        enter(Manual, st);
    } else if (st->mode == Manual && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == Manual && ( true )");
        #endif
        leave(Manual, st);
        st->servoLeftVal = st->servoLeftVal + 0.05f;
        st->servoRightVal = st->servoRightVal + 0.05f;
        st->out1 = 0.0f;
        st->out2 = 1.0f;
        st->out3 = 1.0f;
        st->out4 = 0.0f;
        enter(Manual, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}





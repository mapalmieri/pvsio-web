#include "BrushlessMotorControl.h"
/**
 * init function
 */
void init(State* st) { 
    st->previous_mode = X1;
    st->mode = X1;
    st->a1 = 0.01f;
    st->a2 = 0.01f;
    st->a3 = 0.01f;
    st->a4 = 0.0f;
    st->b = 0.01f;
    st->error_theta = 0.0f;
    st->error_xd = 0.0f;
    st->Id = 0.0f;
    st->Id_des = 0.0f;
    st->Iq = 0.0f;
    st->J = 0.01f;
    st->J1 = 0.0f;
    st->J2 = 0.0f;
    st->J3 = 0.0f;
    st->J4 = 0;
    st->k = 0.5f;
    st->k11 = -1000.0f;
    st->k12 = 0.0f;
    st->k21 = 0.0f;
    st->k22 = -100000.0f;
    st->L = 0.05f;
    st->Omega = 0.0f;
    st->p = 3.0f;
    st->R = 3.3f;
    st->T1 = 4.0f;
    st->T2 = 2.0f;
    st->T3 = 1.0f;
    st->T4 = 0.5f;
    st->Theta = 0.0f;
    st->Theta_des = 0.0f;
    st->Ud_control = 0.0f;
    st->Uq_control = 0.0f;
    st->v1 = 0.0f;
    st->v2 = 0.0f;
    st->x1 = 0.0f;
    st->x2 = 0.0f;
    st->x3 = 0.0f;
    st->x4 = 0.0f;
    st->y1 = 0.0f;
    st->y1_des = 0.0f;
    st->y2 = 0.0f;
    st->y2_des = 0.0f;
    st->z = 10.0f;
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
    return (st->mode == X1 && ( true ));
}
State* tick(State* st) {
    // assert( per_tick(st) );
    if (st->mode == X1 && ( true )) {
        #ifdef DBG
        _dbg_print_condition("st->mode == X1 && ( true )");
        #endif
        leave(X1, st);
        st->x1 = st->Id;
        st->x2 = st->Iq;
        st->x3 = st->Theta;
        st->x4 = st->Omega;
        st->y1 = st->x1;
        st->y2 = st->x3;
        st->y1_des = st->Id_des;
        st->y2_des = st->Theta_des;
        st->error_theta = st->Theta - st->Theta_des;
        st->error_xd = st->Id - st->Id_des;
        st->v1 = st->k11 * (st->y1 - st->y1_des) + st->k12 * (st->y2 - st->y2_des);
		st->v2 = st->k21 * (st->y1 - st->y1_des) + st->k22 * (st->y2 - st->y2_des);
		st->Ud_control = st->L * st->v1 + st->R * st->x1 - st->L * st->p * st->x2 * st->x4;
		st->Uq_control = 2 * st->J * st->L / (3 * st->p * st->k) * (st->v2 - 1 / st->J * (3 / 2 * st->p * st->k * ((-st->R * st->x2) - st->p * st->x4 * (st->L * st->x1 + st->k))) + st->z * st->x4 * (st->T1 * cos(st->z * st->x3 + st->a1) + st->T2 * cos(2 * st->z * st->x3 + st->a2) + st->T3 * cos(3 * st->z * st->x3 + st->a3) + st->T4 * cos(4 * st->z * st->x3 + st->a4)) - st->b / st->J * (3 / 2 * st->p * st->k * st->x2 + st->T1 * sin(st->z * st->x3 + st->a1) + st->T2 * sin(2 * st->z * st->x3 + st->a2) + st->T3 * sin(3 * st->z * st->x3 + st->a3) + st->T4 * sin(4 * st->z * st->x3 + st->a4)));
		st->J1 = st->error_theta*st->error_theta;
		st->J2 = st->error_theta*st->error_theta + st->error_xd*st->error_xd;
		st->J3 = abs(st->error_theta);
		st->J4 = abs(st->error_theta)+abs(st->error_xd);
        enter(X1, st);
    }
    #ifdef DBG
    _dbg_print_state(st);
    #endif
    return st;
}





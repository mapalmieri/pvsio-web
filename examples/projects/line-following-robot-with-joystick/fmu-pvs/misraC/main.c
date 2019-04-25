

/**
 * Example main for testing line-following-robot-with-joystick
 */

#include "line-following-robot-with-joystick.h"

const char* function_names[] = { 
    "accellerate",  //-- id: 0
    "autopilot",  //-- id: 1
    "brake",  //-- id: 2
    "tick",  //-- id: 3
    "turnLeft",  //-- id: 4
    "turnRight" //-- id: 5
};
char_t* mode_names[] = { 
    (char_t*) "Auto", 
    (char_t*) "Manual"
};
void print_menu() {
    printf("List of functions:\n");
    int i = 0;
    while(i < 6){
        printf("%d - %s\n", i, function_names[i]);
        i++;
    }
    printf("e - Exit\n");
    printf("Select trigger: ");
}

int main() {

    State s;
    init(&s);

    printf("Initialised, current mode: %s \n-------\n", mode_names[s.mode]);

    while(true){
        print_menu();
        int t = 0;
        if( scanf("%d",&t) != 1 ){
            return 1;
        } else {
            switch (t) { 
                case (0): {
                    if (per_accellerate(&s)) {
                        accellerate(&s);
                        printf("Function %s executed!\nCurrent system mode: %s \n\n", function_names[t], mode_names[s.mode]);
                    } else {
                        printf("Function %s cannot be executed in the current system mode.\n\n", function_names[t]);
                    }
                    break;
                }
                case (1): {
                    if (per_autopilot(&s)) {
                        autopilot(&s);
                        printf("Function %s executed!\nCurrent system mode: %s \n\n", function_names[t], mode_names[s.mode]);
                    } else {
                        printf("Function %s cannot be executed in the current system mode.\n\n", function_names[t]);
                    }
                    break;
                }
                case (2): {
                    if (per_brake(&s)) {
                        brake(&s);
                        printf("Function %s executed!\nCurrent system mode: %s \n\n", function_names[t], mode_names[s.mode]);
                    } else {
                        printf("Function %s cannot be executed in the current system mode.\n\n", function_names[t]);
                    }
                    break;
                }
                case (3): {
                    if (per_tick(&s)) {
                        tick(&s);
                        printf("Function %s executed!\nCurrent system mode: %s \n\n", function_names[t], mode_names[s.mode]);
                    } else {
                        printf("Function %s cannot be executed in the current system mode.\n\n", function_names[t]);
                    }
                    break;
                }
                case (4): {
                    if (per_turnLeft(&s)) {
                        turnLeft(&s);
                        printf("Function %s executed!\nCurrent system mode: %s \n\n", function_names[t], mode_names[s.mode]);
                    } else {
                        printf("Function %s cannot be executed in the current system mode.\n\n", function_names[t]);
                    }
                    break;
                }
                case (5): {
                    if (per_turnRight(&s)) {
                        turnRight(&s);
                        printf("Function %s executed!\nCurrent system mode: %s \n\n", function_names[t], mode_names[s.mode]);
                    } else {
                        printf("Function %s cannot be executed in the current system mode.\n\n", function_names[t]);
                    }
                    break;
                }
                default: { printf("Out of range, please try again.\n\n"); }
            }
        }
    }
    return 0;
}



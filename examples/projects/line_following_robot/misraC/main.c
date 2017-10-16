

/**
 * Example main for testing LFRController
 */

#include "LFRController.h"

const char* function_names[] = { 
    "accelerate",  //-- id: 0
    "autopilot",  //-- id: 1
    "brake",  //-- id: 2
    "tick" //-- id: 3
};
UC_8* mode_names[] = { 
    (UC_8*) "AUTO", 
    (UC_8*) "MANUAL"
};
void print_menu() {
    printf("List of functions:\n");
    int i = 0;
    while(i < 4){
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
                    if (per_accelerate(&s)) {
                        accelerate(&s);
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
                default: { printf("Out of range, please try again.\n\n"); }
            }
        }
    }
    return 0;
}



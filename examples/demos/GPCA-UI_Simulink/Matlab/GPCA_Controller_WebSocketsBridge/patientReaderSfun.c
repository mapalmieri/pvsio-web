/*
 *   patientReaderSfun.c Simple C-MEX S-function for function call.
 *
 *   ABSTRACT:
 *     The purpose of this sfunction is to call a simple legacy
 *     function during simulation:
 *
 *        patientReader(uint32 y1[1], uint32 y2[1], uint32 y3[1], uint32 y4[1], uint32 y5[2])
 *
 *   Simulink version           : 7.9 (R2012a) 29-Dec-2011
 *   C source code generated on : 24-Mar-2015 11:00:11

 * THIS S-FUNCTION IS GENERATED BY THE LEGACY CODE TOOL AND MAY NOT WORK IF MODIFIED

 */

/*
   %%%-MATLAB_Construction_Commands_Start
   def = legacy_code('initialize');
   def.SFunctionName = 'patientReaderSfun';
   def.InitializeConditionsFcnSpec = 'randomizeSeed()';
   def.OutputFcnSpec = 'patientReader(uint32 y1[1], uint32 y2[1], uint32 y3[1], uint32 y4[1], uint32 y5[2])';
   def.StartFcnSpec = 'openFile()';
   def.TerminateFcnSpec = 'closeFile()';
   def.HeaderFiles = {'PatientDataReaderLCT.h'};
   def.SourceFiles = {'PatientDataReaderLCT.c'};
   def.SampleTime = 1;
   legacy_code('sfcn_cmex_generate', def);
   legacy_code('compile', def);
   %%%-MATLAB_Construction_Commands_End
 */

/*
 * Must specify the S_FUNCTION_NAME as the name of the S-function.
 */
#define S_FUNCTION_NAME                patientReaderSfun
#define S_FUNCTION_LEVEL               2

/*
 * Need to include simstruc.h for the definition of the SimStruct and
 * its associated macro definitions.
 */
#include "simstruc.h"

/*
 * Specific header file(s) required by the legacy code function.
 */
#include "PatientDataReaderLCT.h"

/* Function: mdlInitializeSizes ===========================================
 * Abstract:
 *    The sizes information is used by Simulink to determine the S-function
 *    block's characteristics (number of inputs, outputs, states, etc.).
 */
static void mdlInitializeSizes(SimStruct *S)
{
  /* Number of expected parameters */
  ssSetNumSFcnParams(S, 0);

  /*
   * Set the number of pworks.
   */
  ssSetNumPWork(S, 0);

  /*
   * Set the number of dworks.
   */
  if (!ssSetNumDWork(S, 0))
    return;

  /*
   * Set the number of input ports.
   */
  if (!ssSetNumInputPorts(S, 0))
    return;

  /*
   * Set the number of output ports.
   */
  if (!ssSetNumOutputPorts(S, 5))
    return;

  /*
   * Configure the output port 1
   */
  ssSetOutputPortDataType(S, 0, SS_UINT32);
  ssSetOutputPortWidth(S, 0, 1);
  ssSetOutputPortComplexSignal(S, 0, COMPLEX_NO);
  ssSetOutputPortOptimOpts(S, 0, SS_REUSABLE_AND_LOCAL);
  ssSetOutputPortOutputExprInRTW(S, 0, 0);

  /*
   * Configure the output port 2
   */
  ssSetOutputPortDataType(S, 1, SS_UINT32);
  ssSetOutputPortWidth(S, 1, 1);
  ssSetOutputPortComplexSignal(S, 1, COMPLEX_NO);
  ssSetOutputPortOptimOpts(S, 1, SS_REUSABLE_AND_LOCAL);
  ssSetOutputPortOutputExprInRTW(S, 1, 0);

  /*
   * Configure the output port 3
   */
  ssSetOutputPortDataType(S, 2, SS_UINT32);
  ssSetOutputPortWidth(S, 2, 1);
  ssSetOutputPortComplexSignal(S, 2, COMPLEX_NO);
  ssSetOutputPortOptimOpts(S, 2, SS_REUSABLE_AND_LOCAL);
  ssSetOutputPortOutputExprInRTW(S, 2, 0);

  /*
   * Configure the output port 4
   */
  ssSetOutputPortDataType(S, 3, SS_UINT32);
  ssSetOutputPortWidth(S, 3, 1);
  ssSetOutputPortComplexSignal(S, 3, COMPLEX_NO);
  ssSetOutputPortOptimOpts(S, 3, SS_REUSABLE_AND_LOCAL);
  ssSetOutputPortOutputExprInRTW(S, 3, 0);

  /*
   * Configure the output port 5
   */
  ssSetOutputPortDataType(S, 4, SS_UINT32);
  ssSetOutputPortWidth(S, 4, 2);
  ssSetOutputPortComplexSignal(S, 4, COMPLEX_NO);
  ssSetOutputPortOptimOpts(S, 4, SS_REUSABLE_AND_LOCAL);
  ssSetOutputPortOutputExprInRTW(S, 4, 0);

  /*
   * Register reserved identifiers to avoid name conflict
   */
  if (ssRTWGenIsCodeGen(S)) {
    /*
     * Register reserved identifier for InitializeConditionsFcnSpec
     */
    ssRegMdlInfo(S, "randomizeSeed", MDL_INFO_ID_RESERVED, 0, 0, ssGetPath(S));

    /*
     * Register reserved identifier for StartFcnSpec
     */
    ssRegMdlInfo(S, "openFile", MDL_INFO_ID_RESERVED, 0, 0, ssGetPath(S));

    /*
     * Register reserved identifier for OutputFcnSpec
     */
    ssRegMdlInfo(S, "patientReader", MDL_INFO_ID_RESERVED, 0, 0, ssGetPath(S));

    /*
     * Register reserved identifier for TerminateFcnSpec
     */
    ssRegMdlInfo(S, "closeFile", MDL_INFO_ID_RESERVED, 0, 0, ssGetPath(S));
  }

  /*
   * This S-function can be used in referenced model simulating in normal mode.
   */
  ssSetModelReferenceNormalModeSupport(S, MDL_START_AND_MDL_PROCESS_PARAMS_OK);

  /*
   * Set the number of sample time.
   */
  ssSetNumSampleTimes(S, 1);

  /*
   * All options have the form SS_OPTION_<name> and are documented in
   * matlabroot/simulink/include/simstruc.h. The options should be
   * bitwise or'd together as in
   *   ssSetOptions(S, (SS_OPTION_name1 | SS_OPTION_name2))
   */
  ssSetOptions(S,
               SS_OPTION_USE_TLC_WITH_ACCELERATOR |
               SS_OPTION_CAN_BE_CALLED_CONDITIONALLY |
               SS_OPTION_EXCEPTION_FREE_CODE |
               SS_OPTION_WORKS_WITH_CODE_REUSE |
               SS_OPTION_SFUNCTION_INLINED_FOR_RTW |
               SS_OPTION_DISALLOW_CONSTANT_SAMPLE_TIME);
}

/* Function: mdlInitializeSampleTimes =====================================
 * Abstract:
 *    This function is used to specify the sample time(s) for your
 *    S-function. You must register the same number of sample times as
 *    specified in ssSetNumSampleTimes.
 */
static void mdlInitializeSampleTimes(SimStruct *S)
{
  ssSetSampleTime(S, 0, (real_T)1);
  ssSetOffsetTime(S, 0, (real_T)0);

#if defined(ssSetModelReferenceSampleTimeDisallowInheritance)

  ssSetModelReferenceSampleTimeDisallowInheritance(S);

#endif

}

#define MDL_START
#if defined(MDL_START)

/* Function: mdlStart =====================================================
 * Abstract:
 *    This function is called once at start of model execution. If you
 *    have states that should be initialized once, this is the place
 *    to do it.
 */
static void mdlStart(SimStruct *S)
{
  /*
   * Call the legacy code function
   */
  openFile();
}

#endif

#define MDL_INITIALIZE_CONDITIONS
#if defined(MDL_INITIALIZE_CONDITIONS)

/* Function: mdlInitializeConditions ======================================
 * Abstract:
 *    In this function, you should initialize the states for your S-function block.
 *    You can also perform any other initialization activities that your
 *    S-function may require. Note, this routine will be called at the
 *    start of simulation and if it is present in an enabled subsystem
 *    configured to reset states, it will be call when the enabled subsystem
 *    restarts execution to reset the states.
 */
static void mdlInitializeConditions(SimStruct *S)
{
  /*
   * Call the legacy code function
   */
  randomizeSeed();
}

#endif

/* Function: mdlOutputs ===================================================
 * Abstract:
 *    In this function, you compute the outputs of your S-function
 *    block. Generally outputs are placed in the output vector(s),
 *    ssGetOutputPortSignal.
 */
static void mdlOutputs(SimStruct *S, int_T tid)
{
  /*
   * Get access to Parameter/Input/Output/DWork/size information
   */
  uint32_T *y1 = (uint32_T *) ssGetOutputPortSignal(S, 0);
  uint32_T *y2 = (uint32_T *) ssGetOutputPortSignal(S, 1);
  uint32_T *y3 = (uint32_T *) ssGetOutputPortSignal(S, 2);
  uint32_T *y4 = (uint32_T *) ssGetOutputPortSignal(S, 3);
  uint32_T *y5 = (uint32_T *) ssGetOutputPortSignal(S, 4);

  /*
   * Call the legacy code function
   */
  patientReader( y1, y2, y3, y4, y5);
}

/* Function: mdlTerminate =================================================
 * Abstract:
 *    In this function, you should perform any actions that are necessary
 *    at the termination of a simulation.
 */
static void mdlTerminate(SimStruct *S)
{
  /*
   * Call the legacy code function
   */
  closeFile();
}

/*
 * Required S-function trailer
 */
#ifdef MATLAB_MEX_FILE
# include "simulink.c"
#else
# include "cg_sfun.h"
#endif

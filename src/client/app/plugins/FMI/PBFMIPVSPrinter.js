/** @module EmuchartsFMIPVSPrinter */
/**
 * EmuchartsFMIPVSPrinter provides functions to generate Alloy models from Emucharts
 * @author Paolo Masci
 * @version 3.0
 * @date June 2, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";
    // var printer_version = "1.0";
   // var GenericPrinter = require("plugins/emulink/models/EmuchartsGenericPrinter");
   // var projectManager = require("project/ProjectManager").getInstance();
    var skeleton_c_template = require("text!plugins/FMI/templates/skeleton_fmu_c.handlebars");
    var fmu_h_template = require("text!plugins/FMI/templates/fmu_h.handlebars");
    var fmu_c_template = require("text!plugins/FMI/templates/fmu_c.handlebars");
    var modelDescription_xml_template = require("text!plugins/FMI/templates/modelDescription_xml.handlebars");
    var Makefile_template = require("text!plugins/FMI/templates/Makefile.handlebars");
    var fmi2Functions_h = require("text!plugins/FMI/lib/fmi2Functions.h");
    var fmi2FunctionTypes_h = require("text!plugins/FMI/lib/fmi2FunctionTypes.h");
    var fmi2TypesPlatform_h = require("text!plugins/FMI/lib/fmi2TypesPlatform.h");
	var index_html_template = require("text!plugins/FMI/templates/index_html.handlebars"); 
	var index_js_template = require("text!plugins/FMI/templates/index_js.handlebars"); 
    /**
     * Constructor
     */
    function PBFMIPVSPrinter(name) {
        this.module_name = name;
       // this.genericPrinter = new GenericPrinter();
        return this;
    }

    var buffer_names = {
        bool: "booleanBuffer",
        int: "intBuffer",
        real: "realBuffer",
        string: "stringBuffer"
    };

    function get_buffer(t, count) {
        switch (t) {
            case "int" : count++;  return { printf_type: "%i", buffer_name: buffer_names.int, descriptor: "Integer" };
            case "real": count++; return { printf_type: "%f", buffer_name: buffer_names.real, descriptor: "Real" };
            case "bool": count++; return { printf_type: "%i", buffer_name: buffer_names.bool, descriptor: "Boolean"};
            case "string": count++; return { printf_type: "%s", buffer_name: buffer_names.string, descriptor: "String"};
            default: return null;
        }
        return null;
    }


	PBFMIPVSPrinter.prototype.create_interface = function (fmi,fmi_composed,elements,graphics,port,tick) {
		var index_html = "";
		var index_js = "";
		  
		fmi.state_variables.variables.forEach(function (v) {
			v.output=(v.scope && v.scope.toLowerCase() === "output");
			v.input=(v.scope && v.scope.toLowerCase() === "input");
		});
		try {
                    index_html = Handlebars.compile(index_html_template, { noEscape: true })({
                        graphics: graphics
                    });
					console.log(index_html);
					
                    index_js = Handlebars.compile(index_js_template, { noEscape: true })({
						variables: fmi.state_variables.variables,
						elements: elements,
						port: port,
						tick: tick,
						graphics: graphics
                    });
                    console.log(index_js);
         } catch(fmi_gen_err) {
               console.error(fmi_gen_err);
         }
     return new Promise (function (resolve, reject) {
            if (opt.interactive) {
                return _this.genericPrinter.get_params().then(function (par) {
                    finalize(resolve, reject, par);
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            }
            return finalize(resolve, reject);
        });
    };     
    
    /**
     * Prints the FMU package
     * When opt.interactive is true, a dialog is shown to the user to enter/select parameters.
     */
    PBFMIPVSPrinter.prototype.create_FMU = function (name,fmi) {
        fmi = fmi || {};
        
        
			var count = 1;
            var valueReference = 1;
			var skeleton_c = "";
            var fmu_h = "";
            var fmu_c = "";
            var modelDescription_xml = "";
            var Makefile = "";
 
		fmi.state_variables.variables.forEach(function (v) {
                    v.fmi = get_buffer(v.type, count);
                    if (v.fmi) {
                        v.fmi.variability = v.variability; 
                        v.fmi.causality = (v.scope && typeof v.scope === "string") ? v.scope.toLowerCase() : null;
                        v.fmi.initial = v.initial;
                        v.fmi.value = v.value;
                        v.fmi.valueReference = valueReference;
                        valueReference++;
                        count++;
                        // causality options
                        v.output = (v.scope && v.scope.toLowerCase() === "output");
                        v.input = (v.scope && v.scope.toLowerCase() === "input");
                        v.local = (v.scope && v.scope.toLowerCase() === "local");
                        v.parameter = (v.scope && v.scope.toLowerCase() === "parameter");
                        v.independet = (v.scope && v.scope.toLowerCase() === "independent");
                        v.calculatedparameter = (v.scope && v.scope.toLowerCase() === "calculatedparameter");
                        // variability options
                        v.constant = (v.variability && v.variability.toLowerCase() === "constant");
                        v.fixed = (v.variability && v.variability.toLowerCase() === "fixed");
                        v.tunable = (v.variability && v.variability.toLowerCase() === "tunable");
                        v.discrete = (v.variability && v.variability.toLowerCase() === "discrete");
                        v.continuous = (v.variability && v.variability.toLowerCase() === "continious");
                        //type options
                        v.real = (v.type === "real");
                        v.int = (v.type === "int");
                        v.bool = (v.type === "bool");
                        v.string = (v.type === "string");
                    }
                });
		fmi.composed_variables.variables.forEach(function (v) {
                    v.fmi = get_buffer(v.type, count);
                    if (v.fmi) {
                        v.fmi.variability = v.variability; 
                        v.fmi.causality = (v.scope && typeof v.scope === "string") ? v.scope.toLowerCase() : null;
                        v.fmi.initial = v.initial;
                        v.fmi.value = v.value;
                        v.fmi.valueReference = valueReference;
                        valueReference++;
                        count++;
                        // causality options
                        v.output = (v.scope && v.scope.toLowerCase() === "output");
                        v.input = (v.scope && v.scope.toLowerCase() === "input");
                        v.local = (v.scope && v.scope.toLowerCase() === "local");
                        v.parameter = (v.scope && v.scope.toLowerCase() === "parameter");
                        v.independet = (v.scope && v.scope.toLowerCase() === "independent");
                        v.calculatedparameter = (v.scope && v.scope.toLowerCase() === "calculatedparameter");
                        // variability options
                        v.constant = (v.variability && v.variability.toLowerCase() === "constant");
                        v.fixed = (v.variability && v.variability.toLowerCase() === "fixed");
                        v.tunable = (v.variability && v.variability.toLowerCase() === "tunable");
                        v.discrete = (v.variability && v.variability.toLowerCase() === "discrete");
                        v.continuous = (v.variability && v.variability.toLowerCase() === "continious");
                        //type options
                        v.real = (v.type === "real");
                        v.int = (v.type === "int");
                        v.bool = (v.type === "bool");
                        v.string = (v.type === "string");
                    }
                });
                
		fmi.function_variables_input.variables.forEach(function (v) {
                    v.fmi = get_buffer(v.type, count);
                    if (v.fmi) {
                        v.fmi.variability = v.variability; 
                        v.fmi.causality = (v.scope && typeof v.scope === "string") ? v.scope.toLowerCase() : null;
                        v.fmi.initial = v.initial;
                        v.fmi.value = v.value;
                        v.fmi.valueReference = valueReference;
                        valueReference++;
                        count++;
                        // causality options
                        v.output = (v.scope && v.scope.toLowerCase() === "output");
                        v.input = (v.scope && v.scope.toLowerCase() === "input");
                        v.local = (v.scope && v.scope.toLowerCase() === "local");
                        v.parameter = (v.scope && v.scope.toLowerCase() === "parameter");
                        v.independet = (v.scope && v.scope.toLowerCase() === "independent");
                        v.calculatedparameter = (v.scope && v.scope.toLowerCase() === "calculatedparameter");
                        // variability options
                        v.constant = (v.variability && v.variability.toLowerCase() === "constant");
                        v.fixed = (v.variability && v.variability.toLowerCase() === "fixed");
                        v.tunable = (v.variability && v.variability.toLowerCase() === "tunable");
                        v.discrete = (v.variability && v.variability.toLowerCase() === "discrete");
                        v.continuous = (v.variability && v.variability.toLowerCase() === "continious");
                        //type options
                        v.real = (v.type === "real");
                        v.int = (v.type === "int");
                        v.bool = (v.type === "bool");
                        v.string = (v.type === "string");
                    }
                });
                
		fmi.function_variables_output.variables.forEach(function (v) {
                    v.fmi = get_buffer(v.type, count);
                    if (v.fmi) {
                        v.fmi.variability = v.variability; 
                        v.fmi.causality = (v.scope && typeof v.scope === "string") ? v.scope.toLowerCase() : null;
                        v.fmi.initial = v.initial;
                        v.fmi.value = v.value;
                        v.fmi.valueReference = valueReference;
                        valueReference++;
                        count++;
                        // causality options
                        v.output = (v.scope && v.scope.toLowerCase() === "output");
                        v.input = (v.scope && v.scope.toLowerCase() === "input");
                        v.local = (v.scope && v.scope.toLowerCase() === "local");
                        v.parameter = (v.scope && v.scope.toLowerCase() === "parameter");
                        v.independet = (v.scope && v.scope.toLowerCase() === "independent");
                        v.calculatedparameter = (v.scope && v.scope.toLowerCase() === "calculatedparameter");
                        // variability options
                        v.constant = (v.variability && v.variability.toLowerCase() === "constant");
                        v.fixed = (v.variability && v.variability.toLowerCase() === "fixed");
                        v.tunable = (v.variability && v.variability.toLowerCase() === "tunable");
                        v.discrete = (v.variability && v.variability.toLowerCase() === "discrete");
                        v.continuous = (v.variability && v.variability.toLowerCase() === "continious");
                        //type options
                        v.real = (v.type === "real");
                        v.int = (v.type === "int");
                        v.bool = (v.type === "bool");
                        v.string = (v.type === "string");
                    }
                });
                
                try {
                    skeleton_c = Handlebars.compile(skeleton_c_template, { noEscape: true })({
                        variables: fmi.state_variables.variables,
                        composed_variables: fmi.composed_variables.variables,
                        function_variables_output: fmi.function_variables_output.variables,
                        function_variables_input: fmi.function_variables_input.variables,
                        name: name,
                        functions: fmi.functions,
                        init: fmi.init,
                        tick: fmi.tick,
                        count: count,
                        delay: (fmi.delay)? fmi.delay : "400000",
                        port: (fmi.port)? fmi.port: "8084"
                    });
					console.log(skeleton_c);
					
                    fmu_h = Handlebars.compile(fmu_h_template, { noEscape: true })({
                        variables: fmi.state_variables.variables,
                        tick: fmi.tick,
                        max_memory: (fmi.max_memory)? fmi.max_memory : "2000",
                        count: count+1
                    });
					console.log(fmu_h);
					
                    fmu_c = Handlebars.compile(fmu_c_template, { noEscape: true })({
                        variables: fmi.state_variables.variables,
                        tick: fmi.tick

                    });
					console.log(fmu_c);
					
                    modelDescription_xml = Handlebars.compile(modelDescription_xml_template, { noEscape: true })({
                        variables: fmi.state_variables.variables.sort(function (a,b) { // variables are ordered by valueReference (ascending order)
                                        if (a.fmi) {
                                            if (b.fmi && a.fmi.valueReference > b.fmi.valueReference) {
                                                return 1;
                                            }
                                            return -1;
                                        }
                                        return 1;
                                    }),
                        composed_variables: fmi.composed_variables.variables.sort(function (a,b) { // variables are ordered by valueReference (ascending order)
                                        if (a.fmi) {
                                            if (b.fmi && a.fmi.valueReference > b.fmi.valueReference) {
                                                return 1;
                                            }
                                            return -1;
                                        }
                                        return 1;
                                    }),
						function_variables_output: fmi.function_variables_output.variables.sort(function (a,b) { // variables are ordered by valueReference (ascending order)
                                        if (a.fmi) {
                                            if (b.fmi && a.fmi.valueReference > b.fmi.valueReference) {
                                                return 1;
                                            }
                                            return -1;
                                        }
                                        return 1;
                                    }),
						function_variables_input: fmi.function_variables_input.variables.sort(function (a,b) { // variables are ordered by valueReference (ascending order)
                                        if (a.fmi) {
                                            if (b.fmi && a.fmi.valueReference > b.fmi.valueReference) {
                                                return 1;
                                            }
                                            return -1;
                                        }
                                        return 1;
                                    }),
                        count: count,            
                        author: (fmi.author) ? emuchart.author.name : "pvsioweb",
                        date: new Date().toString(),
                        modelName: name
                    });
					console.log(modelDescription_xml);
					
                    Makefile = Handlebars.compile(Makefile_template, { noEscape: true })({
                        name: name
                    });
                    console.log(Makefile);
                } catch(fmi_gen_err) {
                    console.error(fmi_gen_err);
                }
            
            
        return new Promise (function (resolve, reject) {
            if (opt.interactive) {
                return _this.genericPrinter.get_params().then(function (par) {
                    finalize(resolve, reject, par);
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            }
            return finalize(resolve, reject);
        });
    };

    module.exports = PBFMIPVSPrinter;
});


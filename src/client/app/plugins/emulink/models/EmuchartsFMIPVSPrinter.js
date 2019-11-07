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
    var GenericPrinter = require("plugins/emulink/models/EmuchartsGenericPrinter");
    var MisraCPrinter = require("plugins/emulink/models/EmuchartsMisraCPrinter2");
    var projectManager = require("project/ProjectManager").getInstance();
    var fmuGUID_h = require("text!plugins/emulink/models/fmi-pvs/templates/FmuGUID.h");
    var skeleton_c_template = require("text!plugins/emulink/models/fmi-pvs/templates/skeleton_c.handlebars");
    var fmu_h_template = require("text!plugins/emulink/models/fmi-pvs/templates/fmu_h.handlebars");
    var fmu_c_template = require("text!plugins/emulink/models/fmi-pvs/templates/fmu_c.handlebars");
    var modelDescription_xml_template = require("text!plugins/emulink/models/fmi-pvs/templates/modelDescription_xml.handlebars");
    var Makefile_template = require("text!plugins/emulink/models/fmi-pvs/templates/Makefile.handlebars");
    var fmi2Functions_h = require("text!plugins/emulink/models/fmi-pvs/lib/fmi2Functions.h");
    var fmi2FunctionTypes_h = require("text!plugins/emulink/models/fmi-pvs/lib/fmi2FunctionTypes.h");
    var fmi2TypesPlatform_h = require("text!plugins/emulink/models/fmi-pvs/lib/fmi2TypesPlatform.h");
    var fmu_folder = "fmu-pvs/";
    /**
     * Constructor
     */
    function EmuchartsFMIPVSPrinter(name) {
        this.module_name = name;
        this.genericPrinter = new GenericPrinter();
        this.misraCPrinter = new MisraCPrinter();
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
            case "bool": count++; return { printf_type: "%i", buffer_name: buffer_names.bool, descriptor: "Bool"};
            case "string": count++; return { printf_type: "%s", buffer_name: buffer_names.string, descriptor: "String"};
            case "float64_t": count++; return { printf_type: "%f", buffer_name: buffer_names.real, descriptor: "Real" };
            default: return null;
        }
        return null;
    }

    /**
     * Prints the FMU package
     * When opt.interactive is true, a dialog is shown to the user to enter/select parameters.
     * 
     * @count is global to all the type
     * 	this make things easier, I think Peter did the same with Overture
     * 	but it is far less efficient than the original approach of Paolo.
     * 
     * if ( v.fmi.causality === "local"){	//TODO: introduce scope parameter as an option in Emuchart variables
							v.fmi.variability = "fixed"; 
							v.fmi.causality = "parameter";
							v.fmi.initial = "exact";
							}
							* 
	* the snippet above is used as a walkaround until we introduce the scope @parameter in PVSio-web 
     */
    EmuchartsFMIPVSPrinter.prototype.print = function (emuchart, opt) {
        opt = opt || {};
        opt.interactive = true;
        var _this = this;
        function finalize(resolve, reject, par) {
            var count = 1;
            var valueReference = 1;
            var skeleton_c = "";
            var fmu_h = "";
            var fmu_c = "";
            var modelDescription_xml = "";
            var Makefile = "";
            var model = _this.genericPrinter.print(emuchart);
            var time = false;
            var tickSize = false;
            if (model && model.state_variables && model.state_variables.variables
                    && model.state_variables.variables.length > 0) {
                // process the array of variables to add information necessary for the fmi
                model.state_variables.variables.forEach(function (v) {
                    v.fmi = get_buffer(v.type, count);
                    if (v.fmi) {
                        v.fmi.variability = "continuous"; // TODO: introduce variability as a field in Emucharts variables
                        v.fmi.causality = (v.scope && typeof v.scope === "string") ? v.scope.toLowerCase() : null;
                        if ( v.fmi.causality === "local"){	//TODO: introduce scope parameter as an option in Emuchart variables
							v.fmi.variability = "fixed"; 
							v.fmi.causality = "parameter";
							v.fmi.initial = "exact";
						}
                        v.fmi.valueReference = valueReference;
                        valueReference++;
                        count++;
                        v.output = (v.scope && v.scope.toLowerCase() === "output");
                        v.input = (v.scope && v.scope.toLowerCase() === "input");
                        v.local = (v.scope && v.scope.toLowerCase() === "local");
                        v.parameter = (v.fmi.causality && v.fmi.causality.toLowerCase() === "parameter");
                        v.real = (v.type === "real");
                        v.int = (v.type === "int");
                        v.bool = (v.type === "bool");
                        v.string = (v.type === "string");
                        v.port = (v.name === "port");
                        v.isTime = (v.name === "time");
                        v.isTickSize = (v.name === "tickSize");
                        if (v.isTime === true) {
							time = true;
						}
                        if (v.isTickSize === true) {
							tickSize = true;
						}
                    }
                });
               /* model.constants.forEach(function (c) {
                    c.fmi = get_buffer(c.type, count);
                    if (c.fmi) {
                        c.fmi.variability = "fixed"; // TODO: introduce variability as a field in Emucharts variables
                        c.fmi.causality = "parameter";
                        c.fmi.initial = "exact";
                        c.fmi.valueReference = valueReference;
                        valueReference++;
                        count++;
                        c.real = (c.type === "real");
                        c.int = (c.type === "int");
                        c.bool = (c.type === "bool");
                        c.string = (c.type === "string");
                    }
                });*/

                try {
                    skeleton_c = Handlebars.compile(skeleton_c_template, { noEscape: true })({
                        variables: model.state_variables.variables,
                        triggers: model.triggers.functions,
                        modelName: emuchart.name
                    });

                    fmu_h = Handlebars.compile(fmu_h_template, { noEscape: true })({
                        variables: model.state_variables.variables,
                        modelName: emuchart.name,
                        count: count
                    });

                    fmu_c = Handlebars.compile(fmu_c_template, { noEscape: true })({
                        variables: model.state_variables.variables,
                        time: time,
                        tickSize: tickSize
                    });

                    modelDescription_xml = Handlebars.compile(modelDescription_xml_template, { noEscape: true })({
                        variables: model.state_variables.variables.sort(function (a,b) { // variables are ordered by valueReference (ascending order)
                                        if (a.fmi) {
                                            if (b.fmi && a.fmi.valueReference > b.fmi.valueReference) {
                                                return 1;
                                            }
                                            return -1;
                                        }
                                        return 1;
                                    }),
                        author: (emuchart.author) ? emuchart.author.name : "pvsioweb",
                        date: new Date().toString(),
                        modelName: emuchart.name
                    });

                    Makefile = Handlebars.compile(Makefile_template, { noEscape: true })({
                        name: emuchart.name
                    });
                } catch(fmi_gen_err) {
                    console.error(fmi_gen_err);
                }
            }
            
            //-- write data to disk
            var overWrite = {overWrite: true};
            projectManager.project().addFolder("/" + fmu_folder + "resources", true);
            projectManager.project().addFile(fmu_folder + "skeleton.c", skeleton_c, overWrite);
            projectManager.project().addFile(fmu_folder + "FmuGUID.h", fmuGUID_h, overWrite);
            projectManager.project().addFile(fmu_folder + "fmu.h", fmu_h, overWrite);
            projectManager.project().addFile(fmu_folder + "fmu.c", fmu_c, overWrite);
            projectManager.project().addFile(fmu_folder + "modelDescription.xml", modelDescription_xml, overWrite);
            projectManager.project().addFile(fmu_folder + "Makefile", Makefile, overWrite);
            projectManager.project().addFile(fmu_folder + "fmi/fmi2Functions.h", fmi2Functions_h, overWrite);
            projectManager.project().addFile(fmu_folder + "fmi/fmi2FunctionTypes.h", fmi2FunctionTypes_h, overWrite);
            projectManager.project().addFile(fmu_folder + "fmi/fmi2TypesPlatform.h", fmi2TypesPlatform_h, overWrite);
            
            //Copy of needed libraries and useful files in the project directory
            projectManager.project().copyFile("plugins/emulink/models/fmi-pvs/lib/lib.zip", projectManager.project().toString() + "/" + fmu_folder + "resources/");
            /*projectManager.project().copyFile("plugins/emulink/models/fmi-pvs/lib/fmuCheck.linux64", projectManager.project().toString() + "/" + fmu_folder);
            projectManager.project().copyFile("plugins/emulink/models/fmi-pvs/lib/libcrypto.so.*", projectManager.project().toString() + "/" + fmu_folder + "resources/");
            projectManager.project().copyFile("plugins/emulink/models/fmi-pvs/lib/libssl.so.*", projectManager.project().toString() + "/" + fmu_folder + "resources/");
            projectManager.project().copyFile("plugins/emulink/models/fmi-pvs/lib/libwebsockets.*", projectManager.project().toString() + "/" + fmu_folder + "resources/");*/
            
            resolve(true);
        }
        return new Promise (function (resolve, reject) {
            if (opt.interactive) {
                return _this.genericPrinter.get_params().then(function (par) {
                    _this.misraCPrinter.print(emuchart, { folder: fmu_folder + "misraC/" }).then(function (res) {
                        finalize(resolve, reject, par);
                    }).catch(function (err) {
                        console.log(err);
                        reject(err);
                    });
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            }
            return finalize(resolve, reject);
        });
    };

    module.exports = EmuchartsFMIPVSPrinter;
});

/*
 * This file is part of the INTO-CPS toolchain.
 *
 * Copyright (c) 2017-CurrentYear, INTO-CPS Association,
 * c/o Professor Peter Gorm Larsen, Department of Engineering
 * Finlandsgade 22, 8200 Aarhus N.
 *
 * All rights reserved.
 *
 * THIS PROGRAM IS PROVIDED UNDER THE TERMS OF GPL VERSION 3 LICENSE OR
 * THIS INTO-CPS ASSOCIATION PUBLIC LICENSE VERSION 1.0.
 * ANY USE, REPRODUCTION OR DISTRIBUTION OF THIS PROGRAM CONSTITUTES
 * RECIPIENT'S ACCEPTANCE OF THE OSMC PUBLIC LICENSE OR THE GPL
 * VERSION 3, ACCORDING TO RECIPIENTS CHOICE.
 *
 * The INTO-CPS toolchain  and the INTO-CPS Association Public License
 * are obtained from the INTO-CPS Association, either from the above address,
 * from the URLs: http://www.into-cps.org, and in the INTO-CPS toolchain distribution.
 * GNU version 3 is obtained from: http://www.gnu.org/copyleft/gpl.html.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without
 * even the implied warranty of  MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE, EXCEPT AS EXPRESSLY SET FORTH IN THE
 * BY RECIPIENT SELECTED SUBSIDIARY LICENSE CONDITIONS OF
 * THE INTO-CPS ASSOCIATION.
 *
 * See the full INTO-CPS Association Public License conditions for more details.
 *
 * See the CONTRIBUTORS file for author and contributor information.
 */
"use strict";

function typeToString(t) {
    switch (t) {
        case ScalarVariableType.Real:
            return "Real";
        case ScalarVariableType.Bool:
            return "Boolean";
        case ScalarVariableType.Int:
            return "Integer";
        case ScalarVariableType.String:
            return "String";
        case ScalarVariableType.Unknown:
            return "unknown"
    }
}

function causalityToString(t) {
    switch (t) {
        case CausalityType.Output:
            return "output";
        case CausalityType.Input:
            return "input";
        case CausalityType.Parameter:
            return "parameter";
        case CausalityType.CalculatedParameter:
            return "calculatedParameter";
        case CausalityType.Local:
            return "local";
        case CausalityType.Independent:
            return "independent";
        case CausalityType.Unknown:
            return "unknown"
    }
}

function initialToString(t) {
    switch (t) {
        case InitialType.Exact:
            return "exact";
        case InitialType.Approx:
            return "approx";
        case InitialType.Calculated:
            return "calculated";
        case InitialType.Unknown:
            return "unknown"
    }
}

function variabilityToString(t) {
    switch (t) {
        case VariabilityType.Constant:
            return "constant";
        case VariabilityType.Fixed:
            return "fixed";
        case VariabilityType.Tunable:
            return "tunable";
        case VariabilityType.Continuous:
            return "continuous";
        case VariabilityType.Discrete:
            return "discrete";
        case VariabilityType.Unknown:
            return "unknown"
    }
}

function isTypeCompatiple(t, a) {
    return t == ScalarVariableType.Unknown || a == ScalarVariableType.Unknown || (t == ScalarVariableType.Bool && (a == ScalarVariableType.Int || a == ScalarVariableType.Real) || (a == ScalarVariableType.Bool && (t == ScalarVariableType.Int || t == ScalarVariableType.Real) || t == a))
}

function isCausalityCompatible(t, a) {
    return t == CausalityType.Unknown || a == CausalityType.Unknown || t == a
}

function isInteger(t) {
    return !isNaN(t) && isFinite(t) && Math.floor(t) === t
}

function isFloat(t) {
    return !!(t % 1)
}

function isString(t) {
    return "string" == typeof t
}

function convertToType(t, a) {
    if (t == ScalarVariableType.Bool) return Boolean(a);
    if (t == ScalarVariableType.Int) {
        var e = Number(a);
        if (isInteger(e)) return e
    } else if (t == ScalarVariableType.Real) {
        var e = Number(a);
        if (isFloat(e) || isInteger(e)) return e
    } else if (t == ScalarVariableType.String) {
        var e = a.toString();
        if (isString(e)) return e
    }
    return null
}

function isTypeCompatipleWithValue(t, a) {
    switch (t) {
        case ScalarVariableType.Unknown:
            return !0;
        case ScalarVariableType.Real:
            return isFloat(a) || isInteger(a);
        case ScalarVariableType.Bool:
            return "boolean" == typeof a || isInteger(a);
        case ScalarVariableType.Int:
            return isInteger(a);
        case ScalarVariableType.String:
            return isString(a)
    }
    return !1
}
var 
    Fmu = function() {
        function t(t, a) {
            void 0 === t && (t = "{FMU}"), void 0 === a && (a = ""), this.name = t, this.path = a, this.platforms = [], this.scalarVariables = [], this.pathNotFound = !0, this.logCategories = [],  this.nested = !1
        }
        return t.prototype.isNested = function() {
            return this.nested
        }, t.prototype.isSupported = function() {
            var t = this;
            return !!this.platforms.find(function(a) {
                return a === t.system_platform
            })
        }, t.prototype.updatePath = function(t) {
            var a = this;
            return this.path = t, this.scalarVariables.forEach(function(t) {
                return t.isConfirmed = !1
            }), this.platforms = [], this.populate().catch(function() {
                return a.pathNotFound = !0
            })
        }, t.prototype.populate = function() {
            return fs.lstatSync(this.path).isDirectory() ? this.populateFromDir() : this.populateFromZip()
        }, t.prototype.populateFromDir = function() {
            var t = this;
            fs.readdir(Path.join(t.path, "binaries"), function(a, e) {
                void 0 != e ? t.platforms = e.map(function(a) {
                    return t.convertToPlatform(a)
                }) : t.platforms = ["N/A"]
            });
            var a = Path.join(t.path, "modelDescription.xml"),
                e = new Promise(function(e, i) {
                    try {
                        fs.accessSync(a, fs.constants.R_OK) && i(), t.pathNotFound = !1, e()
                    } catch (t) {
                        i(t)
                    }
                }),
                i = new Promise(function(t, e) {
                    fs.readFile(a, function(a, i) {
                        return null !== a ? e(a) : void t(i)
                    })
                });
            return e.then(function() {
                return i.then(function(a) {
                    t.populateFromModelDescription(a.toString("UTF-8", 0, a.length))
                })
            })
        }, t.prototype.convertToPlatform = function(t) {
            var a = t.toLowerCase();
            switch (a) {
                case "win32":
                    return "windows32";
                case "win64":
                    return "windows64";
                default:
                    return a
            }
        }, t.prototype.populateFromZip = function() {
            var t = this;
            return new Promise(function(a, e) {
                try {
                    if (fs.accessSync(t.path, fs.constants.R_OK)) return e();
                    fs.readFile(t.path, function(i, n) {
                        if (i) return e(i);
                        var r = new JSZip;
                        r.loadAsync(n).then(function() {
                            t.pathNotFound = !1, t.platforms = r.file(/^binaries\/[a-zA-Z0-9]+\/.+/).map(function(a) {
                                return t.convertToPlatform(a.name.split("/")[1])
                            }), r.file("modelDescription.xml").async("string").then(function(e) {
                                t.populateFromModelDescription(e), a()
                            })
                        })
                    })
                } catch (t) {
                    e(t)
                }
            })
        }, t.prototype.populateFromModelDescription = function(t) {
            var a = new DOMParser,
                e = a.parseFromString(t, "text/xml"),
                i = document.evaluate("//Nested", e, null, XPathResult.BOOLEAN_TYPE, null);
            i.booleanValue === !0 && (this.nested = !0);
            for (var n = document.evaluate("//ScalarVariable", e, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null), r = n.iterateNext(); r;) {
                var l, o = r.attributes.getNamedItem("causality"),
                    s = r.attributes.getNamedItem("variability"),
                    u = r.attributes.getNamedItem("name"),
                    p = r.attributes.getNamedItem("initial"),
                    c = document.evaluate("Real", r, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                null != c ? l = "Real" : (c = document.evaluate("Boolean", r, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, null != c ? l = "Boolean" : (c = document.evaluate("Integer", r, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, null != c ? l = "Integer" : (c = document.evaluate("String", r, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, null != c && (l = "String"))));
                var y = void 0;
                if (c.hasAttributes()) {
                    var T = c.attributes.getNamedItem("start");
                    T && (y = T.textContent)
                }
                var f = void 0;
                if (void 0 != o) {
                    var d = o.textContent;
                    "output" == d ? f = "output" : "input" == d ? f = "input" : "parameter" == d ? f = "parameter" : "calculatedParameter" == d ? f = "calculatedParameter" : "local" == d ? f = "local" : "independent" == d && (f = "independent")
                }
                var h = void 0;
                if (void 0 != s) {
                    var m = s.textContent;
                    "constant" == m ? h = "constant" : "continuous" == m ? h = "continuous" : "discrete" == m ? h = "discrete" : "fixed" == m ? h = "fixed" : "tunable" == m && (h = "tunable")
                }
                var b = void 0;
                if (void 0 != p) {
                    var S = p.textContent;
                    "exact" == S ? b = "exact" : "approx" == S ? b = "approx" : "calculated" == S && (b = "calculated")
                }
                var V = this.getScalarVariable(u.textContent);
                V.type = l, V.causality = f, V.isConfirmed = !0, V.variability = h, V.start = y, V.initial = b, r = n.iterateNext()
            }
            for (this.scalarVariables.sort(function(t, a) {
                    return t.name.localeCompare(a.name)
                }), n = document.evaluate("fmiModelDescription/LogCategories/*[@name]/@name", e, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null), r = n.iterateNext(); r;) this.logCategories.push(r.nodeValue), r = n.iterateNext();
            this.logCategories.sort(function(t, a) {
                return t.localeCompare(a)
            })
        }, t.prototype.getScalarVariable = function(t) {
            var a = this.scalarVariables.find(function(a) {
                return a.name == t
            });
            return a || (a = new ScalarVariable(t), this.scalarVariables.push(a)), a
        }, t
    }();

var ScalarVariable = function() {
    function t(t, a, e, i, n, r, l) {
        void 0 === t && (t = ""), void 0 === a && (a = "Unknown"), void 0 === e && (e = "Unknown"), void 0 === i && (i = "Unknown"), void 0 === n && (n = "Unknown"), void 0 === r && (r = void 0), void 0 === l && (l = !1), this.name = t, this.type = a, this.causality = e, this.variability = i, this.initial = n, this.start = r, this.isConfirmed = l
    }
    return t
}();



var Instance = function() {
    function t(t, a) {
        this.fmu = t, this.name = a, this.outputsTo = new Map, this.initialValues = new Map
    }
    return t.prototype.addOutputToInputLink = function(t, a) {
        if (this.outputsTo.has(t)) {
            var e = this.outputsTo.get(t),
                i = e.find(function(t) {
                    return t.instance == a.instance && t.scalarVariable == a.scalarVariable
                });
            i || e.push(a)
        } else this.outputsTo.set(t, [a])
    }, t
}();

var InstanceScalarPair = function() {
    function t(t, a) {
        this.instance = t, this.scalarVariable = a
    }
    return t
}();

var ScalarValuePair = function() {
    function t(t, a) {
        this.scalarVariable = t, this.value = a
    }
    return t
}();

var OutputConnectionsPair = function() {
    function t(t, a) {
        this.name = t, this.connections = a
    }
    return t
}();


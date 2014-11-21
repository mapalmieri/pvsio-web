/** @module EmuchartsParser */
/**
 * EmuchartsParser is a parser for the Emucharts language
 * The parser is dynamically generated from the Emuchart grammar using Jison http://zaach.github.io/
 * To update/change the parser, just change the grammar
 * @author Paolo Masci
 * @date 06/10/14 2:24:01 PM
 *
 * Usage notes about Jison
 *   lex.rules defines the alphabet, i.e., the symbols known to the parser
 *   $$ is the Jison variable of type Array that needs to be used in the parser to collect information
 *       about the parsed tokens
 *   $1, $2, $3, etc... can be used in the production rules to obtain the value of the tokens specified in the rules
 *       alternatively, the name of the token preceded by $ can be used for the same purpose (i.e., the value
 *       or a token t is $t)
 *
 * Specification of the EmuchartsParser module: the object representing the parsed text 
 *      shall have the following characteristics:
 *  - Each object has a type and a value.
 *  - Identifier objects have type 'identifier' and the value is the string representation of the identifier.
 *  - Number objects have type 'number' and the value is the string representation of the number.
 *  - Arithmetic expression objects have type 'expression' and the value is an array of objects.
 *        Objects in the array range over the following types: number, identifier, parentheses, operators.
 *        Arithmetic operators have type 'binop' or 'unaryop', and the value is the string representation of the operator.
 *        Round parentheses have type 'par', and the value is the string representation of the parenthesis.
 *  - Assignment objects have type 'assignment' and the value is a record { identifier, binop, expression }.
 *  - Transition objects have type 'transition' and the value is a record { identifier, cond, actions }.
 *  - Transition condition objects are arithmetic expression.
 *  - Transition actions objects have type 'actions' and the value is an array of objects of type 'assignment'.
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, Promise, document, FileReader*/
define(function (require, exports, module) {
    "use strict";

    var Parser = require("lib/jison/jison");

    var lexerRules = [
        { rule: ["\\s+",                    "/* skip whitespace */"], tokenType: "whitespace" },
        { rule: ["(?!(?:IMPLIES|implies|AND|and|OR|or|NOT|not))" + // keywords shall not be used as identifiers
                "([a-zA-Z][a-zA-Z0-9_]*)",  "return 'IDENTIFIER'"],   tokenType: "variable-2" },
        { rule: ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER'"],       tokenType: "number" },
        { rule: ["\\*",                     "return '*'"],            tokenType: "operator" },
        { rule: ["\\/",                     "return '/'"],            tokenType: "operator" },
        { rule: ["-",                       "return '-'"],            tokenType: "operator" },
        { rule: ["(?!(?:(\\!\\=)))" + // filtering out !=
                 "(\\!|NOT|not)",           "return 'NOT'"],          tokenType: "keyword" },
        { rule: ["\\+",                     "return '+'"],            tokenType: "operator" },
        { rule: ["(\\!\\=)",                "return '!='"],           tokenType: "operator" },
        { rule: ["(?!(?:(\\=\\>|\\=\\=)))" + // filtering out implication and equality
                 "(\\=)",                   "return '='"],            tokenType: "error" }, // invalid operator
        { rule: [    "(\\=\\=)",            "return '=='"],           tokenType: "operator" },
        { rule: ["(?!(?:(\\>\\=)))" + // filtering out >=
                "(\\>)",   "return '>'"],                             tokenType: "operator" },
        { rule: ["(\\>\\=)",                "return '>='"],           tokenType: "operator" },
        { rule: ["(?!(?:(\\<\\=)))" + // filtering out <=
                 "(\\<)",   "return '<'"],                            tokenType: "operator" },
        { rule: ["(\\<\\=)",                "return '<='"],           tokenType: "operator" },
        { rule: ["(IMPLIES|implies|(\\=\\>))", "return 'IMPLIES'"],   tokenType: "keyword" },
        { rule: ["(AND|&&)",                "return 'AND'"],          tokenType: "keyword" },
        { rule: ["(OR|\\|\\|)",             "return 'OR'"],           tokenType: "keyword" },
        { rule: ["\\(",                     "return '('"],            tokenType: "operator" },
        { rule: ["\\)",                     "return ')'"],            tokenType: "operator" },
        { rule: ["\\[",                     "return '['"],            tokenType: "operator" },
        { rule: ["\\]",                     "return ']'"],            tokenType: "operator" },
        { rule: ["\\{",                     "return '{'"],            tokenType: "operator" },
        { rule: ["\\}",                     "return '}'"],            tokenType: "operator" },
        { rule: [":=",                      "return ':='"],           tokenType: "operator" },
        { rule: [";",                       "return ';'"],            tokenType: "operator" },
        { rule: [",",                       "return ','"],            tokenType: "operator" },
        { rule: [".",                       "return '.'"],            tokenType: "operator" }
    ];
    
    function getRules() {
        var ans = [];
        lexerRules.forEach(function (lexerRule) {
            ans.push(lexerRule.rule);
        });
        return ans;
    }
    
    var grammar = function (opt) {
        function exprWithBinaryOp() {
            return " if (!Array.isArray($$)) { $$ = []; }" +
                   " $$.push($1);" +
                   " $$.push({" +
                   "      type: 'binop'," +
                   "      val:  $2.toUpperCase()" +
                   " });" +
                   " $$ = $$.concat($3)";
        }
        function exprWithUnaryOp() {
            return " if (!Array.isArray($$)) { $$ = []; }" +
                   " $$.push({" +
                   "      type: 'unaryop'," +
                   "      val:  $1.toUpperCase()" +
                   " });" +
                   " $$ = $$.concat($2);";
        }
        function exprWithParenthesis() {
            return " if (!Array.isArray($$)) { $$ = []; }" +
                   " $$.push({type: 'par', val: $1});" +
                   " $$ = $$.concat($2);" +
                   " $$.push({type: 'par', val: $3})";
        }
        function assignmentExpr() {
            return " $$ = {" +
                   "    type: 'assignment'," +
                   "    val: {" +
                   "       identifier: $1," +
                   "       binop: { type: 'binop', val: $2 }," +
                   "       expression: $3 " +
                   "    }" +
                   " };";
        }
        function getFunctionRule(opt) {
            if (opt && opt.parseFunctions) {
                return "$$ = { type: 'function', " +
                       "val: { identifier: { type: 'identifier', val: $1}, args: $args }}";
            }
            return "$$ = { type: 'function', val: [] }; " +
                   "$$.val.push({ type: 'identifier', val: $IDENTIFIER }); " +
                   "$$.val.push({type: 'par', val: $2}); " +
                   "var i = 0;" +
                   "for (i = 0; i < $args.length; i++) {" +
                   "    $$.val = $$.val.concat($args[i].val);" +
                   "    if (i < $args.length - 1) {" +
                   "        $$.val.push({ type: 'separator', val: ',' });" +
                   "    }" +
                   "}" +
                   "$$.val.push({type: 'par', val: $4}); ";
        }
        // The order of rules in expressionBNF reflects the precedence of the operators (lowest precedence is at the top)
        // The considered precedence and associativity is that of the C++ language 
        // (see http://en.cppreference.com/w/cpp/language/operator_precedence)
        // NOTE: according to the PVS language reference, PVS uses a different associativity for logical operators
        //       wrt C (associativity of AND/OR is right-to-left, see page 46,
        //       http://pvs.csl.sri.com/doc/pvs-language-reference.pdf). 
        //       This might be a typo in the PVS manual, as the implemented associativity seems to be that of C++
        //       (need to check with Sam Owre).
        // For the correctness of this parser, associatibity and precedence don't really matter,
        // because expressions are parsed into a flat sequence of tokens.
        // The parser of the formal tool that will process the formal model generated with an Emucharts printer
        // will take care of establishing the correct precendence and associativity of operators.
        function expressionBNF(mode) {
            return [
                ["term + e",       exprWithBinaryOp()],
                ["term - e",       exprWithBinaryOp()],
                ["term * e",       exprWithBinaryOp()],
                ["term / e",       exprWithBinaryOp()],
                ["- e",            exprWithUnaryOp(), {"prec": "UMINUS"}],
                ["NOT e",          exprWithUnaryOp()],
                ["( e )",          exprWithParenthesis()],
                ["term == e",       exprWithBinaryOp()], // comparison of equality of two terms
                ["term != e",      exprWithBinaryOp()],  // comparison of inequality of two terms
                ["term > e",       exprWithBinaryOp()],
                ["term >= e",      exprWithBinaryOp()],
                ["term < e",       exprWithBinaryOp()],
                ["term <= e",      exprWithBinaryOp()],
                ["term AND e",     exprWithBinaryOp()],
                ["term OR e",      exprWithBinaryOp()],
                ["term IMPLIES e", exprWithBinaryOp()],
                ["term",           "$$ = [$term]"]
            ];
        }
                        
        return {
            "lex": {
                "rules": getRules()
            },

            // the first field specified the associativity of the operator
            "operators": [
                ["left", "+", "-", "*", "/"], // left means left-to-right
                ["left", "==", "!=", ">", "<", "<="],
                ["left", "IMPLIES", "AND", "OR"],
                ["right", ":="],
                ["right", ";", ","],
                ["right", "UMINUS", "NOT"] // unary negation, not
            ],

            "start": "production",
            "bnf": {
                "production": [
                    ["transition",   "return $transition"]
                ],
                "transition": [
                    ["id [ cond ] { actions } ",
                        "$$ = { type: 'transition', val: { identifier: $id, cond: $cond, actions: $actions }}"],
                    ["id { actions } ",
                        "$$ = { type: 'transition', val: { identifier: $id, cond: null, actions: $actions }}"],
                    ["id [ cond ] ",
                        "$$ = { type: 'transition', val: { identifier: $id, cond: $cond, actions: null }}"],
                    ["id ",
                        "$$ = { type: 'transition', val: { identifier: $id, cond: null, actions: null }}"],
                    ["[ cond ] ",
                        "$$ = { type: 'transition', val: { identifier: { type: 'identifier', val: 'tick' }, cond: $cond, actions: null }}"],
                    ["{ actions } ",
                        "$$ = { type: 'transition', val: { identifier: { type: 'identifier', val: 'tick' }, cond: null, actions: $actions }}"]
                ],
                "cond": [
                    ["expression", "$$ = $expression"]
                ],
                "actions": [
                    ["a", "$$ = { type: 'actions', val: $a }"]
                ],
                "a": [
                    ["assignment", "if (!Array.isArray($$)) { $$ = []; } $$.push($assignment)"],
                    ["assignment ;", "if (!Array.isArray($$)) { $$ = []; } $$.push($assignment)"],
                    ["assignment ; a", "if (!Array.isArray($$)) { $$ = []; }; $$.push($1); $$ = $$.concat($3)"]
                ],
                "assignment": [
                    ["id := expression", assignmentExpr()]
                ],
                "id": [
                    ["IDENTIFIER", "$$ = { type: 'identifier', val: $IDENTIFIER }"],
                    ["IDENTIFIER . id", "$$ = { type: 'identifier', val: $IDENTIFIER + '.' + $id.val }"],
                    ["IDENTIFIER ( args )", getFunctionRule(opt) ]
                ],
                "args": [
                    ["expression", "if (!Array.isArray($$)) { $$ = []; } $$.push($1)"],
                    ["expression ,", "if (!Array.isArray($$)) { $$ = []; } $$.push($1)"],
                    ["expression , args", "if (!Array.isArray($$)) { $$ = []; }; $$.push($1); $$ = $$.concat($3)"]
                ],
                "number": [
                    ["NUMBER", "$$ = { type: 'number', val: $NUMBER }"]
                ],
                "term": [
                    ["number", "$$ = $number"],
                    ["id", "$$ = $id"]
                ],
                "expression":  [
                    ["e",   "$$ = { type: 'expression', val: $e }"]
                ],
                "e": expressionBNF()
            }
        };
    };
    
    var dotGrammar = function () {
        return {
            "lex": {
                "rules": getRules()
            },
            // the first field specified the associativity of the operator
            "operators": [
                ["left", "."] // left means left-to-right
            ],
            "start": "production",
            "bnf": {
                "production": [
                    ["id",   "return $id"]
                ],
                "id": [
                    ["IDENTIFIER", "$$ = { type: 'identifier', val: $IDENTIFIER }"],
                    ["IDENTIFIER . id", "$$ = { type: 'selector', val: $IDENTIFIER, child: $id }"]
                ]
            }
        };
    };
    
    /**
     * Constructor
     * @param grammar is a string defining the grammar for the parser
     */
    function EmuchartsParser() {
        try {
            this.parser = new Parser(grammar());
            this.dotNotationParser = new Parser(dotGrammar());
            this.functionParser = new Parser(grammar({parseFunctions: true}));
        } catch (e) {
            console.log(e);
        } finally {
            return this;
        }
    }
    
    /**
     * Interface function for obtaining the parser code
     * @returns string representing the javascript code of the parser
     */
    EmuchartsParser.prototype.getParserCode = function () {
        //var parser = new EmuchartsParser();
        try {
            return this.parser.generate({moduleType: "js"});
        } catch (e) { console.log(e); }
    };

    /**
     * Interface function for obtaining the rules used by the lexer
     * @returns array of { regex: (string), type: (string) }
     */
    EmuchartsParser.prototype.getLexerRules = function () {
        var ans = [];
        lexerRules.forEach(function (r) {
            ans.push({ regex: new RegExp(r.rule[0]), type: r.tokenType });
        });
        return ans;
    };
    
    /**
     * Interface function for parsing transition labels given in the form "name [ cond ] { actions }"
     * Any element of the label (name, [ cond ], { actions }) are optional,
     * i.e., we can pass any one or any two of them to parseTransition
     * @param label is the label of the transition
     * @returns { err, res };
     * err is either null or a string reporting a parser error
     * res is an object representing the parsed transition label. The returned object has the following characteristics:
     *  - The object has a type and a value.
     *  - Transition objects have type 'transition' and the value is a record { identifier, cond, actions }.
     *  - Transition condition objects have type 'cond' and the value is an arithmetic expression.
     *  - Transition actions objects have type 'actions' and the value is an array of objects of type 'assignment'.     
     *  - Assignment objects have type 'assignment' and the value is a record { identifier, binop, expression }.
     *  - Identifier objects have type 'identifier' and the value is the string representation of the identifier.
     *  - Arithmetic expression objects have type 'expression' and the value is an array of objects.
     *        Objects in the array range over the following types: number, identifier, parentheses, operators.
     *        Arithmetic operators have type 'binop' or 'unaryop', and the value is the string representation of the operator.
     *        Round parentheses have type 'par', and the value is the string representation of the parenthesis.
     *  - Binary operators have type 'binop', and the value is the string representation of the operator.
     *  - Number objects have type 'number' and the value is the string representation of the number.
     */
    EmuchartsParser.prototype.parseTransition = function (label) {
        console.log("Parsing transition " + label);
        var ans = { err: null, res: null };
        try {
            ans.res = this.parser.parse(label);
        } catch (e) {
            ans.err = e.message;
        }
        return ans;
    };

    EmuchartsParser.prototype.parseDotNotation = function (label) {
        console.log("Parsing expression " + label);
        var ans = { err: null, res: null };
        try {
            ans.res = this.dotNotationParser.parse(label);
        } catch (e) {
            ans.err = e.message;
        }
        return ans;
    };
    
    EmuchartsParser.prototype.parseFunction = function (label) {
        console.log("Parsing function " + label);
        var ans = { err: null, res: null };
        try {
            ans.res = this.functionParser.parse(label);
        } catch (e) {
            ans.err = e.message;
        }
        return ans;
    };
    
    /**
     * Parses an array of variables and creates a typed object that merges the variables.
     * Each variables is a structured object { name: (string), type: (string), value: (string) }
     *   - name uses the dot notation to specify accessors and identifiers, e.g., pump.display
     *   - type and value are optional. The fields will be null if unspecified
     * Given two variables 'pump.display1' and 'pump.display2',
     * the function returns ...
     * Two names in the array are in conflict if one name is a substring of the other
     * E.g. pump.display and pump.display.val
     * When two names are in conflit, the function returns an error string (field err of the returned object)
     *
     * @param names is Array({ name: (string), type: (string), value: (string)})
     *            Field name is mandatory. Fields type and value can be omitted.
     * @param opt is a structure that contains functions to report notifications to the user. 
     *            This parameter is optional. Currently, 'onNameConflict' is the only function
     *            supported -- it renders feedback for errors when names are in conflict.
     * @returns: { err: (string), res: Object }
     *
     */
    EmuchartsParser.prototype.parseVariables = function (variables, opt) {
        function extend(ans, v) {
            var path = v.name.split(".");
            var i = 0, tmp = ans.res;
            for (i = 0; i < path.length; i++) {
                if (i < path.length - 1) {
                    if (tmp[path[i]] && tmp[path[i]].$type === "identifier") {
                        if (opt.onNameConflict) {
                            opt.onNameConflict(path[i]);
                            ans.err = "Name conflict for " + path[i];
                            return;
                        }
                    } else {
                        if (!tmp[path[i]]) {
                            tmp[path[i]] = {
                                $type: "selector",
                                $children: { }
                            };
                        }
                        tmp = tmp[path[i]].$children;
                    }
                } else {
                    if (tmp[path[i]] && tmp[path[i]].$type === "selector") {
                        if (opt.onNameConflict) {
                            opt.onNameConflict(path[i]);
                            ans.err = "Name conflict for " + path[i];
                            return;
                        }
                    } else {
                        tmp[path[i]] = {
                            $type: "identifier",
                            $val: {
                                name : path[i],
                                type : v.type,
                                value: v.value
                            }
                        };
                    }
                }
            }
        }
        var ans = { err: null, res: {} };
        if (variables) {
            variables.forEach(function (variable) {
                console.log("Parsing dot notation " + variable);
                extend(ans, {
                    name : variable.name,
                    type : variable.type,
                    value: variable.value
                });
            });
        }
        
        return ans;
    };
    
    module.exports = EmuchartsParser;
});
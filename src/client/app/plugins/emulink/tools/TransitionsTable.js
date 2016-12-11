/**
 *
 * @author Paolo Masci
 * @date 28/10/15
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, d3*/
// FIXME: to be reimplemented with Backbone
define(function (require, exports, module) {
    "use strict";

    var _this,
        eventDispatcher = require("util/eventDispatcher");

    function TransitionsTable() {
        d3.select("#AddTransition").on("click", function () {
            d3.select("#btn_menuNewTransition").node().click();
        });
        eventDispatcher(this);
        _this = this;
        return this;
    }

    TransitionsTable.prototype.addTransitions = function(tableElements) {
        var RENAME_EVENT = "click",
            SELECT_EVENT = "mouseover",
            DESELECT_EVENT = "mouseout";
        function installTableHandlers() {
            d3.selectAll("#RemoveTransition").on("click", function () {
                _this.removeTransition(this.parentElement.parentElement.id);
            });
            // d3.selectAll("#TransitionLabel").on("dblclick", function () {
            //     _this.renameTransition(this.parentElement.parentElement.id);
            // });
            d3.selectAll("#RenameTransition").on(RENAME_EVENT, function () {
                _this.renameTransition(this.parentElement.parentElement.id);
            });
            d3.selectAll("#TransitionLabel").on(RENAME_EVENT, function () {
                _this.renameTransition(this.parentElement.parentElement.id);
            });
            d3.selectAll("#TransitionSource").on(RENAME_EVENT, function () {
                _this.renameTransition(this.parentElement.parentElement.id);
            });
            d3.selectAll("#TransitionTarget").on(RENAME_EVENT, function () {
                _this.renameTransition(this.parentElement.parentElement.id);
            });
            d3.select("#TransitionsTable").selectAll("tr").on(SELECT_EVENT, function () {
                _this.selectTransition(this.id);
            });
            d3.select("#TransitionsTable").on(DESELECT_EVENT, function () {
                _this.deselectAll();
            });
        }
        function addElement(e) {
            var newTransition = d3.select("#TransitionTemplate").node().cloneNode(true);
            newTransition.name = e.name;
            newTransition.source = e.source;
            newTransition.target = e.target;
            newTransition.id = e.id;
            newTransition.children[0].children[0].innerHTML = newTransition.name;
//            newTransition.children[0].children[0].style.width = (newTransition.name.length * 10) + "px";
            newTransition.children[1].children[0].innerHTML = newTransition.source.name;
            newTransition.children[2].children[0].innerHTML = newTransition.target.name;
            d3.select("#TransitionsTable").select("tbody").node().appendChild(newTransition);
        }
        tableElements.forEach(function (e) {
            addElement(e);
        });
        installTableHandlers();
        return _this;
    };

    TransitionsTable.prototype.removeTransition = function(elementID) {
        var table = d3.select("#TransitionsTable").select("tbody").node();
        var theTransition = d3.select("#TransitionsTable").select("#" + elementID).node();
        table.removeChild(theTransition);
        _this.fire({
            type: "TransitionsTable_deleteTransition",
            transition: {
                id: theTransition.id
            }
        });
        return _this;
    };

    TransitionsTable.prototype.renameTransition = function(elementID) {
        var theTransition = d3.select("#TransitionsTable").select("#" + elementID).node();
        _this.fire({
            type: "TransitionsTable_renameTransition",
            transition: {
                id: theTransition.id
            }
        });
        return _this;
    };

    TransitionsTable.prototype.setTransitions = function(tableElements) {
        function clearTable() {
            var table = d3.select("#TransitionsTable").select("tbody").node();
            while (table.lastChild && table.lastChild.id !== "heading") {
                table.removeChild(table.lastChild);
            }
            return _this;
        }
        clearTable();
        this.addTransitions(tableElements);
        return _this;
    };

    TransitionsTable.prototype.deselectAll = function () {
        d3.select("#TransitionsTable").select("tbody").selectAll("td")
            .attr("style", "background-color:white; color:black;");
        _this.fire({
            type: "TransitionsTable_deselectAllTransition"
        });
        return this;
    };

    TransitionsTable.prototype.deselectTransition = function (id) {
        var theTransition = d3.select("#TransitionsTable").select("tbody").select("#" + id);
        if (theTransition.node()) {
            theTransition.selectAll("td").attr("style", "background-color:white; color:black;");
            _this.fire({
                type: "TransitionsTable_deselectTransition",
                transition: {
                    id: id
                }
            });
        }
        return this;
    };

    TransitionsTable.prototype.selectTransition = function (id) {
        var theTransition = d3.select("#TransitionsTable").select("tbody").select("#" + id);
        if (theTransition.node()) {
            _this.deselectAll();
            theTransition.selectAll("td").attr("style", "background-color:steelblue; color:white;");
            _this.fire({
                type: "TransitionsTable_selectTransition",
                transition: {
                    id: id
                }
            });
        }
        return this;
    };

    TransitionsTable.prototype.scrollTop = function (id) {
        function getPosition(id) {
            var children = d3.select("#TransitionsTable").select("tbody").node().children;
            for (var i = 0; i < children.length; i++) {
                if (children[i].id === id) {
                    return i;
                }
            }
        }
        function getScrollHeight() {
            // return d3.select("#TransitionsTable").select("tbody").node().scrollHeight / d3.select("#TransitionsTable").select("tbody").node().children.length;
            return 41;
        }
        var pos = getPosition(id);
        if (pos > 0) {
            d3.select("#TransitionsTable").node().scrollTop = pos * getScrollHeight();
        }
        return this.selectTransition(id);
    };

    module.exports = TransitionsTable;
});

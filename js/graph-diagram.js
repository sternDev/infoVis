/**
 * Created by Jasmin on 25.04.2017.
 */

define('graph-diagram', ['jquery', 'd3'], function ($, d3) {
    var graphDiagram = function () {
        var year = 2014;
        this.divElementId = "#firstChart";
        this.svg = '';
        this.diagramWidth = 100;
        this.diagramHeight = 100;
        this.createDiagram(year);
        this.initChangeEvent();
    };

    graphDiagram.prototype.initChangeEvent = function () {
        var that = this;
        $('#yearSelect').change(function () {
            $(that.divElementId).empty();
            that.createDiagram(this.value);
        });
    };

    graphDiagram.prototype.createDiagram = function (year) {
        var that = this;
        $.getJSON(this.getFilename(year), function (json) {

            var dataset = json;
            that.diagramWidth = 5 * dataset.length;
            that.diagramHeight = 200;
            that.createSvg();

            that.createGraph(dataset);
        });
    };

    graphDiagram.prototype.getFilename = function (year) {
        return "/data/created/crude-oil/crude-oil-" + year + ".json";
    };

    graphDiagram.prototype.createSvg = function () {
        this.svg = d3.select(this.divElementId)
            .append("svg")
            .attr("width", this.diagramWidth)
            .attr("height", this.diagramHeight);
    };

    graphDiagram.prototype.createGraph = function (dataSet) {

        var that = this;
        var barPadding = 1;
        this.svg.selectAll("rect")
            .data(dataSet)
            .enter()
            .append("rect")
            .attr("y", function (d) {
                d = d * 20;
                return that.diagramHeight - (d * 6);  //Height minus data value
            })
            .attr("width", that.diagramWidth / dataSet.length - barPadding)
            .attr("height", function (d) {
                d = d * 20;
                return d * 6;
            })
            .attr("x", function (d, i) {
                return i * (that.diagramWidth / dataSet.length);
            })
            .attr("fill", function (d) {
                return "rgb(0, 0, " + (d * 10) + ")";
            });
    };

    graphDiagram.prototype.createText = function() {
        /* that.svg.selectAll("text")
         .data(dataset)
         .enter()
         .append("text")
         .text(function (d) {
         return d;
         })
         .attr("x", function (d, i) {
         return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
         })
         .attr("y", function (d) {
         return h - (d*10 * 4) + 14;  //15 is now 14
         })
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "white")
         .attr("text-anchor", "middle");*/
    };

    return graphDiagram;
});
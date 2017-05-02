/**
 * Created by Jasmin on 25.04.2017.
 */

define('graph-chart', ['jquery', 'd3-v3'], function ($, d3) {

    var graphChart = function (id, filename) {
        this.svg = null;
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        this.width = 1000 - this.margin.left - this.margin.right;
        this.height = 270 - this.margin.top - this.margin.bottom;

        this.id = "#" + id;
        this.addingPoints = false;
        this.filename = filename;
        $(this.id).empty();
        this.createSvg();
    };

    graphChart.prototype.createSvg = function () {
        this.svg = d3.select(this.id)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");
    };

    graphChart.prototype.setAddPoints = function (addPoints) {
        this.addingPoints = addPoints;
    };

    graphChart.prototype.createDiagram = function (range, parseMode) {
        // Parse the date / time
        var parser;
        switch (parseMode) {
            case 'time':
                parser = d3.time.format("%H:%M:%S").parse;
                break;
            case'date':
                parser = d3.time.format("%Y-%m-%d").parse;
                break;

            default:
                throw 'The parserMode is not defined';
                break;
        }

        // Set the ranges
        var x = d3.time.scale().range([0, this.width]);
        var y = d3.scale.linear().range([this.height, 0]);

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5);

        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);

        // Define the line
        var valueline = d3.svg.line()
            .x(function (d) {
                return x(d.DATE);
            })
            .y(function (d) {
                return y(d.VALUE);
            });

        // Get the data
        var that = this;
        d3.csv(this.filename, function (error, data) {
            data.forEach(function (d) {
                d.DATE = parser(d.DATE);
                d.VALUE = +d.VALUE;
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function (d) {
                return d.DATE;
            }));
            y.domain(range);

            // Add the valueline path.
            that.svg.append("path")
                .attr("class", "line")
                .attr("d", valueline(data));

            // Add the X Axis
            that.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + that.height + ")")
                .call(xAxis);

            // Add the Y Axis
            that.svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            if (that.addingPoints) {
                that.addPoints(data, x, y);
            }
        });
    };

    graphChart.prototype.addPoints = function (data, x, y) {
        var formatDate = d3.time.format("%H:%M:%S");

        // Define the div for the tooltip
        var div = d3.select(this.id).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        // Add the scatterplot
        this.svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function (d) {
                return x(d.DATE);
            })
            .attr("cy", function (d) {
                return y(d.VALUE);
            })
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(formatDate(d.DATE) + "<br/>" + d.VALUE)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    };

    return graphChart;
});
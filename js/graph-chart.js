/**
 * Created by Jasmin on 25.04.2017.
 */

define('graph-chart', ['jquery', 'd3-v3', 'svg'], function ($, d3) {

    var graphChart = function (id, filename) {
        this.svg = null;
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        calculateWidth(this);
        this.height = 270 - this.margin.top - this.margin.bottom;

        this.id = "#" + id;
        this.addingPoints = false;
        this.filename = filename;
        this.currentData = null;
        $(this.id).empty();
        this.createSvg();

        var that = this;
        $(window).change(function () {
            calculateWidth(that);
        });
    };

    function calculateWidth(context) {
        var windowWidth = $('#mainBlock').width();
        context.width = windowWidth - 80 - context.margin.left - context.margin.right;
    }

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

    graphChart.prototype.getCurrentData = function () {
        return this.currentData;
    };

    graphChart.prototype.createDiagram = function (range, parseMode, loaderId, method) {
        // Parse the date / time

        var that = this;


        // Get the data
        if (this.getCurrentData() === null) {
            d3.csv(this.filename, function (error, data) {
                that.currentData = data;
                that.test(data, loaderId, method, range, parseMode);
            });
        } else {
            calculateWidth(this);
            $(this.id).empty();
            this.createSvg();
            this.test(this.getCurrentData(), loaderId, method, range, parseMode);
        }
    };

    graphChart.prototype.test = function (data, loaderId, method, range, parseMode) {
        $('#loader' + loaderId).css('display', 'none');
        $('#addToComparision' + loaderId).css('display', 'block');


        var that = this;
        // Set the ranges
        var x = d3.time.scale().range([0, this.width]);
        var y = d3.scale.linear().range([this.height, 0]);

        // Define the axes

        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5).tickFormat(d3.time.format("%d.%m.%y"))
        ;
        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);

        // Define the line
        var valueline = d3.svg.line()
            .x(function (d) {
                return x(d.DATENEW);
            })
            .y(function (d) {
                return y(d.VALUE);
            });
        // Define the second line
        var valueline2 = d3.svg.line()
            .x(function (d) {
                return x(d.DATENEW);
            })
            .y(function (d) {
                return y(d.VALUE);
            });

        method();
        var pointData = [];
        var usedDatesMax = [];
        var usedDatesMin = [];

        var maxValue = d3.max(data, function (d) {
            return d.VALUE;
        });
        var minValue = d3.min(data, function (d) {
            return d.VALUE;
        });
        var dailyValues = [];
        var parser;
        switch (parseMode) {
            case 'time':
                parser = d3.time.format("%H:%M:%S").parse;
                break;
            case'date':
                parser = d3.time.format("%Y-%m-%d").parse;
                break;
            case'dateTime':
                parser = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
                break;

            default:
                throw 'The parserMode is not defined';
                break;
        }
        data.forEach(function (d) {
            d.DATENEW = parser(d.DATE);
            d.VALUE = +d.VALUE;


            var newDate = new Date(d.DATENEW);
            newDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
            if (d.VALUE > (maxValue - 100) && $.inArray(newDate, usedDatesMax) === -1) {
                usedDatesMax.push(newDate);
                pointData.push({'DATE': d.DATENEW, 'VALUE': d.VALUE});
            }
            if (d.VALUE < (minValue + 200) && $.inArray(newDate, usedDatesMin) === -1) {
                usedDatesMin.push(newDate);
                pointData.push({'DATE': d.DATENEW, 'VALUE': d.VALUE});
            }

            if (typeof dailyValues[newDate] === 'undefined') {
                dailyValues[newDate] = [];
            }

            dailyValues[newDate].push(d.VALUE);

        });

        /*   console.log(dailyValues);

         dailyValues.forEach(function (test) {
         console.log(test);
         var maxValue = d3.max(test, function (d) {
         return d.VALUE;
         });
         var minValue = d3.min(test, function (d) {
         return d.VALUE;
         });

         });
         */

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.DATENEW;
        }));
        y.domain(range);
        // y.domain( [1000,d3.max(data, function(d) { return d.VALUE; })]);

        // Add the valueline path.
        this.svg.append("path")
            .attr("class", "line")
            .attr("stroke", "steelblue")
            .attr("d", valueline(data));

        // Add the X Axis
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis);

        // Add the Y Axis
        this.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        //.append('text').text('ghsjgs').style('stroke', 'black').attr('x', 100).attr('y', 100);


        if (this.addingPoints) {
            this.addPoints(data, x, y);
        } else {
            this.addPoints(pointData, x, y);
            d3.csv('/data/created/crude-oil/crude-oil.csv', function (error, data) {
                //$('#' + loaderId).css('display', 'none');
                parser = d3.time.format("%Y-%m-%d").parse;
                data.forEach(function (d) {
                    d.DATENEW = parser(d.DATE);
                    d.VALUE = +(d.VALUE);
                });


                // Add the valueline path.
                that.svg.append("path")
                    .attr("class", "line")
                    .attr("stroke", "orange")
                    .attr("d", valueline2(data));
                if (that.addingPoints) {
                    that.addPoints(data, x, y);
                }
            });
        }
    };

    graphChart.prototype.createMultipleLineDiagram = function (dataBlock, dataNames, range, parseMode, loaderId) {
        // Parse the date / time
        var colors = ['green', 'BlueViolet', 'Chocolate', 'Crimson', 'DodgerBlue'];

        // Set the ranges
        var x = d3.time.scale().range([0, this.width]);
        var y = d3.scale.linear().range([this.height, 0]);

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5).tickFormat(d3.time.format("%d.%m.%y"));

        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);


        var that = this;
        var counter = 0;
        var mouseG = that.svg.append("g")
            .attr("class", "mouse-over-effects");


        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        var lines = document.getElementsByClassName('lineComparision');


        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', that.width) // can't catch mouse events on a g element
            .attr('height', that.height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function () { // on mouse out hide line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "0");
            })
            .on('mouseover', function () { // on mouse in show line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "1");
            })
            .on('mousemove', function () { // mouse moving over canvas
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                    .attr("d", function () {
                        var d = "M" + mouse[0] + "," + that.height;
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });

                var formatDate = d3.time.format("%d.%m.%Y %H:%M:%S");
                d3.selectAll(".mouse-per-line")
                    .attr("transform", function (d, i) {
                        var xDate = x.invert(mouse[0]),
                            bisect = d3.bisector(function (d) {
                                return d.DATENEW;
                            }).right;
                        var idx = bisect(d.VALUE, xDate);

                        var beginning = 0,
                            end = lines[i].getTotalLength();
                        var target = null,
                            pos = null;

                        while (true) {
                            target = Math.floor((beginning + end) / 2);
                            pos = lines[i].getPointAtLength(target);
                            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                break;
                            }
                            if (pos.x > mouse[0]) {
                                end = target;
                            } else if (pos.x < mouse[0]) {
                                beginning = target;
                            } else {
                                break; //position found
                            }
                        }

                        d3.select(this).select('text')
                            .text((y.invert(pos.y) / 1000).toFixed(3).replace('.', ',') + " €");

                        if (mouse[0] <= 0 || pos.y <= 0) {
                            return false;
                        }

                        return "translate(" + mouse[0] + "," + pos.y + ")";
                    });
            });


        $('#pricesComparisionLegend').empty();
        dataBlock.forEach(function (data, key) {
            // Define the line
            var valueline = d3.svg.line()
                .x(function (d) {
                    return x(d.DATENEW);
                })
                .y(function (d) {
                    return y(d.VALUE);
                });
            // Get the data

            $('#' + loaderId).css('display', 'none');

            // Scale the range of the data
            x.domain(d3.extent(data, function (d) {
                return d.DATENEW;
            }));
            y.domain(range);
            // y.domain( [1000,d3.max(data, function(d) { return d.VALUE; })]);

            // Add the valueline path.
            that.svg.append("path")
                .attr("class", "lineComparision")
                .attr("stroke", colors[counter])
                .attr("d", valueline(data));
            var gasStationName = dataNames[key];
            $('#pricesComparisionLegend').append('<p><span class="colorBox" style="background-color: ' + colors[counter] + ';"></span> ' + gasStationName + '</p>');


            var mousePerLine = mouseG.selectAll('.mouse-per-line')
                .data(data)
                .enter()
                .append("g")
                .attr("class", "mouse-per-line");
            mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", colors[counter])
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opacity", "0");

            mousePerLine.append("text")
                .attr("transform", "translate(10,3)");


            counter++;
        });





        // Add the X Axis
        that.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.height + ")")
            .call(xAxis);

        // Add the Y Axis
        that.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        //.append('text').text('ghsjgs').style('stroke', 'black').attr('x', 100).attr('y', 100);

    };

    graphChart.prototype.addPoints = function (data, x, y) {
        var formatDate = d3.time.format("%d.%m.%Y %H:%M:%S");

        // Define the div for the tooltip
        var div = d3.select(this.id).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        // Add the scatterplot
        this.svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 3)
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
                div.html(formatDate(d.DATE) + "<br/>" + (d.VALUE / 1000).toFixed(3).replace('.', ',') + ' €')
                    .style("left", d3.event.pageX - $('#map').width() - 40 + "px")
                    .style("top", (d3.event.pageY - 28) - event.pageY + 200 + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    };

    return graphChart;
});
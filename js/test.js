// Set the dimensions of the canvas / graph

createDiagram(2014);
createDiagram(2015);
createDiagram(2016);
createDiagram(2017);

$('#yearSelect').change(function () {
    year = this.value;
    $("#firstChart").empty();
    createDiagram();
});

function createDiagram(year) {
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;

// Parse the date / time
    var parseDate = d3.time.format("%Y-%m-%d").parse;

// Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

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

// Adds the svg canvas
    var svg = d3.select("#crudeOil" + year)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var formatDate = d3.time.format("%d.%m.%Y");

// Get the data
    d3.csv("../data/created/crude-oil/crude-oil-" + year + ".csv", function (error, data) {
        data.forEach(function (d) {
            d.DATE = parseDate(d.DATE);
            d.VALUE = +d.VALUE;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.DATE;
        }));
        y.domain([0, 0.8]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);


        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Add the scatterplot
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.DATE); })
            .attr("cy", function(d) { return y(d.VALUE); })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div	.html(formatDate(d.DATE) + "<br/>"  + d.VALUE)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


    });


}

var svgWidth = 660;
var svgHeight = 600;

var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv('./assets/data/data.csv').then(function(data) {
    console.log(data);

    data.forEach(function(datum) {
        datum.healthcare = +datum.healthcare;
        datum.poverty = +datum.poverty;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, datum => datum.poverty) - 1, d3.max(data, datum => datum.poverty)])
        .range([0, chartWidth]);

    var bottomAxis = d3.axisBottom(xLinearScale);

    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("text")
        .attr("transform", `translate(${(chartWidth/2)}, ${(chartHeight + margin.top - 20)})`)
        .style("text-anchor", "middle")
        .text("In Poverty (%)");

    // Configure a linear scale with a range between the chartHeight and 0
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, datum => datum.healthcare) - 1, d3.max(data, datum => datum.healthcare) + 1])
        .range([chartHeight, 0]);

    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (chartHeight / 2))
        .attr("y", 0 - (margin.left / 2))
        .style("text-anchor", "middle")
        .text("Lacks Healthcare (%)");

    var circleGroup = chartGroup.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
    
    circleGroup.append("circle")
        .attr("cx", function (d) { return xLinearScale(d.poverty); })
        .attr("cy", function (d) { return yLinearScale(d.healthcare); })
        .attr("r", 10.5)
        .attr("fill", "#95BBD2");
            
    circleGroup.append("text")
        .attr("x", function(d) { return xLinearScale(d.poverty); })
        .attr("y", function(d) { return yLinearScale(d.healthcare) + 3.5; })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.abbr })
        .attr("fill", "white")
        .attr("font-size", "11px")
        .attr("font-weight", "bold");
}).catch(function(error) {
    console.log(error);
});
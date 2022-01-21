d3.csv("total-majors.csv", d => {
    return {
        major: d.Major,
        major_cat: d.Major_category,
        women: +d.Women,
        men: +d.Men,
        total: +d.Total,
        women_percent: +d.ShareWomen,
        median: +d.Median
    };
}).then(data => {
    console.log(data);

    // define margin and width/height variables
    var margin = {
            top: 40,
            right: 0,
            bottom: 90,
            left: 55
        },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // create svg element with margins and height
    var svg = d3.select("#bubble")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(-15," + height + ")")
        .style('font-size', '16px')
        .call(d3.axisBottom(x).tickFormat(d3.format("~%")));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 100000])
        .range([height, 0]);

    // population scale
    var z = d3.scaleLinear()
        .domain([0, 100000])
        .range([0, 10]);

    svg.append("g").style('font-size', '16px')
        .call(d3.axisLeft(y));

    // total sample size for bubble scale
    var color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d.major_cat; }))
        .range(d3.quantize(d3.interpolateHcl("#f4e153", "#362142"), 10));

    // Draw bubbles and color code using color function
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
            return x(d.women_percent);
        })
        .attr("cy", (d) => {
            return y(d.median);
        })
        .attr("r", (d) => {
            return z(d.total);
        })
        .style("opacity", ".7")
        .style("fill", function(d) { return color(d.major_cat); })
        .on('click', function(d) {
            svg.select('.selected')
                .classed('selected', false);
            d3.select(this)
                .classed('selected', true);
            d3.select('#info3')
                .text('City: ' + JSON.stringify(this.__data__.median) +
                    ',Education Index: ' + JSON.stringify(this.__data__.median));
        });



    // Create bubble labels and center them 
    svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => {
            return x(d.women_percent);
        })
        .attr("y", (d) => {
            return y(d.median);
        })
        .text(function(d) {
            return d.major_cat;
        })
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', '14px');

    // Chart Title
    svg.append("text")
        .attr('x', (width / 2))
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('color', '#fff')
        .text('Gender Share by STEM Majors and Median Salaries (United States)');



});
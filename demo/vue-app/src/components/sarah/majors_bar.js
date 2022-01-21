// set the dimensions and margins of the graph
var margin = { top: 100, right: 0, bottom: 50, left: 0 },
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = 500 / 2; // the outerRadius goes from the middle of the SVG area to the border


d3.csv("women-stem.csv", d => {
    return {
        major: d.Major,
        major_cat: d.Major_category,
        women: +d.Women,
        // men: +d.Men,
        total: +d.Total,
        women_percent: +d.ShareWomen,
        median: +d.Median
    };
}).then(data => {
    console.log(data);
    all = data;

    //✅ ✅ ✅
    d3.select('#all')
        .on('click', () => {
            current = data.sort((a, b) => d3.ascending(a.major_cat, b.major_cat));
            d3.selectAll("#bar> *").remove();
            draw();
            toggle("#all");
        });

    d3.select('#engineering')
        .on('click', () => {
            current = all.filter(d => d.major_cat == 'Engineering');
            d3.selectAll("#bar> *").remove();
            draw();
            toggle("#engineering");

        });

    d3.select('#biology')
        .on('click', () => {
            current = all.filter(d => d.major_cat == 'Biology & Life Science');

            d3.selectAll("#bar> *").remove();
            draw();
            toggle("#biology");

        });

    d3.select('#health')
        .on('click', () => {
            current = all.filter(d => d.major_cat == 'Health');
            d3.selectAll("#bar> *").remove();
            draw();
            toggle("#health");
        });

    d3.select('#math')
        .on('click', () => {
            current = all.filter(d => d.major_cat == 'Computers & Mathematics');
            d3.selectAll("#bar> *").remove();

            draw();
            toggle("#math");
        });

    d3.select('#physical')
        .on('click', () => {
            current = all.filter(d => d.major_cat == 'Physical Sciences');
            d3.selectAll("#bar> *").remove();
            draw();
            toggle("#physical");
        });


    function toggle(id) {
        d3.selectAll('.filter')
            .style('background-color', '#ddd');
        d3.select(id)
            .style('background-color', '#e25a0077');
    }

    // draw radial bar charts based on current filtered datasets, add animation to fill the women bars sequentially as a visual 
    function draw() {

        var avg_share = d3.mean(current, d => d.women_percent)

        var svg = d3.select('#bar').append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

        var x = d3.scaleBand()
            .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .domain(current.map(function(d) { return d.major; })); // domain of the X axis is the list of majors.

        var y = d3.scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0, d3.max(current, d => d.women_percent)]); // Domain of Y is from 0 to the max seen in the data


        // Add the bars
        svg.append("g")
            .selectAll("path")
            .data(current)
            .enter()
            .append("path")
            .style("fill", "pink")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("d", d3.arc() // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(function(d) { return y(d.women_percent); })
                .padAngle(0.01)
                .padRadius(innerRadius));


        svg.selectAll("path")
            .transition()
            .duration(100)
            .attr("d", d3.arc() // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(function(d) { return y(d.women_percent); })
                .startAngle(function(d) { return x(d.major); })
                .endAngle(function(d) { return x(d.major) + x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(innerRadius))
            .delay(function(d, i) { return (i * 60) });


        // Add the labels
        svg.append("g")
            .selectAll("g")
            .data(current)
            .enter()
            .append("g")
            .attr("class", "name")
            .attr("text-anchor", function(d) { return (x(d.major) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function(d) { return "rotate(" + ((x(d.major) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.women_percent) + 10) + ",0)"; })
            .append("text")
            .text(function(d) { return (d.major) })
            .attr("transform", function(d) { return (x(d.major) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "9px")
            .attr("alignment-baseline", "middle")

        var format = d3.format(".2%")

        svg.append("text")
            .style("font-size", "24px")
            .attr("y", height / innerRadius - 20)
            .attr("x", width / innerRadius - 45)
            .attr("alignment-baseline", "middle")
            .text(format(avg_share));

        svg.append("text")
            .style("font-size", "14px")
            .attr("y", height / innerRadius + 5)
            .attr("x", width / innerRadius - 50)
            .attr("alignment-baseline", "middle")
            .text("Total % Women");

        var yAxis = svg.append("g")
            .attr("text-anchor", "middle")

        var yTick = yAxis.selectAll("g")
            .data(y.ticks(4).slice(1))
            .enter().append("g");

        yTick.append("circle")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", y);

        yTick.append("text")
            .attr("y", function(d) { return -y(d); })
            .attr("dy", "0.5em")
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-width", 7)
            .text(y.tickFormat(4, "s"));

        yTick.append("text")
            .attr("y", function(d) { return -y(d); })
            .style("font-weight", "bold")
            .attr("dy", "0.35em")
            .text(y.tickFormat(4, "%"));

        //yAxis.append("text")
        //    .attr("y", function(d) { return -y(y.ticks(4).pop()); })
        //    .attr("dy", "-1em")
        //    .text("% Women");
    }

    var current = data.sort((a, b) => d3.ascending(a.major_cat, b.major_cat));
    draw();

});
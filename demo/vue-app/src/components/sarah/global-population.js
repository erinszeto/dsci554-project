d3.csv("global-programs.csv", d => {
    return {
        country: d.country,
        field: d.field,
        number: +d.number,
        percent: +d.percent
    };
}).then(data => {
    console.log(data);

    var data = data.sort((a, b) => d3.ascending(a.country, b.country));
    original(data);

    d3.select("#selected-dropdown").text("All Countries");

    d3.select("select")
        .on("change", function(d) {
            var selected = d3.select("#d3-dropdown").node().value;
            d3.select("#selected-dropdown").text(selected);
            console.log(selected);

            if (selected == "all") {
                d3.selectAll("#test> *").remove();
                original(data)
            } else {
                d3.selectAll("#test> *").remove();
                draw(selected);
            }
        })

    function original(data) {
        // set the dimensions and margins of the graph
        var margin = { top: 50, right: 20, bottom: 50, left: 250 },
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // create svg element with margins and height
        var svg = d3.select("#test").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        rolled = d3.rollups(
            data,
            xs => d3.mean(xs, x => x.percent),
            d => d.field
        ).map(([k, v]) => ({ Field: k, Percent: v }));

        // set the ranges
        var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1)
            .domain(rolled.map(d => d.Field));

        var x = d3.scaleLinear()
            .range([0, width])
            .domain([0, 1]);


        // set colors for different countries
        var color = d3.scaleOrdinal()
            .domain(rolled.map(d => d.Field))
            .range(d3.schemePastel2);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(rolled)
            .enter().append("rect")
            .attr("fill", d => color(d.Field))
            .attr("x", x(0))
            .attr("y", d => y(d.Field))
            .attr("width", d => x(d.Percent))
            .attr("height", y.bandwidth());

        var format = d3.format(".2%");

        // append the rectangles for the bar chart
        svg.selectAll(".name")
            .data(rolled)
            .enter().append("text")
            .attr("class", "name")
            .text(d => format(d.Percent))
            .attr("x", d => x(d.Percent) + 30)
            .attr("y", d => y(d.Field) + 30);

        var format = d3.format("%");

        // append the rectangles for the bar chart


        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "axis")
            .call(d3.axisBottom(x)
                .ticks(4, '%'));

        // add the y Axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        // Chart Title
        svg.append("text")
            .attr('x', (width / 2))
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('color', '#fff')
            .text('Global* Student Population by Education Level (2010)');

        // X Axis Label
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + 40) + ")")
            .style("text-anchor", "middle")
            .style('font-size', '13px')
            .style('color', '#fff')
            .text("Population");
    }

    function draw(selected) {
        rolled = d3.rollups(
            data.filter(d => d.country == selected),
            xs => d3.mean(xs, x => x.percent),
            d => d.field
        ).map(([k, v]) => ({ Field: k, Percent: v }));

        // set the dimensions and margins of the graph        // set the dimensions and margins of the graph
        var margin = { top: 50, right: 20, bottom: 50, left: 250 },
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;


        // create svg element with margins and height
        var svg = d3.select("#test").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // set the ranges
        var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1)
            .domain(rolled.map(d => d.Field));

        var x = d3.scaleLinear()
            .range([0, width])
            .domain([0, 1]);


        // set colors for different countries
        var color = d3.scaleOrdinal()
            .domain(rolled.map(d => d.Field))
            .range(d3.schemePastel2);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(rolled)
            .enter().append("rect")
            .attr("fill", d => color(d.Field))
            .attr("x", x(0))
            .attr("y", d => y(d.Field))
            .attr("width", d => x(d.Percent))
            .attr("height", y.bandwidth());

        var format = d3.format(".2%");

        // append the rectangles for the bar chart
        svg.selectAll(".name")
            .data(rolled)
            .enter().append("text")
            .attr("class", "name")
            .text(d => format(d.Percent))
            .attr("x", d => x(d.Percent) + 30)
            .attr("y", d => y(d.Field) + 30);

        var format = d3.format("%");

        // append the rectangles for the bar chart


        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "axis")
            .call(d3.axisBottom(x)
                .ticks(4, '%'));

        // add the y Axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        // Chart Title
        svg.append("text")
            .attr('x', (width / 2))
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('color', '#fff')
            .text('Global* Student Population by Education Level (2010)');

        // X Axis Label
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + 40) + ")")
            .style("text-anchor", "middle")
            .style('font-size', '13px')
            .style('color', '#fff')
            .text("Population");
    }
})

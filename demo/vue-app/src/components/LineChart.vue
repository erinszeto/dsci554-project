<template>
  <div id="tsdiv">
    <h2 align="left" id="gender_parity">Gender Parity Indices in Tertiary Education</h2>
    <b-row align-h="start">
        <b-col align-self="start" cols="10">
        <p align="left" style="font-size: 90%">
            Gender Parity Index (GPI) = Ratio of girls to boys in tertiary education
        </p>
        <p align="left" style="font-size: 85%">
            Like the Global Student Enrollment chart that shows global student population by education level, we expect to see a larger gap between female and male enrollment, especially in tertiary education.
            The GPI also tends to increase by year for most countries indicating a rise in the ratio of girls to boys.</p>
      </b-col>
    </b-row>
    <select id="d3-dropdown" class="dropdown">
        <option value="all">All</option>
        <option value="Australia">Australia</option>
        <option value="Austria">Austria</option>
        <option value="Belgium">Belgium</option>
        <option value="Colombia">Colombia</option>
        <option value="Czech Republic">Czech Republic</option>
        <option value="Denmark">Denmark</option>
        <option value="Finland">Finland</option>
        <option value="France">France</option>
        <option value="Greece">Greece</option>
        <option value="Hungary">Hungary</option>
        <option value="Iceland">Iceland</option>
        <option value="Israel">Israel</option>
        <option value="Japan">Japan</option>
        <option value="Mexico">Mexico</option>
        <option value="New Zealand">New Zealand</option>
        <option value="Norway">Norway</option>
        <option value="Portugal">Portugal</option>
        <option value="Republic of Korea">Republic of Korea</option>
        <option value="Slovakia">Slovakia</option>
        <option value="Sweden">Sweden</option>
        <option value="United Kingdom">United Kingdom of Great Britain and Northern Ireland</option>
        <option value="United States">United States of America</option>
    </select>

    <p id="selected-dropdown" align="left"></p>
    <!-- <div id="div_template"></div> -->
    <div id="lchart" align="left"></div> 
  </div>

  
</template>

<script>
import * as d3 from "d3";
export default {
  name: "LineChart",
  mounted: function () {
    d3.csv("education/gpi.csv").then((data) => {
        this.lineChart(data);
    });
  }, // mounted
  methods: {
    
    lineChart(data) {
        console.log(data);

        var parseTime = d3.timeParse("%Y");

        data.forEach(function(d) {
            d.Date = parseTime(d.Date);
        });
    
        data = data.filter(d => d.Date !== "2020");

        const margin = { top: 50, right: 30, bottom: 150, left: 75 };
        const height = 500 - margin.top - margin.bottom; // height
        const width = 700 - margin.left - margin.right; // width
        
        d3.select("#selected-dropdown").text("All Countries");
        d3.select("select")
        .on("change", function() {

            var selected = d3.select("#d3-dropdown").node().value;
            d3.select("#selected-dropdown").text(selected);

            console.log(selected);

            if (selected == "all") {
                d3.selectAll("#lchart> *").remove();
                original_time_series(data)
            } else {
                d3.selectAll("#lchart> *").remove();
                updated_time_series(selected);
            }
        });

        original_time_series(data);

        function updated_time_series(selected) {

        const updated = data.filter(d => d.Country == selected);

        const svg = d3.select("#lchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        //scale x axis 
        const x = d3.scaleTime()
            .domain(d3.extent(updated, d => d.Date))
            .range([0, width]);


        //scale y axis
        const y = d3.scaleLinear()
            .domain(d3.extent(updated, d => d.value))
            .range([height, 0]);


        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("text")
            .attr("transform", "translate(" + (width ) + " ," + (height + 35) + ")")
            .style("text-anchor", "end")
            .style('font-size', '14px')
            .style('color', '#fff')
            .text("Year");

        // draw y axis and label    
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(10));

        svg.append("text")
            .attr('transform', 'rotate(-90)')
            .attr('y', 10 - margin.left)
            .attr('x', 0 - (height / 2))
            .style('font-size', '14px')
            .style('color', '#fff')
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text("Gender Parity Index (GPI)");

        const line = d3.line()
            .x(function(d) { return x(d.Date); })
            .y(function(d) { return y(d.value); });

        svg.append("path")
            .datum(updated)
            .attr("fill", "none")
            .attr("stroke", "#8d99ae")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("d", line);

        //append circle 
        svg.selectAll("circle")
            .append("g")
            .data(updated)
            .enter()
            .append("circle")
            .attr("r", 4)
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.value))
            .style("fill", "#8d99ae");

        // create legend using color function
        svg.selectAll("mydots")
            .data(updated)
            .enter()
            .append("rect")
            .attr("x", width/2 - 20)
            .attr("y", 12)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", "#8d99ae");

        // create legend labels
        svg.selectAll("mylabels")
            .data(updated)
            .enter()
            .append("text")
            .attr("x", width/2)
            .attr("y", 20)
            .style("fill", "black")
            .text(function(d) { return d.Country })
            .attr("text-anchor", "left")
            .style('font-size', '14px')
            .style("alignment-baseline", "middle");

        // Chart Title
        svg.append("text")
            .attr('x', (width / 2))
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('color', '#fff')
            .text('Tertiary Gender Parity Index by Country (1990 - 2019)');}

    function original_time_series(data) {

        data = data.filter(d => d.Country == "World");

        const svg = d3.select("#lchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        //scale x axis 
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Date))
            .range([0, width]);


        //scale y axis
        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.value))
            .range([height, 0]);


        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("text")
            .attr("transform", "translate(" + (width ) + " ," + (height + 35) + ")")
            .style("text-anchor", "end")
            .style('font-size', '14px')
            .style('color', '#fff')
            .text("Year");

        // draw y axis and label    
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(10));

        svg.append("text")
            .attr('transform', 'rotate(-90)')
            .attr('y', 10 - margin.left)
            .attr('x', 0 - (height / 2))
            .style('font-size', '14px')
            .style('color', '#fff')
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text("Gender Parity Index (GPI)");

        const line = d3.line()
            .x(function(d) { return x(d.Date); })
            .y(function(d) { return y(d.value); });

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#8d99ae")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("d", line);

        //append circle 
        svg.selectAll("circle")
            .append("g")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 4)
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.value))
            .style("fill", "#8d99ae");

        // create legend using color function
        svg.selectAll("mydots")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", width/2 - 20)
            .attr("y", 12)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", "#8d99ae");

        // create legend labels
        svg.selectAll("mylabels")
            .data(data)
            .enter()
            .append("text")
            .attr("x", width/2)
            .attr("y", 20)
            .style("fill", "black")
            .text(function(d) { return d.Country })
            .attr("text-anchor", "left")
            .style('font-size', '14px')
            .style("alignment-baseline", "middle");

        // Chart Title
        svg.append("text")
            .attr('x', (width / 2))
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('color', '#fff')
            .text('Tertiary Gender Parity Index by Country (1990 - 2019)');}
   }, //bubble chart
  }, // methods
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
/* stylize the menu */
.dropdown {
  border-radius: 5px;
  padding: 5px;
  width: 250px;
  margin: 1%;
  cursor: pointer;
}
option:hover {
  cursor: pointer;
}
.axis path,
.axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.axis text {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 1.2em;
}

#tsdiv {
  padding-left: 20%;
}
</style>

<template>
  <div id="tsdiv">
    <h2 align="left" id="stem_graduates">Distribution of Women STEM Graduates by Major</h2>
    <b-row align-h="start">
      <b-col align-self="start" cols="10">
      <p align="left" style="font-size: 85%">
        Equality in the workplace and provision of fair pay is paramount to economic development. Women still face significant barriers to access decision-making roles and jobs all across the world, and this access often starts with education. This chart highlights the unfortunate trend that women are often underrepresented in the majors that afford students the highest salaries. For example, women only make up 20-30% of the population of Engineering majors, the highest-earning field shown in the data collected from FiveThirtyEight.</p>
      </b-col>
    </b-row>

     <div class="commands">
        <span class="reset" id="all">Reset</span>
    </div>

    <div class="commands">
        <span class="filter" id="engineering">Engineering</span>
        <span class="filter" id="biology">Biology & Life Science</span>
        <span class="filter" id="health">Health</span>
        <span class="filter" id="math">Computers & Mathematics</span>
        <span class="filter" id="physical">Physical Sciences</span>
    </div>
<div id="rchart" align="center"></div> 
<div id="info3" align="right"></div>
  </div>
  
</template>

<script>
import * as d3 from "d3";
export default {
  name: "RadialChart",
  mounted: function () {
    d3.csv("education/women-stem.csv").then((data) => {
      this.radialChart(data);
    });
  }, 
  methods: {
    
    radialChart(data) {
    console.log(data);
    const all = data;

         //✅ ✅ ✅
    d3.select('#all')
        .on('click', () => {
            current = data.sort((a, b) => d3.ascending(a.Major_category, b.Major_category));
            d3.selectAll("#rchart> *").remove();
            draw();
            toggle("#all");
        });

    d3.select('#engineering')
        .on('click', () => {
            current = all.filter(d => d.Major_category == 'Engineering');
            d3.selectAll("#rchart> *").remove();
            draw();
            toggle("#engineering");

        });

    d3.select('#biology')
        .on('click', () => {
            current = all.filter(d => d.Major_category == 'Biology & Life Science');

            d3.selectAll("#rchart> *").remove();
            draw();
            toggle("#biology");

        });

    d3.select('#health')
        .on('click', () => {
            current = all.filter(d => d.Major_category == 'Health');
            d3.selectAll("#rchart> *").remove();
            draw();
            toggle("#health");
        });

    d3.select('#math')
        .on('click', () => {
            current = all.filter(d => d.Major_category == 'Computers & Mathematics');
            d3.selectAll("#rchart> *").remove();

            draw();
            toggle("#math");
        });

    d3.select('#physical')
        .on('click', () => {
            current = all.filter(d => d.Major_category == 'Physical Sciences');
            d3.selectAll("#rchart> *").remove();
            draw();
            toggle("#physical");
        });


    function toggle(id) {
        d3.selectAll('.filter')
            .style('background-color', '#ddd');
        d3.select(id)
            .style('background-color', '#e25a0077');
    }
        // set the dimensions and margins of the graph
var margin = { top: 100, right: 0, bottom: 50, left: 0 },
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = 500 / 2; // the outerRadius goes from the middle of the SVG area to the border

    var current = data.sort((a, b) => d3.ascending(a.Major_category, b.Major_category));
    draw();


// draw radial bar charts based on current filtered datasets, add animation to fill the women bars sequentially as a visual 
    function draw() {

        var avg_share = d3.mean(current, d => d.ShareWomen)

        var svg = d3.select('#rchart').append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

        var x = d3.scaleBand()
            .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .domain(current.map(function(d) { return d.Major; })); // domain of the X axis is the list of majors.

        var y = d3.scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0, d3.max(current, d => d.ShareWomen)]); // Domain of Y is from 0 to the max seen in the data


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
                .outerRadius(function(d) { return y(d.ShareWomen); })
                .padAngle(0.01)
                .padRadius(innerRadius));


        svg.selectAll("path")
            .transition()
            .duration(100)
            .attr("d", d3.arc() // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(function(d) { return y(d.ShareWomen); })
                .startAngle(function(d) { return x(d.Major); })
                .endAngle(function(d) { return x(d.Major) + x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(innerRadius))
            .delay(function(d, i) { return (i * 20) });


        // Add the labels
        svg.append("g")
            .selectAll("g")
            .data(current)
            .enter()
            .append("g")
            .attr("class", "name")
            .attr("text-anchor", function(d) { return (x(d.Major) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function(d) { return "rotate(" + ((x(d.Major) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.ShareWomen) + 10) + ",0)"; })
            .append("text")
            .text(function(d) { return (d.Major) })
            .attr("transform", function(d) { return (x(d.Major) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
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

    }, //radial chart
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
.filter {
    border-radius: 5px;
    background-color: rgba(238, 238, 238, 0.795);
    padding: 6px;
    margin: 6px;
    color: #444;
    text-align: left;
    display: inline-block;
    cursor: default;
}

.reset {
    border-radius: 3px;
    background-color: black;
    padding: 6px;
    margin: 6px;
    color: white;
    text-align: left;
    display: inline-block;
    cursor: pointer;
}

#tsdiv {
  padding-left: 20%;
}
</style>

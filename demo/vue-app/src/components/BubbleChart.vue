<template>
  <div id="tsdiv">
    <h2 align="left" id="stem_salaries">STEM Graduates and Median Salaries</h2>
    <b-row align-h="start">
      <b-col align-self="start" cols="10">
        <p align="left" style="font-size: 85%">
      This chart further breaks down the distribution of female graduates in different disciplines. As observed in the chart, women make up a smaller proportion of Engineering and Computers & Mathematics students, but make up an overwhelming proportion of Health students. This speaks to a greater trend in women’s education and thus employment that bars women from participating equally in STEM disciplines. Also, majors with the larger percent of women are among the lowest median salaries. The size of the bubble represents the total enrollment for each major (female and male). This helps to visualize the size of each STEM major along the x-axis (% women). For example, Engineering is a relatively large major yet has a low percentage of women.</p>
      <p align="left" style="font-size: 85%">Please hover and click the bubbles to get detailed information on each major.</p>
      </b-col>
    </b-row>

                <div class="commands">
            <p class="alert" id="info3"></p>
        </div>
        <div ref="bchart" align="left"></div> 
  </div>

  
</template>

<script>
import * as d3 from "d3";
export default {
  name: "BubbleChart",
  mounted: function () {
    d3.csv("education/total-majors.csv").then((data) => {
      this.bubbleChart(data);
    });
  }, // mounted
  methods: {
    bubbleChart(data) {
        console.log(data);

    const margin = { top: 30, right: 200, bottom: 50, left: 90 };
    const height = 550 - margin.top - margin.bottom; // height
    const width = 1100 - margin.left - margin.right; // width

      const svg = d3
        .select(this.$refs.bchart)
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
        .attr("transform", "translate(0," + height + ")")
        .style('font-size', '14px')
        .call(d3.axisBottom(x).tickFormat(d3.format("~%")));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 100000])
        .range([height, 0]);

    // population scale
    var z = d3.scaleLinear()
        .domain([0, 100000])
        .range([0, 15]);

    svg.append("g").style('font-size', '14px')
        .call(d3.axisLeft(y).tickFormat(d3.format("$~s")));

            // total sample size for bubble scale
    const color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d.Major_category; }))
        .range(d3.quantize(d3.interpolateHcl("#f4e153", "#362142"), 7));

    const formatValue = d3.format(",");

            // Draw bubbles and color code using color function
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
            return x(d.ShareWomen);
        })
        .attr("cy", (d) => {
            return y(d.Median);
        })
        .attr("r", (d) => {
            return z(d.Total);
        })
        .style("opacity", ".7")
        .style("fill", function(d) { return color(d.Major_category); })
        .on("mouseover", function () {
          d3.select(this).attr("stroke", "#000");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke", null);
        })
                .on('click', function() {
            svg.select('.selected')
                .classed('selected', false);
            d3.select(this)
                .classed('selected', true);
            d3.select('#info3')
                .text('Field: ' + this.__data__.Major_category +
                    ', Median Salary: $' + formatValue(this.__data__.Median)+
                    ', Total Graduates: ' + formatValue(this.__data__.Total));
        });




    // Create bubble labels and center them 
    svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => {
            return x(d.ShareWomen);
        })
        .attr("y", (d) => {
            return y(d.Median);
        })
        .text(function(d) {
            return d.Major_category;
        })
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-weight', 'bold')
        .style('font-size', '16px');

    // X Axis Label
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + 45) + ")")
        .style("text-anchor", "middle")
        .style('font-size', '14px')
        .style('color', '#fff')
        .text("Percent of Women Students");

    // Y Axis Label 
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .style('font-size', '14px')
        .style('color', '#fff')
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Median Salary');

    // Chart Title
    svg.append("text")
        .attr('x', (900 / 2))
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('color', '#fff')
        .text('Gender Share by STEM Major Size and Median Salaries (United States)');

            // Chart Title
    svg.append("text")
        .attr('x', 900)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('color', '#fff')
        .text('Total Enrollment Reference');

            //🎒 explain:
    const legend = svg.append('g')
        .attr('fill', 'black')
        .attr('transform', 'translate(900,220)')
        .attr('text-anchor', 'middle')
        .style('font', '12px sans-serif')
        .selectAll('g')
        .data([100000, 300000, 600000])
        .join('g');

    legend.append('circle')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('cy', d => -z(d))
        .attr('r', d => z(d));

    legend.append('text')
        .attr('y', d => - 2 * z(d))
        .attr('dy', '1.4em')
        .text(d3.format('.1s'));


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
div.commands {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 0.9em;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    user-select: none;
}

#tsdiv {
  padding-left: 20%;
}
</style>

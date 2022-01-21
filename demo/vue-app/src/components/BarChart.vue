<template>
  <div id="tsdiv">
    <h2 align="left" id="student_enroll">
      Student Enrollment by Education Level and Country (2010)
    </h2>
    <b-row align-h="start">
      <b-col align-self="start" cols="10">
        <p align="left" style="font-size: 85%">
          Gender gaps in the workforce can often begin earlier in life like during schooling. We were
          able to explore this idea by looking at the total student enrollment by education level for
          select countries. We broke out the population by gender to discover
          any disparities at each education level. We discovered that there was
          a lower gender disparity in general except in certain countries such
          as Korea. Chart includes Primary, Secondary, and Tertiary education levels. Compared to the United
          States, primary education equates elementary school and secondary education is grade 6 (age
          11–12) through grade 12 (age 17–18). Teritiary education is typcially any education acter grade 12 (or high school).
        </p>
        <p align="left" style="font-size: 85%">
          Please click on the gendered bars for specific enrollment data.
        </p>
      </b-col>
    </b-row>
    <b-row align-h="start">
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
        <option value="United Kingdom of Great Britain and Northern Ireland">
          United Kingdom of Great Britain and Northern Ireland
        </option>
        <option value="United States of America">
          United States of America
        </option>
      </select>

      <p id="selected-dropdown" align="left"></p>
    </b-row>
    <!-- <div id="div_template"></div> -->
    <div id="info" align="right"></div>
    <div id="info3" align="right"></div>
    <div id="info4" align="right"></div>
    <div id="barchart" align="left"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "BarChart",
  mounted: function () {
    d3.csv("education/global-levels.csv").then((data) => {
      this.barChart(data);
    });
  }, // mounted
  methods: {
    barChart(data) {
      console.log(data);

      //var data = data.sort((a, b) => d3.ascending(a.country, b.country));
      var formatValue = d3.format(".2s");

      const margin = { top: 50, right: 30, bottom: 150, left: 100 };
      const height = 500 - margin.top - margin.bottom; // height
      const width = 700 - margin.left - margin.right; // width

      d3.select("#selected-dropdown").text("All Countries");

      d3.select("select").on("change", function () {
        var selected = d3.select("#d3-dropdown").node().value;
        d3.select("#selected-dropdown").text(selected);

        if (selected == "all") {
          d3.selectAll("#barchart> *").remove();
          original(data);
        } else {
          d3.selectAll("#barchart> *").remove();
          draw(selected);
        }
      });

      original(data);

      function original(data) {
        data = data.filter((d) => d.country == "All");

        // create svg element with margins and height
        var svg = d3
          .select("#barchart")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        // set the ranges
        var y = d3
          .scaleBand()
          .range([height, 0])
          .padding(0.1)
          .domain(data.map((d) => d.level));

        var x = d3
          .scaleLinear()
          .range([0, width])
          .domain([
            0,
            d3.max(
              data.filter((d) => d.level == "total"),
              (d) => d.all
            ),
          ]);

        // append the rectangles for the bar chart
        svg
          .selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("fill", "#e0b1cb")
          .attr("x", x(0))
          .attr("y", (d) => y(d.level))
          .attr("width", (d) => x(d.female))
          .attr("height", y.bandwidth())
          .on("mouseover", function () {
            d3.select(this).attr("stroke", "#000");
          })
          .on("mouseout", function () {
            d3.select(this).attr("stroke", null);
          })
          .on("click", function () {
            svg.select(".selected").classed("selected", false);
            d3.select(this).classed("selected", true);
            d3.select("#info3").text(
              "Female Population: " + formatValue(this.__data__.female)
            );
          });

        // append the rectangles for the bar chart
        svg
          .selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("fill", "#489fb5")
          .attr("x", (d) => x(d.female))
          .attr("y", (d) => y(d.level))
          .attr("width", (d) => x(d.male))
          .attr("height", y.bandwidth())
          .on("mouseover", function () {
            d3.select(this).attr("stroke", "#000");
          })
          .on("mouseout", function () {
            d3.select(this).attr("stroke", null);
          })
          .on("click", function () {
            svg.select(".selected").classed("selected", false);
            d3.select(this).classed("selected", true);
            d3.select("#info4").text(
              "Male Population: " + formatValue(this.__data__.male)
            );
          });

        // format population, x axis
        formatValue = d3.format(".4s");
        // add the x Axis
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "axis")
          .call(d3.axisBottom(x).ticks(4));

        // add the y Axis
        svg.append("g").attr("class", "axis").call(d3.axisLeft(y));

        // Chart Title
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", -20)
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-weight", "bold")
          .style("color", "#fff")
          .text("Global* Student Population by Education Level (2010)");

        // X Axis Label
        svg
          .append("text")
          .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + 40) + ")"
          )
          .style("text-anchor", "middle")
          .style("font-size", "13px")
          .style("color", "#fff")
          .text("Population");

        // create legend using color function
        svg
          .selectAll("mydots")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", width / 2 - 20)
          .attr("y", 0)
          .attr("width", 15)
          .attr("height", 15)
          .style("fill", "#e0b1cb");

        // create legend labels
        svg
          .selectAll("mylabels")
          .data(data)
          .enter()
          .append("text")
          .attr("x", width / 2)
          .attr("y", 10)
          .style("fill", "black")
          .text("Female")
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("alignment-baseline", "middle");

        svg
          .selectAll("mydots")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", width / 2 + 60)
          .attr("y", 0)
          .attr("width", 15)
          .attr("height", 15)
          .style("fill", "#489fb5");

        // create legend labels
        svg
          .selectAll("mylabels")
          .data(data)
          .enter()
          .append("text")
          .attr("x", width / 2 + 80)
          .attr("y", 10)
          .style("fill", "black")
          .text("Male")
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("alignment-baseline", "middle");
      }

      function draw(selected) {
        const updated = data.filter((d) => d.country == selected);

        // create svg element with margins and height
        var svg = d3
          .select("#barchart")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        // set the ranges
        var y = d3
          .scaleBand()
          .range([height, 0])
          .padding(0.1)
          .domain(updated.map((d) => d.level));

        var x = d3
          .scaleLinear()
          .range([0, width])
          .domain([
            0,
            d3.max(
              updated.filter((d) => d.level == "total"),
              (d) => d.all
            ),
          ]);

        // append the rectangles for the bar chart
        svg
          .selectAll(".bar")
          .data(updated)
          .enter()
          .append("rect")
          .attr("fill", "#e0b1cb")
          .attr("x", x(0))
          .attr("y", (d) => y(d.level))
          .attr("width", (d) => x(d.female))
          .attr("height", y.bandwidth())
          .on("mouseover", function () {
            d3.select(this).attr("stroke", "#000");
          })
          .on("mouseout", function () {
            d3.select(this).attr("stroke", null);
          })
          .on("click", function () {
            svg.select(".selected").classed("selected", false);
            d3.select(this).classed("selected", true);
            d3.select("#info3").text(
              this.__data__.level +
                " Female Population: " +
                formatValue(this.__data__.female)
            );
          });

        // append the rectangles for the bar chart
        svg
          .selectAll(".bar")
          .data(updated)
          .enter()
          .append("rect")
          .attr("fill", "#489fb5")
          .attr("x", (d) => x(d.female))
          .attr("y", (d) => y(d.level))
          .attr("width", (d) => x(d.male))
          .attr("height", y.bandwidth())
          .on("mouseover", function () {
            d3.select(this).attr("stroke", "#000");
          })
          .on("mouseout", function () {
            d3.select(this).attr("stroke", null);
          })
          .on("click", function () {
            svg.select(".selected").classed("selected", false);
            d3.select(this).classed("selected", true);
            d3.select("#info4").text(
              this.__data__.level +
                " Male Population: " +
                formatValue(this.__data__.male)
            );
          });

        // add the x Axis
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "axis")
          .call(d3.axisBottom(x).ticks(6));

        // add the y Axis
        svg.append("g").attr("class", "axis").call(d3.axisLeft(y));

        // Chart Title
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", -20)
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-weight", "bold")
          .style("color", "#fff")
          .text("Global* Student Population by Education Level (2010)");

        // X Axis Label
        svg
          .append("text")
          .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + 40) + ")"
          )
          .style("text-anchor", "middle")
          .style("font-size", "13px")
          .style("color", "#fff")
          .text("Population");

        // create legend using color function
        svg
          .selectAll("mydots")
          .data(updated)
          .enter()
          .append("rect")
          .attr("x", width / 2 - 20)
          .attr("y", 0)
          .attr("width", 15)
          .attr("height", 15)
          .style("fill", "#e0b1cb");

        // create legend labels
        svg
          .selectAll("mylabels")
          .data(updated)
          .enter()
          .append("text")
          .attr("x", width / 2)
          .attr("y", 10)
          .style("fill", "black")
          .text("Female")
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("alignment-baseline", "middle");

        svg
          .selectAll("mydots")
          .data(updated)
          .enter()
          .append("rect")
          .attr("x", width / 2 + 60)
          .attr("y", 0)
          .attr("width", 15)
          .attr("height", 15)
          .style("fill", "#489fb5");

        // create legend labels
        svg
          .selectAll("mylabels")
          .data(updated)
          .enter()
          .append("text")
          .attr("x", width / 2 + 80)
          .attr("y", 10)
          .style("fill", "black")
          .text("Male")
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("alignment-baseline", "middle");
      }
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
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 1.2em;
}

#tsdiv {
  padding-left: 20%;
}
</style>

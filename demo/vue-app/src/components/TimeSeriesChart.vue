<template>
  <div id="tsdiv">
    <h2 align="left">Monthly Wages by Gender Over Time (local currency)</h2>
    <b-row align-h="start">
      <b-col align-self="start" cols="10">
      <p align="left" style="font-size: 85%">
        Gender equality in the workplace and provision of fair pay is key to economic development. Women still face significant barriers to access
        decision-making roles and jobs all across the world. The goal of
        non-discrimination and equal treatment in the workplace is to ensure all workers are paid equally for labor of equal value, regardless of gender. The extent to which this is true can be evalulated using wage data disaggregated over time and by country.
        Use the drop down to select specific countries and observe monthly wage differences amongst men and women from 1995 to 2011.
      </p>
      </b-col>
    </b-row>

    <b-container>
      <b-row align-h="start">
        <b-col align-self="start" cols="1"
          ><b-form-select
            id="#select"
            v-model="selected"
            :options="options"
            @change="onChange($event)"
            class="dropdown"
          ></b-form-select
        ></b-col>
      </b-row>
    </b-container>
    <div ref="tschart" align="center"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "TimeSeriesChart",
  data() {
    return {
      selected: "Australia",
    };
  }, //data
  computed: {
    options: () => [
      "Australia",
      "Austria",
      "Azerbaijan",
      // "Belarus",
      "Belgium",
      "Brazil",
      "Bulgaria",
      "Cambodia",
      "Canada",
      "Colombia",
      "Costa Rica",
      "Croatia",
      "Cyprus",
      "Czech Republic",
      // "Congo, Dem. Rep.",
      // "Denmark",
      "Ecuador",
      "Egypt, Arab Rep.",
      "El Salvador",
      "Estonia",
      "Finland",
      "France",
      "Georgia",
      "Germany",
      // "Ghana",
      // "Guatemala",
      "Guyana",
      "Honduras",
      "Iceland",
      "Iraq",
      "Ireland",
      "Israel",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Latvia",
      "Lebanon",
      "Lithuania",
      "Luxembourg",
      "Mexico",
      "Mongolia",
      "Myanmar",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Norway",
      "Oman",
      "Pakistan",
      "Panama",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Korea, Rep.",
      "Romania",
      "Singapore",
      "Slovak Republic",
      "Spain",
      "Sri Lanka",
      "Eswatini",
      "Sweden",
      "Switzerland",
      "Syrian Arab Republic",
      "Thailand",
      "Timor-Leste",
      "Turkey",
      "Ukraine",
      "United Kingdom",
      "Uruguay",
      "Venezuela, RB",
      "Vietnam",
      "United States",
    ],
  },
  methods: {
    onChange() {
      // console.log("call onChange");
      let selectedCountry = this.selected;
      const selectCountry = this.nest.filter(([key]) => key == selectedCountry); // this is the ARRAY
      // RESCALE Y AXIS for new country
      function getMax(maleArr) {
        let max = 0;
        for (let i = 0; i < maleArr.length; i++) {
          if (max == 0 || parseInt(maleArr[i].wvalue) > parseInt(max))
            max = maleArr[i].wvalue;
        }
        return max;
      }
      let newMax = d3.map(selectCountry, (d) => getMax(d[1][1][1]))[0];
      this.y.domain([0, newMax]);
      let yAxis = d3.axisLeft().scale(this.y);
      // REMOVE old Y-Axis
      d3.select("#yAxis").remove();
      // create NEW Y-axis
      this.svg
        .append("g")
        .attr("class", "axis")
        .attr("id", "yAxis")
        .call(yAxis)
        .attr("font-size", "12px")
        .append("text") // y-axis Label
        .attr("id", "yAxisLabel")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Wages");

      // Select all of the grouped elements and update the data
      const selectCountryGroups = this.svg
        .selectAll(".countryGroups")
        .data(selectCountry);
      // Select all the lines and transition to new positions
      selectCountryGroups
        .selectAll("path.line")
        .data(([, values]) => values)
        .transition()
        .duration(600)
        .attr("d", (d) => this.valueLine(Array.from(d.values())[1]));
    }, // onChange

    lineChart(data) {
      // console.log("call line chart");
      // console.log(data);

      const margin = { top: 10, right: 0, bottom: 0, left: 56 };
      const h = 500 - margin.top - margin.bottom; // height
      const w = 900 - margin.left - margin.right; // width
      const valueLine = d3
        .line()
        .x(function (d) {
          return x(d.year);
        })
        .y(function (d) {
          return y(d.wvalue);
        });
      this.valueLine = valueLine;
      const svg = d3
        .select(this.$refs.tschart)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 " + w * 1.5 + " " + h * 1.1)
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svg");
      this.svg = svg;

      // Add a color legend
      svg
        .append("text")
        .attr("x", w - 140)
        .attr("y", h - 16)
        .attr("font-size", 12)
        .text("Male");
      svg
        .append("circle")
        .attr("cx", w - 150)
        .attr("cy", h - 20)
        .attr("r", 6)
        .style("fill", "#377eb8");

      svg
        .append("text")
        .attr("x", w - 80)
        .attr("y", h - 16)
        .attr("font-size", 12)
        .text("Female");
      svg
        .append("circle")
        .attr("cx", w - 90)
        .attr("cy", h - 20)
        .attr("r", 6)
        .style("fill", "#e41a1c");

      //nest variable aka GROUP
      const nest = d3.groups(
        data,
        (d) => d.state,
        (d) => d.lvalue
      );
      this.nest = nest;

      // Create a dropdown menu
      const countryMenu = d3.select("#countryDropdown");

      countryMenu
        .append("select")
        .selectAll("option")
        .data(nest)
        .enter()
        .append("option")
        .attr("value", ([key]) => key)
        .text(([key]) => key);

      // Scales
      const x = d3.scaleLinear().domain([1995, 2011]).range([0, w]);
      this.x = x;

      const y = d3.scaleLinear().domain([0, 6000]).range([h, 0]);
      this.y = y;

      // Init graph
      const initialGraph = function (legis) {
        // Create AXES
        let xAxis = d3
          .axisBottom()
          .scale(x)
          .ticks(10)
          .tickFormat(d3.format("d"))
          .tickSize(7);
        let yAxis = d3.axisLeft().scale(y).tickSize(7);
        svg
          .append("g")
          .attr("class", "axis")
          .attr("id", "xAxis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis)
          .attr("font-size", "12px")
          .append("text") // X-axis Label
          .attr("id", "xAxisLabel")
          .attr("fill", "black")
          .attr("y", -10)
          .attr("x", w)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Years");
        // Y-axis
        svg
          .append("g")
          .attr("class", "axis")
          .attr("id", "yAxis")
          .call(yAxis)
          .attr("font-size", "12px")
          .append("text") // y-axis Label
          .attr("id", "yAxisLabel")
          .attr("fill", "black")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", 5)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Wages");

        const selectCountry = nest.filter(([key]) => key == legis);
        const selectCountryGroups = svg
          .selectAll(".countryGroups")
          .data(selectCountry, function (d) {
            return d ? d.key : this.key;
          })
          .enter()
          .append("g")
          .attr("class", "countryGroups");

        // color palette
        const color = d3.scaleOrdinal().range(["#e41a1c", "#377eb8"]);

        const initialPath = selectCountryGroups
          .selectAll(".line")
          .data(([, values]) => values)
          .enter()
          .append("path")
          .attr("fill", "none") // ADDED
          .attr("stroke", function (d) {
            return color(d[0]);
          })
          .attr("stroke-width", 2.5);

        initialPath
          .attr("d", (d) => valueLine(Array.from(d.values())[1]))
          .attr("class", "line");
      }; // initialGraph

      // Create initial graph
      // initialGraph("AUS")
      initialGraph("Australia");
    }, //linechart

  }, // methods
  mounted: function () {
    d3.csv("wages/wages.csv").then((data) => {
      this.lineChart(data);
      this.data = data;
    });
  },
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
  margin: 10%;
  cursor: pointer;
}
option:hover {
  cursor: pointer;
}

#tsdiv {
  padding-left: 5%;
}
</style>

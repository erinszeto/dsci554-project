<template>
  <div id="tsdiv">
    <b-container>
    <h1 id="employment-by-sector" align="left">Employment by Sector</h1>
    <!-- <b-row align-h="start"> -->
      <b-row>
      <b-col cols="10">
        <p align="left" style="font-size: 85%">
          Not only is there a gender wage gap across the globe, but there also
          exists an imbalance in the distribution of gender within job sectors.
          Explore the trends from the No Ceilings dataset to observe how certain
          sectors are dominated by one gender or another. For instance, craft
          and related trade workers have large male participation rates, while
          service and sales workers have larger female participation rates. The
          trend shows managers are still predominantly male in many countries.
        </p>
        <p align="left" style="font-size: 85%">
          Gender equality in labor force participation within different industry
          sectors is key to sustainable economic growth. Women still face
          significant barriers to access decision-making roles and jobs all
          across the world.
        </p>
      </b-col>
    </b-row>

    <!-- <div ref="cpchart" align="center"></div> -->
    <!-- <div id="svgcontainer"></div> -->
    <!-- <svg width="932" height="932"></svg> -->
    <svg ref="cpchart" width="932" height="932"></svg>
    <svg ref="cplegend" width="932" height="200"></svg>
    </b-container>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "CirclePackingChart",
  mounted: function () {
    d3.json("wages/all_employment_data.json").then((data) => {
      this.circlePackingChart(data);
      this.addLegend();
    });
  }, // mounted
  methods: {
    circlePackingChart(data) {
      const color = d3
        .scaleLinear()
        .domain([0, 5])
        .range(["rgb(255, 249, 243)", "rgb(233, 201, 22)"])
        .interpolate(d3.interpolateHcl);
      const pack = (data) =>
        d3.pack().size([932, 932]).padding(3)(
          d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value)
        );
      const root = pack(data);
      let focus = root;
      let view;
      const svg = d3
        .select(this.$refs.cpchart)
        .attr("viewBox", `-${1000 / 2} -${932 / 2} ${932} ${932}`)
        .style("display", "block")
        .style("margin", "0 0 0 0")
        .style("background", color(0))
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));

      function colorCircles(d) {
        if (d.children) {
          return color(d.depth);
        } else {
          if (d.data.gender == "female") {
            return "#D291BC";
          } else {
            return "#A8B5E0";
          }
        } // else
      }
      const node = svg
        .append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("fill", (d) => colorCircles(d))
        .attr("pointer-events", (d) => (!d.children ? "none" : null))
        .on("mouseover", function () {
          d3.select(this).attr("stroke", "#000");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke", null);
        })
        .on(
          "click",
          (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
        );
      // console.log(node)
      function displayText(d) {
        if (d.parent === root) {
          return d.data.name;
        } else {
          return d.data.name + ": " + Math.round(d.data.value) + "%";
        }
      }
      const label = svg
        .append("g")
        .attr("class", "zoom-font")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
        .style("display", (d) => (d.parent === root ? "inline" : "none"))
        .text((d) => displayText(d));
      // console.log(label)
      zoomTo([root.x, root.y, root.r * 2]);
      function zoomTo(v) {
        const k = 932 / v[2];
        view = v;
        label.attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        node.attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        node.attr("r", (d) => d.r * k);
      } // zoomTo
      function zoom(event, d) {
        focus = d;
        const transition = svg
          .transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", () => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return (t) => zoomTo(i(t));
          });
        label
          .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .transition(transition)
          .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
          .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "none";
          });
      } // zoom
    }, //circlepackingchart
    addLegend() {
      // Add color legend and legend title
      const w1 = 932;
      const h1 = 200;
      const svg2 = d3
        .select(this.$refs.cplegend)
        .style("display", "block")
        .style("margin", "0 0 20 0")
        .style("background-color", "rgb(255, 249, 243)");

      // Legend border
      svg2
        .append("rect")
        .attr("x", w1-370)
        .attr("y", h1-140)
        .attr("height", 118)
        .attr("width", 370)
        .attr("stroke", "black")
        .attr("stroke-width", 1.0)
        // .attr("stroke-")
        .attr("fill", "none");

      // Explan: color=gender and what circle size means
      //
      svg2
        .append("text")
        .attr("x", w1 - 350)
        .attr("y", h1 - 110)
        .attr("font-size", 18)
        .attr("font-weight", 600)
        .text("% Share of gender employed by sector");
      svg2
        .append("text")
        .attr("x", w1 - 320)
        .attr("y", h1 - 80)
        .attr("font-size", 18)
        .text("Female");
      svg2
        .append("circle")
        .attr("cx", w1 - 340)
        .attr("cy", h1 - 86)
        .attr("r", 10)
        .style("fill", "#D291BC");

      svg2
        .append("text")
        .attr("x", w1 - 320)
        .attr("y", h1 - 50)
        .attr("font-size", 18)
        .text("Male");
      svg2
        .append("circle")
        .attr("cx", w1 - 340)
        .attr("cy", h1 - 56)
        .attr("r", 10)
        .style("fill", "#A8B5E0");
    },
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

#tsdiv {
  padding-left: 2%;
}

svg >>> .zoom-font {
  font-size: 0.96em;
  font-weight: 600;
  text-shadow: 2px 0 white, 0 1px white, 2px 0 white, 0 -2px white;
}
</style>

<template>
  <div>
    <h1>Pie Chart</h1>
    <!-- USE ref=, not id= -->
    <div ref="piechart"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "PieChart",
  // ADD D3 CODE HERE, use refs instead of id, for example:
  // var svg = d3
  // .select(this.$refs.piechart)
  methods: {
    pieChart(data) {
      console.log("call pie chart");
      console.log(data);

      function PieChart(
        data,
        {
          name = ([x]) => x, // given d in data, returns the (ordinal) label
          value = ([, y]) => y, // given d in data, returns the (quantitative) value
          title, // given d in data, returns the title text
          width = 640, // outer width, in pixels
          height = 400, // outer height, in pixels
          innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
          outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
          // labelRadius = (innerRadius * 0.2 + outerRadius * 0.8), // center radius of labels
          labelRadius = innerRadius * 0.1 + outerRadius * 0.8, // center radius of labels
          format = ",", // a format specifier for values (in the label)
          names, // array of names (the domain of the color scale)
          colors, // array of colors for names
          stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
          strokeWidth = 1, // width of stroke separating wedges
          strokeLinejoin = "round", // line join of stroke separating wedges
          padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
        } = {}
      ) {
        // Compute values.
        const N = d3.map(data, name);
        const V = d3.map(data, value);
        const I = d3.range(N.length).filter((i) => !isNaN(V[i]));

        // Unique the names.
        if (names === undefined) names = N;
        names = new d3.InternSet(names);

        // Chose a default color scheme based on cardinality.
        if (colors === undefined) colors = d3.schemeSpectral[names.size];
        if (colors === undefined)
          colors = d3.quantize(
            (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
            names.size
          );

        // Construct scales.
        const color = d3.scaleOrdinal(names, colors);

        // Compute titles.
        if (title === undefined) {
          const formatValue = d3.format(format);
          title = (i) => `${N[i]}\n${formatValue(V[i])}`;
        } else {
          const O = d3.map(data, (d) => d);
          const T = title;
          title = (i) => T(O[i], i, data);
        }

        // Construct arcs.
        const arcs = d3
          .pie()
          .padAngle(padAngle)
          .sort(null)
          .value((i) => V[i])(I);
        const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
        const arcLabel = d3
          .arc()
          .innerRadius(labelRadius)
          .outerRadius(labelRadius);

        // const svg = d3.select(this.$refs.piechart)
        const svg = d3
          .select(this.$refs.piechart)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        svg
          .append("g")
          .attr("stroke", stroke)
          .attr("stroke-width", strokeWidth)
          .attr("stroke-linejoin", strokeLinejoin)
          .selectAll("path")
          .data(arcs)
          .join("path")
          .attr("fill", (d) => color(N[d.data]))
          .attr("d", arc)
          .append("title")
          .text((d) => title(d.data));

        svg
          .append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 12)
          .attr("text-anchor", "middle")
          .selectAll("text")
          .data(arcs)
          .join("text")
          .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
          .selectAll("tspan")
          .data((d) => {
            const lines = `${title(d.data)}`.split(/\n/);
            return d.endAngle - d.startAngle > 0.25 ? lines : lines.slice(0, 1);
          })
          .join("tspan")
          .attr("x", 0)
          .attr("y", (_, i) => `${i * 1.1}em`)
          .attr("font-weight", (_, i) => (i ? null : "bold"))
          .attr("class", "donut-font")
          .text((d) => d);

        return Object.assign(svg.node(), { scales: { color } });
      } // PieChart

      PieChart(data, {
        // name: d => d.name,
        name: (d) => d.label,
        value: (d) => d.value,
        width: 500,
        height: 500,
        innerRadius: 180,
      });
    }, // pieChart
  },
  mounted: function () {
    d3.csv("fem_to_male_enrollment_USA.csv").then((data) => {
      this.pieChart(data);
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
</style>

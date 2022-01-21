<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <h1 id="wagegap_around_world">Gender Wage Gap Around the World</h1>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row>
      <b-col cols="10">
      <p style="text-align: left; font-size: 85%">
        It is clear that gender wage differences exist and that women tend to earn less than men on average. To look at this issue on a global scale, gender wage gap data from the Organisation for Economic Co-operation and Development (OECD) from 2000 to 2019 is displayed in the map below.
        The gender wage gap is a global problem that is defined as the difference between earnings of men and women relative to earnings of men (%).
        Select the wage gap indicator* from the drop down and click the "Start" button to observe trends amongst OECD countries from 2000 to 2019.
      </p>
      <p style="text-align: left; font-size: 85%">
        From the data, it can be observed that the gender pay gap has been closing in recent years and is not as significant amongst bottom earners and in European countries. However, the gender wage gap is still prominent in median and top earners in developed countries like the United States, Japan, and South Korea.
        Click <a href="/explore-wagegap">here</a> to explore the data in more detail.
      </p>
      <p style="text-align: left; font-size: 70%">
        *The indicators include gender wage gap across median earners, top 10% earners (9th decile), and bottom 10% earners (1st decile).
      </p>
      </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row align-h="around">
        <b-col cols="6"><b-form-select id="#select" v-model="selected" :options="options" @change="onChange()"></b-form-select></b-col>
        <b-col cols="6"><p style="text-align:right; font-weight: bold; font-size:120%" id="value-time"></p></b-col>
      </b-row>
      <!-- <b-row>
        <b-col align-h="end">
          <div id="wrapper">
            <button id="play">Play</button>
          </div>
        </b-col>
      </b-row> -->
    </b-container>
    <div id="wrapper">
      <button id="play">Start</button>
    </div>
    <!-- <div id="div_template"></div> -->
    <b-container>
      <b-row>
        <b-col>
          <svg id="animated_chart" style="background-color: white"></svg>
          <div class="row align-items-center">
              <div class="col-sm"><div id="slider-time"></div></div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson-client";
// import { sliderHorizontal } from "d3-simple-slider";
export default {
  name: "MapChart",
  data () {
    return {
      selected: 'Gender wage gap at median',
      options: [
        { value: 'Gender wage gap at median', text: 'Gender wage gap at median' },
        { value: 'Gender wage gap at 9th decile (top)', text: 'Gender wage gap at 9th decile (top)' },
        { value: 'Gender wage gap at 1st decile (bottom)', text: 'Gender wage gap at 1st decile (bottom)'}
      ]
    }
  },
  methods: {
    onChange() {
      var select = this.selected;
      this.all_years_data = this.findAllYearsData(this.data, this.timeFrame, select);

      d3.select('p#value-time').text("Gender Wage Gap in Year "+ this.timeFrame[0]);

      d3.selectAll('.country')
          .data(topojson.feature(this.world, this.world.objects.countries).features)
          .attr("fill", d => ((typeof(this.all_years_data[0].get(d.id)) == "undefined") ? '#ccc' : this.color(this.all_years_data[0].get(d.id))));
          // .text(d => `Country: ${d.properties.name} OECD Gender Wage Gap: ${update_data.get(d.id)}`);

      var display_data = this.data.filter(function(row) {
          var indicator = row['Indicator'];
          return indicator === select;
      });

      this.display_data = display_data;

      this.animateMap(this.all_years_data, this.timeFrame, this.world, this.color);
    },
    mapChart() {
      var width = 975;
      var height = 575;

      var world = this.values[0];
      this.world = world;
      var data = this.values[1];
      this.data = data;

      var max = d3.max(this.combineWageGapData(data), function(d) { return Math.round(+d.Value,2); });
      var min = d3.min(this.combineWageGapData(data), function(d) { return Math.round(+d.Value,2); });

      var default_data = data.filter(function(row){
        var time = +row['Time'];
        var indicator = row['Indicator'];
        return time === 2019 && indicator === 'Gender wage gap at median';
      });
      default_data = new Map(default_data.map((d) => [d.id, +d.Value]));

      this.display_data = data.filter(function(row){
        var indicator = row['Indicator'];
        return indicator === 'Gender wage gap at median';
      });

      var json = topojson.feature(world, world.objects.countries);
      var color = d3.scaleQuantize([min, max], d3.schemeYlOrRd[8]);
      this.color = color;

      var timeFrame = [2000,2005,2010,2015,2016,2017,2018,2019];
      this.timeFrame = timeFrame;
      var dataTime = timeFrame.map(function(d) {
        return new Date(d,10,3);
      });
      var sliderValue = d3.timeFormat('%Y')(dataTime[0]);
      this.sliderValue = sliderValue;

      d3.select('p#value-time').text("Gender Wage Gap in Year "+ timeFrame[0]);

      var svg = d3.select('#animated_chart')
        .attr("width", width)
        .attr("height", height);

      var projection = d3.geoEquirectangular()
        .fitSize([width, height], json);

      var path = d3.geoPath()
        .projection(projection);

      svg.append("g")
        .attr("transform", "translate(15,410)")
        // .attr("transform", "translate(25,20)")
        .append(() => this.legend({ color, title: 'Gender Wage Gap (%)', width: 260 }));

      svg.append("g")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)  //🎒 explain: topojson.feature converts us counties features TopoJSON to GeoJSON
        .join("path")
        .attr("fill", d => ((typeof(default_data.get(d.id)) == "undefined") ? '#ccc' : color(default_data.get(d.id))))
        .attr("d", path)
        .attr("class", 'country');

      svg.append("path")
        .attr("class", "country-border")
        .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("opacity", 0.5)
        .attr("d", path);

      var all_years_data;
      all_years_data = this.findAllYearsData(data, timeFrame, 'Gender wage gap at median');
      this.all_years_data = all_years_data;

      this.animateMap(this.all_years_data, timeFrame, this.world, color);
    },
    animateMap(all_years_data, timeFrame, world, color) {
        var timer;  // create timer object
        let time = 0;
        var playing;
        var update_data;
        d3.select('#play')  
          .on('click', function() {  // when user clicks the play button
            if(playing == false) {  // if the map is currently playing
              timer = setInterval(function() {   // set a JS interval
                if (time <= 7) {
                  update_data = all_years_data[time];
                  d3.select('p#value-time').text("Gender Wage Gap in Year "+ timeFrame[time]);
                  d3.selectAll('.country')
                    .data(topojson.feature(world, world.objects.countries).features)
                    .transition()
                    .delay(75)
                    .duration(300)
                    .attr("fill", d => ((typeof(update_data.get(d.id)) == "undefined") ? '#ccc' : color(update_data.get(d.id))))
                  time++;
                } else {
                  time = 0;
                }
              }, 850);
            
              d3.select(this).html('Stop');  // change the button label to stop
              d3.select(".button_tooltip").html('Test');
              playing = true;   // change the status of the animation
            } else {    // else if is currently playing
              clearInterval(timer);   // stop the animation by clearing the interval
              d3.select(this).html('Start');   // change the button label to play
              playing = false;   // change the status again
            }
        });
    },
    findAllYearsData(data, timeFrame, selected_indicator) {
        var all_years_data = [];
        var wagegap_data;
        var update_data;
        timeFrame.forEach(function(item) {
          wagegap_data = data.filter(function(row){
            var time = +row['Time'];
            var indicator = row['Indicator'];
            return indicator === selected_indicator && time === item;
          });
          update_data = new Map(wagegap_data.map((d) => [d.id, +d.Value]));
          all_years_data.push(update_data);
        });
        return all_years_data;
    },
    combineWageGapData(data) {
      var wagegap_data = data.filter(function(row){
        var indicator = row['Indicator'];
        return indicator === 'Gender wage gap at median' || indicator === 'Gender wage gap at 1st decile (bottom)' || indicator === 'Gender wage gap at 9th decile (top)';
      });
      return wagegap_data;
    },
    updateTimeframe(data, sliderValue, world, color) {
      var update_data = data.filter(function(row){
          var time = row['Time'];
          return time === sliderValue;
      });

      update_data = new Map(update_data.map((d) => [d.id, +d.Value]));

      d3.selectAll('.country')
          .data(topojson.feature(world, world.objects.countries).features)
          .attr("fill", d => ((typeof(update_data.get(d.id)) == "undefined") ? '#ccc' : color(update_data.get(d.id))))
          .text(d => `Country: ${d.properties.name} OECD Gender Wage Gap: ${update_data.get(d.id)}`);
    },
    legend({
        color,
        title,
        tickSize = 6,
        width = 320,
        height = 44 + tickSize,
        marginTop = 18,
        marginRight = 0,
        marginBottom = 16 + tickSize,
        marginLeft = 0,
        ticks = width / 64,
        tickFormat,
        tickValues}
        = {}) {  //🎒 explain: define legend function with parameters color, title, tickSize...

        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .style("overflow", "visible")
            .style("display", "block");

        let x;

        // Continuous
        if (color.interpolator) {
            x = Object.assign(color.copy()
                .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
                { range() { return [marginLeft, width - marginRight]; } });

            svg.append("image")
                .attr("x", marginLeft)
                .attr("y", marginTop)
                .attr("width", width - marginLeft - marginRight)
                .attr("height", height - marginTop - marginBottom)
                .attr("preserveAspectRatio", "none")
                .attr("xlink:href", this.ramp(color.interpolator()).toDataURL());

            //scaleSequentialQuantile doesn’t implement ticks or tickFormat.
            if (x.ticks) {
                if (tickValues === undefined) {
                    const n = Math.round(ticks + 1);
                    tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
                    //console.log(tickValues);
                    //console.log(ticks);
                }
                if (typeof tickFormat !== "function") {
                    tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
                }
            }
        }

        //discrete
        else if (color.invertExtent) {
            const thresholds
                = color.thresholds ? color.thresholds() // scaleQuantize
                    : color.quantiles ? color.quantiles() // scaleQuantile
                        : color.domain(); // scaleThreshold

            const thresholdFormat
                = tickFormat === undefined ? d => d
                    : typeof tickFormat === "string" ? d3.format(tickFormat)
                        : tickFormat;

            x = d3.scaleLinear()
                .domain([-1, color.range().length - 1])
                .rangeRound([marginLeft, width - marginRight]);

            svg.append("g")
                .selectAll("rect")
                .data(color.range())
                .join("rect")
                .attr("x", (d, i) => x(i - 1))
                .attr("y", marginTop)
                .attr("width", (d, i) => x(i) - x(i - 1))
                .attr("height", height - marginTop - marginBottom)
                .attr("fill", d => d);

            tickValues = d3.range(thresholds.length);
            // tickValues.map(function(e) { return Math.round(e,2)});
            // console.log(tickValues);
            tickFormat = i => thresholdFormat(thresholds[i], i);
        }

        svg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(d3.axisBottom(x)
                .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
                .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
                .tickSize(tickSize)
                .tickValues(tickValues))
            .call(g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("y", marginTop + marginBottom - height - 6)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(title));

        return svg.node();
    },
    ramp(color, n = 256) {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      for (let i = 0; i < n; ++i) {
          context.fillStyle = color(i / (n - 1));
          context.fillRect(i, 0, 1, 1);
      }
      return canvas;
    }
  },
  mounted: function () {
    // console.log("mounted Map Chart component");
    var promises = [];
    var world_file = 'gendergap/countries-110m.json';
    var data_file = 'gendergap/oecd_data.csv';

    promises.push(d3.json(world_file));
    promises.push(d3.csv(data_file));

    Promise.all(promises).then( data => {
      this.values = data;
      this.mapChart();
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    display: flex; }

.col {
flex: 1; }

svg >>> .selected {
stroke: black;
stroke-width: 1.5;
opacity: 1;
}

/* div.tooltip {	
    position: absolute;			
    text-align: center;			
    width: 275px;					
    height: 125px;					
    padding: 2px;				
    font: 12px sans-serif;		
    background: rgb(204, 224, 250, 0.5);
    border: 0px;		
    border-radius: 8px;			
    pointer-events: none;			
} */
</style>

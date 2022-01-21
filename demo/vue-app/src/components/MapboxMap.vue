<template>
  <div id="tsdiv">
    <b-container>
      <b-row>
        <b-col>
          <h1 id="mapbox_map">Median Annual Income of US Women</h1>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row>
        <b-col cols="9">
          <p style="text-align: left; font-size: 85%">
            Data from the IWPR Status of Women in the States dataset (2013) is used in this chloropleth map to show the median annual income for women employed full-time, year-round across the United States. There is a stark difference between the median annual income of women living in rural states, such as Arkansas, where the median annual income is $30,000, and more populus states, such as the District of Columbia, where the median annual income is $60,000. The purpose of this chart is to visualize the regional differences between women's income in the United States.

            *The values of the median annual income for each state can be seen on hover
          </p>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row>
        <b-col>
          <div class="mapbox_container">
            <div id="map"></div>
            <div class="map-overlay" id="features">
              <h2>
                US Median Annual Income for Women Employed Full-Time, Year Round
              </h2>
              <div id="pd"><p>Hover over a state!</p></div>
            </div>
            <!-- <div class="map-overlay" id="legend"></div> -->
          </div>
        </b-col>
      </b-row>
    </b-container>
    <!-- <h1 align="left">Mapbox Map</h1>
    <b-row align-h="start">
      <b-col align-self="start" cols="8"> </b-col>
    </b-row> -->
  </div>
</template>

<script>
// import * as d3 from "d3";
import mapboxgl from "mapbox-gl";
export default {
  name: "MapboxMap",
  methods: {
    MapboxMap() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoibXRob21wc29uNjQiLCJhIjoiY2t2MDBubjN1N2hxdTJwbW4ydmpwZjJrOSJ9.9vnWqmcjY-SJjCX8PneymQ";
      const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mthompson64/ckwa9liup1gll14pip76obtr9", // style URL
        center: [-98, 38.88], // starting position [lng, lat]
        zoom: 3, // starting zoom
      });

      map.on("load", () => {
        // the rest of the code will go in here
        const layers = [
          "$0-$35,000",
          "$35,000-$40,000",
          "$40,000-$45,000",
          "$45,000-$50,000",
          "$50,000-$55,000",
          "$55,000+",
        ];
        const colors = [
          "#fae0e4",
          "#f9bec7",
          "#ff99ac",
          "#ff7096",
          "#ff5c8a",
          "#ff0a54",
        ];

        // create legend
        // const legend = document.getElementById("legend");

        layers.forEach((layer, i) => {
          const color = colors[i];
          // const item = document.createElement("div");
          const key = document.createElement("span");
          key.className = "legend-key";
          key.style.backgroundColor = color;
          //   key.style.opacity = 0.4;

          // const value = document.createElement("span");
          // value.innerHTML = `${layer}`;
          // item.appendChild(key);
          // item.appendChild(value);
          // legend.appendChild(item);
        });

        map.on("mousemove", (event) => {
          const states = map.queryRenderedFeatures(event.point, {
            layers: ["state-data"],
          });
          document.getElementById("pd").innerHTML = states.length
            ? `<h3>${states[0].properties.name}</h3><p>Median Annual Earnings: <strong><em>$${states[0].properties.earnings}</strong></em></p>`
            : `<p>Hover over a state!</p>`;
        });

        map.getCanvas().style.cursor = "default";
      });
    }, // MapboxMap
  }, // methods
  mounted: function () {
    console.log("mounted Mapbox map");
    this.MapboxMap();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mapbox_container {
  position: relative;
  height: 700px !important;
  width: 1000px !important;
  display: inline-block;
}

body {
  margin: 0;
  padding: 0;
}

h2,
h3 {
  margin: 10px;
  font-size: 18px;
}

h3 {
  font-size: 16px;
}

p {
  margin: 10px;
}

/**
        * Create a position for the map
        * on the page */
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

/**
        * Set rules for how the map overlays
        * (information box and legend) will be displayed
        * on the page. */
.map-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #fff;
  margin-right: 20px;
  font-family: Arial, sans-serif;
  overflow: auto;
  border-radius: 3px;
}

#features {
  top: 0;
  height: 150px;
  margin-top: 20px;
  width: 250px;
}

#legend {
  padding: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 18px;
  height: 125px;
  margin-bottom: 40px;
  width: 150px;
}

.legend-key {
  display: inline-block;
  border-radius: 20%;
  width: 10px;
  height: 10px;
  margin-right: 5px;
}

.container {
  display: flex;
}

.col {
  flex: 1;
}
</style>
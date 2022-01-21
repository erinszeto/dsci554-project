<template>
  <div class="dashboard">
    <div class="container-fluid">
      <div class="row">
        <nav
          id="sidebarMenu"
          class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        >
          <div class="sidebar-sticky pt-3">
            <ul class="nav flex-column">
              <b>Explore</b>
              <hr />
              <li class="nav-item">
                <a class="nav-link active" align="left" href="/explore">
                  Monthly Wages by Gender Over Time
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" align="left" href="/explore-wagegap">
                  Gender Wage Gap Around the World
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div id="main_div">
          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <div
              class="
                d-flex
                justify-content-between
                flex-wrap flex-md-nowrap
                align-items-center
                pt-3
                pb-2
                mb-3
                border-bottom
              "
            >
              <h4>Visualizing the Gender Gap in Employment and Education</h4>
            </div>
            <TimeSeriesChart />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.nav-link.active,
.nav-link:hover,
.nav-link:focus {
  color: #111;
}

#sidebarMenu {
  width: 215px;
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

@supports ((position: -webkit-sticky) or (position: sticky)) {
  .sidebar-sticky {
    position: -webkit-sticky;
    position: sticky;
  }
}

@media only screen and (min-width : 320px) {
  #main_div {
    margin-left: 200px;
  }
}
</style>

<script>
// @ is an alias to /src
// import MapChart from "../components/MapChart";
// import AnimatedMap from "../components/AnimatedMap";
// import TimeSeriesAggChart from "../components/TimeSeriesAggChart";
import TimeSeriesChart from "../components/TimeSeriesChart";
// import CirclePackingChart from '../components/CirclePackingChart'
// import MapboxMap from "../components/MapboxMap";

export default {
  name: "dashboard",
  components: {
    // MapChart,
    // AnimatedMap,
    // TimeSeriesAggChart,
    TimeSeriesChart
    // CirclePackingChart,
    // MapboxMap
  }
};
</script>

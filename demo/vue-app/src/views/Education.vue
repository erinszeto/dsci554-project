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
              <!-- <b align="left">Employment</b>
              <hr />
              <li class="nav-item">
                <a class="nav-link" align="left" href="/employment#overview">
                  Overview
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" align="left" href="/employment#gender_disparity_wages">
                  Gender Disparity in Wages
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" align="left" href="/employment#wagegap_around_world">
                  Gender Wage Gap Around the World
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" align="left" href="/employment#employment-by-sector">
                  Employment by Sector
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" align="left" href="/employment#mapbox_map">
                  Median Annual Income of US Women
                </a>
              </li>
              <br /> -->
              <b>Education</b>
              <hr />
              <li class="nav-item">
                <a class="nav-link" align="left" href="#student_enroll">
                  Global Student Enrollment
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" align="left" href="#gender_parity">
                  Gender Parity Indices in Tertiary Education
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" align="left" href="#stem_salaries">
                  STEM Graduates and Median Salaries
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" align="left" href="#stem_graduates">
                  STEM Distribution of US Women
                </a>
              </li>
            </ul>
          </div>
        </nav>

          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <div class="
                  d-flex
                  justify-content-between
                  flex-wrap flex-md-nowrap
                  align-items-center
                  pt-3
                  pb-2
                  mb-3
                  border-bottom
                "
                style="margin-left: 212px"
            >
                <h4>Visualizing the Gender Gap in Employment and Education</h4>
            </div>
            <div style="margin-left:30px">
            <BarChart />
            <LineChart />
            <BubbleChart />
            <RadialChart />
            </div>
            <!-- Insert components here -->
          </main>
        <!-- </div> -->
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

#line-button {
  margin-bottom: 4%;
  margin-right: 20%;
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

/* #main_div {
  margin-left: 175px;
} */
@media only screen and (min-width : 320px) {
  #main_div {
    margin-left: 225px;
  }
}

@media only screen and (min-width : 1400px) {
  #main_div {
    margin-left: 300px;
  }
}
</style>

<script>
// @ is an alias to /src
// import Overview from "../components/Overview";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import BubbleChart from "../components/BubbleChart";
import RadialChart from "../components/RadialChart";

export default {
  name: "education",
  components: {
    BarChart,
    LineChart,
    BubbleChart,
    RadialChart
    // Overview
  }
};
</script>

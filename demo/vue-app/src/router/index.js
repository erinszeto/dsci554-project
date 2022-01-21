import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import TimeSeriesChartView from '../views/TimeSeriesChartView.vue'
import Explore from '../views/Explore.vue'
// import Education from '../views/Education.vue'
import Education2 from '../views/Education2.vue'
import Map from '../views/Map.vue'
import CirclePackingChartView from '../views/CirclePackingChartView.vue'
import MapboxMapView from '../views/MapboxMapView.vue'
import BubbleChart from '../views/BubbleChart.vue'
import RadialChart from '../views/RadialChart.vue'
import LineChart from '../views/LineChart.vue'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Dashboard
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/employment',
        name: 'Employment',
        component: Dashboard
    },
    {
        path: '/explore',
        name: 'Explore',
        component: Explore
    },
    {
        path: '/education-enrollment',
        name: 'Education',
        component: Education2
    },
    {
        path: '/explore-wagegap',
        name: 'Wage Gap',
        component: Map
    },
    {
        path: '/education-parity-indices',
        name: 'Line Chart',
        component: LineChart
    },
    {
        path: '/monthlywages',
        name: 'Monthly Wages',
        component: TimeSeriesChartView
    },
    {
        path: '/employmentbysector',
        name: 'Employment by Sector and Country',
        component: CirclePackingChartView
    },
    {
        path: '/mapboxmap',
        name: 'Mapbox Map',
        component: MapboxMapView
    },
    {
        path: '/education-stem-salaries',
        name: 'Bar Chart',
        component: BubbleChart
    },
    {
        path: '/education-stem-graduates',
        name: 'Radial Chart',
        component: RadialChart
    }
    // {
    //     path: '/education2',
    //     name: 'Original Education Page',
    //     component: Education
    // }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
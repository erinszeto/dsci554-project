<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <h2 id="overview">Overview</h2>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row>
      <b-col cols="10">
      <p class="desc">
        Women have been fighting for gender equality for centuries, as achieving gender equality is fundamental to human rights and prosperity. Although progress has been made in this area in recent decades, gender disparities continue to exist in employment and education.
        For instance, women earn considerably less than men, indicated by the gender wage gap, a measure that reports the difference between earnings of men and earning of women relative to earnings of men.
      </p>
      <p class="desc">
        To help others understand this issue and its details, we have developed this website, which stands as an interactive infographic that allows a user to explore and understand gender disparity trends.
        Four different datasets were utilized in creation of the visualizations: the Organisation for Economic Co-operation and Development (OECD) data, No Ceilings dataset, Institute for Women's Policy Research (IWPR) Status of Women in the States data, and the FiveThirtyEight college majors data.
      </p>
      </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    display: flex; }

.col {
flex: 1; }

.desc {
  text-align: left;
  font-size: 90%;
}
</style>

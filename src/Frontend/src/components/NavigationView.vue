<template>
  <section class="nav_section">
    <div class="dashboard-button">
      <div class="dashboard_image"></div>
      <h1 class="dashboard_title">Dashboard</h1>
    </div>

    <div class="expense-button">
      <div class="dashboard_image"></div>
      <h1 class="dashboard_title">Expense</h1>
    </div>

    <div>
      <div class="income-button"></div>
      <h1 class="dashboard_title">income</h1>
    </div>
  </section>
</template>


<script>
export default{
  data(){

  }
}
</script>


<style lang="scss" scoped>
@import "../assets/_base.scss";
.nav_section{
  align-self: flex-start;
  width: 20rem;
  height: 100vh;
  background-color: $somehow-black;
  @include flex(column,flex-start,center,3rem);

  *{
    color: white;
  }
}
</style>
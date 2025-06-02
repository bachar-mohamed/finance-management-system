<template>
  <section class="exp_section">
    <over-view
      :monthlyTotal="getTotalIncome"
      :highestMonthlyValue="getHighestIncome"
      :categories="getTopIncomeCategories"
      :lineChartData="getIncomeLineChartData"
      :pieChartData="getIncomePieChartData"
      @date_changed="updateData"
    ></over-view>
    <list-view :list="getMonthlyIncome" :categories="getIncomeCategories"></list-view>
  </section>
</template>

<script>
import ListView from "@/components/ListView";
import { mapGetters } from "vuex";
import OverView from "@/components/OverView";
export default {
  components: {
    ListView,
    OverView,
  },
  methods: {
    updateData(data = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }) {
      this.$store.dispatch("loadRevenueList", data);
    },
  },
  created() {
    this.updateData();
    console.log(this.$route.name);
  },
  computed: {
    ...mapGetters([
      "getTotalIncome",
      "getHighestIncome",
      "getTopIncomeCategories",
      "getIncomeLineChartData",
      "getIncomePieChartData",
      "getMonthlyIncome",
      "getIncomeCategories",
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/_base.scss";
.exp_section {
  width: 100%;
  border: 2px solid yellow;
  height: 100%;
  padding: 1rem;
  @include flex(column, flex-start, center, 5rem);
}
</style>

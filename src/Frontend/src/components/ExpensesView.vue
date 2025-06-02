<template>
  <section class="exp_section">
    <over-view
      :monthlyTotal="getTotalExpense"
      :highestMonthlyValue="getHighestExpense"
      :categories="getTopExpenseCategories"
      :lineChartData="getExpenseLineChartData"
      :pieChartData="getPieChartData"
      @date_changed="updateData"
    ></over-view>
    <list-view :list="getMonthlyExpenses" :categories="getExpenseCategories"></list-view>
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
      this.$store.dispatch("loadExpenses", data);
    },
    loadCategories() {
      this.$store.dispatch("loadCategories");
    },
    loadUserData() {
      this.$store.dispatch("loadUserInformation");
    },
  },
  created() {
    this.updateData();
    this.loadCategories();
    if (!this.getUserName) {
      this.loadUserData();
    }
  },
  computed: {
    ...mapGetters([
      "getTotalExpense",
      "getHighestExpense",
      "getTopExpenseCategories",
      "getExpenseLineChartData",
      "getPieChartData",
      "getMonthlyExpenses",
      "getExpenseCategories",
      "getUserName",
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

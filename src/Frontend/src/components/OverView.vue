<template>
  <section>
    <div class="period-selector">
      <div class="dropdown-container">
        <label for="year-selector">Year</label>
        <select id="year-selector" v-model="selectedYear" class="dropdown">
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <div class="dropdown-container">
        <label for="month-selector">Month</label>
        <select id="month-selector" v-model="selectedMonth" class="dropdown">
          <option v-for="month in months" :key="month.id" :value="month.id">
            {{ month.month }}
          </option>
        </select>
      </div>
      <button class="search-btn" @click="fetchData">Search</button>
    </div>
    <div v-if="categories.length" class="data-visualizers">
      <div class="amount-data">
        <h1 class="title">may's Expenses Overview</h1>
        <div class="values-visualizer">
          <div class="month-total">
            <h2>Total expenses</h2>
            <p class="amount">{{ monthlyTotal }}</p>
          </div>
          <div class="month-high">
            <h2>highest daily expense</h2>
            <p class="amount">{{ highestMonthlyValue }}</p>
          </div>
        </div>
      </div>
      <div class="top-categories-container">
        <h1 class="title">Top Categories</h1>
        <ul class="categories-list">
          <li v-for="category in categories" :key="category.categoryName">
            <div class="cat-image">
              <div class="cat-icon" v-html="category.categoryImage"></div>
            </div>
            <div class="category-info">
              <p class="cat-name">{{ category.categoryName }}</p>
              <p class="cat-amount">{{ category.totalAmount }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="donut-chart-container">
        <h1 class="title">Categories Share</h1>
        <div class="donut-chart-visualizer">
          <donut-chart-view-vue
            :chart-data="pieChartData"
            title="Monthly Expenses"
            theme="custom"
            :show3D="false"
            height="30rem"
            :animation-duration="1500"
          ></donut-chart-view-vue>
        </div>
      </div>
      <div class="line-chart-container">
        <h1 class="title">Daily Spending</h1>
        <div class="line-chart-visualizer">
          <line-chart-view-vue
            :chartData="lineChartData.amounts"
            :categories="lineChartData.days"
            title="Weekly Sales"
            theme="macarons"
            :smoothLine="true"
            :animationDuration="1500"
            height="35rem"
          ></line-chart-view-vue>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DonutChartViewVue from "./DonutChartView.vue";
import LineChartViewVue from "./LineChartView.vue";

export default {
  props: ["monthlyTotal", "highestMonthlyValue", "categories", "lineChartData", "pieChartData"],
  emits: ["date_changed"],
  components: { DonutChartViewVue, LineChartViewVue },
  data() {
    return {
      /*monthTextValue: this.months[this.selectedMonth-1].month,
      expenseData: [
        { value: 540, name: "Groceries" },
        { value: 210, name: "Dining Out" },
        { value: 350, name: "Transportation" },
        { value: 420, name: "Utilities" },
        { value: 180, name: "Entertainment" },
        { value: 150, name: "Shopping" },
      ],*/
      months: [
        { id: 1, month: "January" },
        { id: 2, month: "February" },
        { id: 3, month: "March" },
        { id: 4, month: "April" },
        { id: 5, month: "May" },
        { id: 6, month: "June" },
        { id: 7, month: "July" },
        { id: 8, month: "August" },
        { id: 9, month: "September" },
        { id: 10, month: "October" },
        { id: 11, month: "November" },
        { id: 12, month: "December" },
      ],
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
    };
  },
  methods: {
    fetchData() {
      const periodValues = {
        month: this.selectedMonth,
        year: this.selectedYear,
      };
      this.$emit("date_changed", periodValues);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/_base.scss";

section {
  width: 100%;
  height: calc(100vh - 10rem);
  @include flex(column, flex-start, center, 1rem);
  .period-selector {
    @include flex(row, flex-start, center, 2rem);
    width: 100%;
    height: 5rem;
    border: 2px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f9f9f9;

    .dropdown-container {
      @include flex(row, flex-start, center, 1rem);
      width: 15rem;
    }

    label {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
    }

    .dropdown {
      width: 100%;
      padding: 0.8rem;
      font-size: 1.2rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fff;
      transition: border-color 0.3s ease;
    }

    .dropdown:focus {
      border-color: #4a90e2;
    }

    .search-btn {
      padding: 0.8rem 2rem;
      font-size: 1rem;
      background-color: #9baec7;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-left: 1rem;
    }

    .search-btn:hover {
      background-color: #357abd;
    }
  }

  .data-visualizers {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(2, 310px);
    grid-template-columns: repeat(2, 823px);
    gap: 1rem;

    > div {
      padding: 0.5rem;
      width: 100%;
      height: 100%;
      border: 2px solid black;
      border-radius: 1rem;
      @include flex(column, flex-start, flex-start, 3rem);

      h1 {
        font-size: 1.8rem;
      }
    }

    .top-categories-container {
      ul {
        width: 100%;
        height: 24rem;
        overflow-y: auto;
        padding: 0;
        margin: 0;
        list-style: none;

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
        grid-auto-rows: 7rem; // Each row is 7rem tall
        gap: 1rem;
        box-sizing: border-box;

        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-track {
          background-color: #f0f0f0;
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #000000;
          border-radius: 10px;
          border: 2px solid #ffffff;
        }

        &::-webkit-scrollbar-thumb:hover {
          background-color: #1a6d89;
        }

        li {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 1rem;
          background-color: #b1c3d5;
          color: white;
          border-radius: 5px;
          padding: 1rem;
          box-sizing: border-box;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: darken(#b1c3d5, 10%);
          }

          .cat-image {
            width: 6rem;
            height: 6rem;
            border-radius: 0.5rem;
            background-color: #34495e;
            @include flex(row, center, center, 0rem);
            .cat-icon {
              width: 3rem;
              height: 3rem;
              fill: white;

              svg {
                width: 3rem;
                height: 3rem;
              }
            }
          }

          .category-info {
            height: 6rem;
            @include flex(column, flex-start, flex-start, 1rem);
          }

          .cat-name {
            font-size: 1.8rem;
            font-weight: bold;
          }

          .cat-amount {
            font-size: 1.8rem;
            color: #f39c12;
          }
        }
      }
    }

    .donut-chart-container {
      grid-row: 1;
      grid-column: 2;
      position: relative;

      .donut-chart-visualizer {
        position: absolute;
        width: 100%;
      }
    }

    .line-chart-container {
      grid-row: 2;
      grid-column: 2;
      position: relative;

      .line-chart-visualizer {
        position: absolute;
        width: 100%;
      }
    }

    .amount-data {
      grid-row: 1;
      grid-column: 1;
      border: 2px solid black;

      .values-visualizer {
        width: 100%;
        height: 25rem;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;

        > div {
          width: 100%;
          padding: 1rem;
          height: 100%;
          border-radius: 1rem;
          background-color: #124e66;
          @include flex(column, flex-start, flex-start, 1rem);

          h2 {
            font-size: 1.8rem;
          }
          .amount {
            font-size: 6rem;
            margin-bottom: 8rem;
          }
          .change-evaluator {
            font-size: 1.2rem;
          }
        }
      }
    }
  }
}
</style>

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
        <h1 class="title">
          {{ month }}'s {{ this.$route.name === "expenses" ? "Expenses" : "income" }} Overview
        </h1>
        <div class="values-visualizer">
          <div
            :class="{
              'month-total-exp': $route.name === 'expenses',
              'month-total-inc': $route.name === 'income',
            }"
          >
            <h2>Total {{ this.$route.name === "expenses" ? "Expenses" : "income" }}</h2>
            <p class="amount">{{ getFormatter.format(animatedValue) }}</p>
          </div>
          <div
            :class="{
              'month-high-exp': $route.name === 'expenses',
              'month-high-inc': $route.name === 'income',
            }"
          >
            <h2>highest daily {{ this.$route.name === "expenses" ? "Expense" : "income" }}</h2>
            <p class="amount">{{ getFormatter.format(highestMonthlyValue) }}</p>
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
              <p
                :class="{
                  'cat-amount': true,
                  'expense-data': $route.name === 'expenses',
                  'revenue-data': $route.name === 'income',
                }"
              >
                {{ getFormatter.format(category.totalAmount) }}
              </p>
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
        <h1 class="title">Daily {{ this.$route.name === "expenses" ? "Spending" : "income" }}</h1>
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
import { mapGetters } from "vuex";
import DonutChartViewVue from "./DonutChartView.vue";
import LineChartViewVue from "./LineChartView.vue";
import { Tween, Easing, Group } from "@tweenjs/tween.js";

export default {
  props: ["monthlyTotal", "highestMonthlyValue", "categories", "lineChartData", "pieChartData"],
  emits: ["date_changed"],
  components: { DonutChartViewVue, LineChartViewVue },
  data() {
    return {
      tweenGroup: new Group(),
      animatedValue: this.monthlyTotal.toFixed(0),
      month: "",
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
    setMonth(value = new Date().getMonth() + 1) {
      this.month = this.months[value - 1].month;
    },
  },
  watch: {
    selectedMonth(newVal) {
      this.setMonth(newVal);
    },
    monthlyTotal(newValue) {
      const tween = new Tween({ value: this.animatedValue })
        .to({ value: newValue }, 1000)
        .easing(Easing.Quadratic.Out)
        .onUpdate((tweenState) => {
          this.animatedValue = Math.round(tweenState.value * 100) / 100;
        });
      this.tweenGroup.add(tween);
      tween.start();
    },
  },
  computed: {
    ...mapGetters(["getFormatter"]),
  },
  mounted() {
    const animate = (time) => {
      requestAnimationFrame(animate);
      this.tweenGroup.update(time);
    };
    requestAnimationFrame(animate);
    this.setMonth();
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
    background-color: #f9f9f979;

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
      background-color: #ffffff88;
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
            color: black;
            font-weight: bold;
          }

          .cat-amount {
            font-size: 1.8rem;
            font-weight: bold;
          }

          .revenue-data {
            color: #27ae60;
          }

          .expense-data {
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
          @include flex(column, flex-start, flex-start, 1rem);
          h2 {
            font-size: 1.8rem;
          }
          .amount {
            font-size: 6rem;
            font-weight: bold;
            margin-bottom: 8rem;
          }
        }
        .month-total-exp {
          background-color: #ffb240;
        }

        .month-total-inc {
          background-color: #048abf;
        }

        .month-high-exp {
          background-color: #9eca83;
        }

        .month-high-inc {
          background-color: #d96523;
        }
      }
    }
  }
}
</style>

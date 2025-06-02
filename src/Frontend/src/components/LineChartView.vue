<template>
  <div ref="chart" class="line-chart-container" :style="{ height: height }"></div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-gl"; // For 3D effects

export default {
  name: "LineChart",
  props: {
    chartData: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    height: {
      type: String,
      default: "400px",
    },
    title: {
      type: String,
      default: "Sales Data",
    },
    theme: {
      type: String,
      default: "vintage",
      validator: (val) => ["vintage", "dark", "macarons", "shine", "custom"].includes(val),
    },
    smoothLine: {
      type: Boolean,
      default: true,
    },
    animationDuration: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  mounted() {
    this.initChart();
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart, this.theme);
      const option = this.generateOption();
      this.chartInstance.setOption(option);
    },
    generateOption() {
      return {
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(0,0,0,0.7)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          textStyle: {
            color: "#fff",
          },
          extraCssText:
            "box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); border-radius: 4px; padding: 10px;",
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: this.categories,
          axisLine: {
            lineStyle: {
              color: this.theme === "dark" || this.theme === "custom" ? "#fff" : "#333",
            },
          },
          axisLabel: {
            textStyle: {
              color: this.theme === "dark" || this.theme === "custom" ? "#fff" : "#333",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: this.theme === "dark" || this.theme === "custom" ? "#fff" : "#333",
            },
          },
          axisLabel: {
            textStyle: {
              color: this.theme === "dark" || this.theme === "custom" ? "#fff" : "#333",
            },
          },
        },
        series: [
          {
            symbolSize: 15,
            name: "Sales",
            type: "line",
            smooth: this.smoothLine,
            data: this.chartData,
            itemStyle: {
              color: this.$route.name == "expenses" ? "orange" : "green",
            },
            lineStyle: {
              width: 3,
              color: this.$route.name == "expenses" ? "orange" : "green",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops:
                  this.$route.name == "expenses"
                    ? [
                        { offset: 0, color: "rgba(255, 165, 0, 0.5)" }, // lighter orange at top
                        { offset: 1, color: "rgba(255, 165, 0, 0)" }, // transparent orange at bottom
                      ]
                    : [
                        { offset: 0, color: "rgba(144, 238, 144, 0.5)" }, // LightGreen at top
                        { offset: 1, color: "rgba(144, 238, 144, 0)" }, // Transparent green at bottom
                      ],
              },
            },
            emphasis: {
              itemStyle: {
                color: "#ecf0f1",
              },
              lineStyle: {
                width: 4,
              },
            },
          },
        ],
        animationDuration: this.animationDuration,
        animationEasing: "cubicOut",
      };
    },
    updateChart() {
      if (this.chartInstance) {
        const option = this.generateOption();
        this.chartInstance.setOption(option);
      }
    },
  },
  watch: {
    chartData: {
      handler(newData) {
        if (this.chartInstance && newData) {
          this.updateChart();
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.line-chart-container {
  width: 100%;
  transition: height 0.3s ease;
}
</style>

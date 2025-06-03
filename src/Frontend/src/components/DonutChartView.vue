<template>
  <div ref="chart" class="pie-chart-container" :style="{ height: height }"></div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-gl";
import _ from "lodash";
import { mapGetters } from "vuex";

export default {
  name: "SymmetricalDonutChart",
  props: {
    chartData: {
      type: Array,
      required: true,
      validator: (data) => data.every((item) => "value" in item && "name" in item),
    },
    height: {
      type: String,
      default: "500px",
    },
    theme: {
      type: String,
      default: "vintage",
      validator: (val) => ["vintage", "dark", "macarons", "shine", "custom"].includes(val),
    },
    animationDuration: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      chartInstance: null,
      resizeObserver: null,
    };
  },
  mounted() {
    this.initChart();
    this.setupResizeObserver();
  },
  beforeUnmount() {
    this.cleanup();
  },
  watch: {
    chartData: {
      handler(newVal) {
        this.debouncedUpdate(newVal);
      },
      deep: true,
    },
    theme() {
      this.reinitChart();
    },
  },
  methods: {
    initChart() {
      if (this.theme === "custom") {
        this.registerCustomTheme();
      }

      this.chartInstance = echarts.init(this.$refs.chart, this.theme);
      this.applyChartOptions();
    },
    registerCustomTheme() {
      echarts.registerTheme("custom", {
        backgroundColor: "transparent",
        color: [
          "#4E79A7",
          "#F28E2B",
          "#E15759",
          "#76B7B2",
          "#59A14F",
          "#EDC948",
          "#B07AA1",
          "#FF9DA7",
          "#9C755F",
          "#BAB0AC",
        ],
        textStyle: {
          color: "black",
        },
      });
    },
    applyChartOptions() {
      const option = {
        title: {
          text: this.title,
          left: "center",
          top: 20,
          textStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: this.theme === "dark" || this.theme === "custom" ? "#fff" : "#333",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return `
              <div style="font-weight:bold;margin-bottom:5px">${params.name}</div>
              <div>Amount: <b>${this.getFormatter.format(params.value)}</b></div>
              <div>Percentage: <b>${params.percent}%</b></div>
            `;
          },
          backgroundColor: "rgba(0,0,0,0.8)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          textStyle: {
            color: "#fff",
          },
          extraCssText:
            "box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); border-radius: 6px; padding: 12px;",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 30,
          top: "center",
          textStyle: {
            fontSize: 12,
            color: "black",
          },
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 15,
          data: this.chartData.map((item) => item.name),
          formatter: (name) => {
            const item = this.chartData.find((d) => d.name === name);
            return `${name} (${this.getFormatter.format(item.value)})`;
          },
        },
        series: [
          {
            name: this.title,
            type: "pie",
            radius: ["40%", "70%"],
            center: ["40%", "50%"], // Adjusted to make space for legend
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              borderRadius: 5,
              borderColor: this.theme === "dark" || this.theme === "custom" ? "#2c343c" : "#fff",
              borderWidth: 2,
              shadowBlur: 5,
              shadowColor: "rgba(0, 0, 0, 0.2)",
            },
            emphasis: {
              scale: true,
              scaleSize: 10,
              itemStyle: {
                shadowBlur: 15,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.3)",
              },
              label: {
                show: true,
                formatter: "{b}\n{d}%",
                fontSize: 14,
                fontWeight: "bold",
                color: "black",
              },
            },
            animationType: "expansion",
            animationEasing: "cubicOut",
            animationDuration: this.animationDuration,
            data: this.chartData,
          },
        ],
      };

      this.chartInstance.setOption(option);
    },
    triggerIntroAnimation() {
      if (this.chartInstance) {
        setTimeout(() => {
          this.chartInstance.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: 0,
          });
        }, 300);
      }
    },
    setupResizeObserver() {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          if (this.chartInstance) {
            this.chartInstance.resize({ width, height });
          }
        }
      });
      this.resizeObserver.observe(this.$refs.chart);
    },
    cleanup() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      if (this.chartInstance) {
        this.chartInstance.dispose();
        this.chartInstance = null;
      }
    },
    reinitChart() {
      this.cleanup();
      this.initChart();
    },
    debouncedUpdate: _.debounce(function (data) {
      if (this.chartInstance) {
        this.chartInstance.setOption({
          legend: {
            data: data.map((item) => item.name),
          },
          series: [
            {
              data: data,
            },
          ],
        });
      }
    }, 300),
  },
  computed: {
    ...mapGetters(["getFormatter"]),
  },
};
</script>

<style scoped>
.pie-chart-container {
  width: 100%;
  transition: height 0.3s ease;
}

.pie-chart-container:hover {
  cursor: pointer;
}
</style>

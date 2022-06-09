<template>
  <div class="line-chart-container mb-4" v-if="chartData">
    <p class="line-chart-title">Total Sales</p>
    <Line
      :chart-data="chartData"
      :chartOptions="chartOptions"
      :chartId="chartId"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import moment from "moment-timezone";
import { mapState } from "vuex";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
);

export default {
  name: "LineChart",
  components: {
    Line,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    width: {
      type: Number,
      default: 8,
    },
    height: {
      type: Number,
      default: 5,
    },
    chartOptions: {
      responsive: false,
      maintainAspectRatio: false,
    },
  },

  computed: {
    ...mapState(["invoiceList"]),

    chartData() {
      const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      if (this.invoiceList) {
        this.invoiceList.forEach((element) => {
          const month = moment(element.invoiceDate, "DD/MM/YYYY").format("M");
          const index = month - 1;
          data[index] += element.invoiceTotalAmount;
        });
      }

      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Sales",
            data: data,
            backgroundColor: "rgba(49, 154, 198, 0.2)",
            hoverBackgroundColor: "#ca474a",
            borderColor: "#319ac6",
            borderWidth: 2,
            pointBackgroundColor: "#319ac6",
            pointBorderColor: "#262626",
            pointBorderWidth: 2.5,
            pointRadius: 4,
            lineTension: 0.4,
            fill: true,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss">
.line-chart-container {
  background-color: #283a45;
  border-radius: 12px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
}

.line-chart-title {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

@media (min-width: 578px) {
  .line-chart-container {
    canvas {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }

  .line-chart-title {
    font-size: 18px;
    padding-left: 1rem;
    margin-bottom: 0.8rem;
  }
}

@media (min-width: 992px) {
  .line-chart-container {
    canvas {
      padding-bottom: 2.5rem;
    }
  }
}
</style>

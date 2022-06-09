<template>
  <div
    class="doughnut-chart-container row justify-content-md-center align-items-md-center"
  >
    <Doughnut :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: "DoughnutChart",
  components: { Doughnut },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss">
.doughnut-chart-container {
  padding: 1.5rem 2.5rem;
  background-color: #fff;
  border-radius: 12px;
  height: 100%;
  --bs-gutter-x: 0 !important;
}

@media (min-width: 450px) {
  .doughnut-chart-container {
    padding: 1.5rem 4rem;
  }
}

@media (min-width: 520px) {
  .doughnut-chart-container {
    padding: 1.5rem 6rem;
  }
}

@media (min-width: 576px) {
  .doughnut-chart-container {
    padding: 2rem 5rem;
  }
}

@media (min-width: 700px) {
  .doughnut-chart-container {
    padding: 2rem 8rem;
  }
}

@media (min-width: 768px) {
  .doughnut-chart-container {
    padding: 1rem;
  }
}

@media (min-width: 1050px) {
  .doughnut-chart-container {
    padding: 1rem 1.8rem;
  }
}

@media (min-width: 1200px) {
  .doughnut-chart-container {
    padding: 1rem 3rem;
  }
}
</style>

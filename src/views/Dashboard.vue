<template>
  <div class="dashboard">
    <!-- Card -->
    <div class="row">
      <div class="col-6 col-md-3 mb-4">
        <div class="box border-0 all-invoices flex-container">
          <div class="box-text pe-0">
            <span class="h6 text-white d-block mb-2">Total invoice</span>
            <span class="h4 text-white mb-0">${{ totalInvoice }}</span>
          </div>
          <div class="box-icon d-flex justify-content-end align-items-center">
            <div class="icon-shape fs-5 rounded-circle icon-all-invoices">
              <font-awesome-icon icon="dollar-sign" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3 mb-4">
        <div class="box border-0 flex-container">
          <div class="box-text pe-0">
            <span class="h6 text-muted d-block mb-2">Paid</span>
            <span class="h4 mb-0">${{ totalPaid }}</span>
          </div>
          <div class="box-icon d-flex justify-content-end align-items-center">
            <div class="icon-shape text-white fs-5 rounded-circle icon-paid">
              <font-awesome-icon icon="check" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3 mb-4">
        <div class="box border-0 flex-container">
          <div class="box-text pe-0">
            <span class="h6 text-muted d-block mb-2">Pending</span>
            <span class="h4 mb-0">${{ totalPending }}</span>
          </div>
          <div class="box-icon d-flex justify-content-end align-items-center">
            <div class="icon-shape text-white fs-5 rounded-circle icon-pending">
              <font-awesome-icon icon="clock-rotate-left" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3 mb-4">
        <div class="box border-0 flex-container">
          <div class="box-text pe-0">
            <span class="h6 text-muted d-block mb-2">Draft</span>
            <span class="h4 mb-0">${{ totalDraft }}</span>
          </div>
          <div class="box-icon d-flex justify-content-end align-items-center">
            <div class="icon-shape text-white fs-5 rounded-circle icon-draft">
              <font-awesome-icon icon="file" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <LineChart />
      </div>
      <div class="col-12 col-md-5 mb-4">
        <DoughnutChart :chartData="chartData" />
      </div>
      <div class="col-12 col-md-7 mb-4"><LatestInvoices /></div>
    </div>
  </div>
</template>

<script>
import LineChart from "../components/LineChart.vue";
import DoughnutChart from "../components/DoughnutChart.vue";
import LatestInvoices from "../components/LatestInvoices.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "Dashboard",
  components: { LineChart, LatestInvoices, DoughnutChart },

  data() {
    return {
      invoices: null,
      chartData: {
        labels: ["Paid", "Pending", "Draft"],
        datasets: [
          {
            backgroundColor: ["#1eb58b", "#e36300", "#919191"],
            data: [6415, 11064, 3335],
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["GET_INVOICES"]),
  },
  computed: {
    ...mapState(["invoiceList", "searchInvoice"]),

    totalInvoice() {
      let result = this.invoiceList.reduce((total, obj) => {
        return total + parseInt(obj.invoiceTotalAmount);
      }, 0);

      let commas = result.toLocaleString("en-US");
      return commas;
    },
    totalPaid() {
      const paidInvoices = this.invoiceList.filter(
        (invoice) => invoice.invoicePaid
      );
      let result = paidInvoices.reduce((total, obj) => {
        return total + parseInt(obj.invoiceTotalAmount);
      }, 0);

      let commas = result.toLocaleString("en-US");
      return commas;
    },
    totalPending() {
      const pendingInvoices = this.invoiceList.filter(
        (invoice) => invoice.invoicePending
      );
      let result = pendingInvoices.reduce((total, obj) => {
        return total + parseInt(obj.invoiceTotalAmount);
      }, 0);

      let commas = result.toLocaleString("en-US");
      return commas;
    },
    totalDraft() {
      const draftInvoices = this.invoiceList.filter(
        (invoice) => invoice.invoiceDraft
      );
      let result = draftInvoices.reduce((total, obj) => {
        return total + parseInt(obj.invoiceTotalAmount);
      }, 0);

      let commas = result.toLocaleString("en-US");
      return commas;
    },
  },
};
</script>

<style lang="scss">
.box {
  border-radius: 12px;
  padding: 1.5rem 1rem;
  background-color: #fff;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
}

.box-text {
  flex: 100%;
}

.box-icon {
  flex: 100%;
  justify-content: flex-end;
  padding-top: 10px;
}

.all-invoices {
  background-color: #4355a0;
}

.icon-all-invoices {
  background-color: white;
  color: #4355a0;
}
.icon-draft {
  background-color: #919191;
}

.icon-pending {
  background-color: #e36300;
}

.icon-paid {
  background-color: #1eb58b;
}

.icon-shape {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
}

@media (min-width: 482px) {
  .box-text {
    flex: 70%;
  }
  .box-icon {
    flex: 30%;
    padding-top: 0px;
  }
}

@media (min-width: 768px) {
  .box-text,
  .box-icon {
    flex: 100%;
  }

  .box-icon {
    padding-top: 10px;
  }
}

@media (min-width: 1300px) {
  .box-text {
    flex: 70%;
  }
  .box-icon {
    flex: 30%;
    padding-top: 0px;
  }
}

@media (max-width: 575px) {
  .dashboard {
    h4 {
      font-size: 1rem !important;
    }
  }
}
</style>

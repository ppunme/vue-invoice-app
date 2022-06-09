<template>
  <div class="latest-inv">
    <h4 class="mb-3 text-bold">Latest Invoices</h4>
    <div
      v-for="item in latestInv"
      :key="item.index"
      @click="viewInvoice(item.invoiceId)"
    >
      <div class="row">
        <div class="col-2">{{ item.invoiceId }}</div>
        <div class="col-3">{{ item.invoiceDate }}</div>
        <div class="col-4">{{ item.clientName }}</div>
        <div class="col-3 text-end">
          ${{ item.invoiceTotalAmount.toFixed(2) }}
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center mt-3">
      <router-link to="/invoices" class="see-more d-flex">
        <span class="text-bold me-2">See more</span>
        <font-awesome-icon icon="arrow-right-long"
      /></router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "latestInvoices",
  data() {
    return {
      enableClick: null,
    };
  },
  created() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  computed: {
    ...mapGetters(["sortedInvoices"]),

    latestInv() {
      const latest = this.sortedInvoices.slice(-3);
      return latest;
    },
  },
  methods: {
    checkScreen() {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 768) {
        this.enableClick = false;
        return;
      }
      this.enableClick = true;
    },

    viewInvoice(id) {
      if (this.enableClick) {
        this.$router.push({ path: "/invoices/" + id });
      }
    },
  },
};
</script>

<style lang="scss">
.latest-inv {
  background-color: #fff;
  border-radius: 12px;
  height: 100%;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 13px;

  .row {
    border-bottom: 1px solid #ebebeb;
    padding: 0.8rem 0;
  }

  .see-more {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #000;

    svg {
      color: #d81e5b;
    }
  }

  .text-bold {
    font-weight: 600;
  }
}

@media (min-width: 575px) {
  .latest-inv {
    font-size: 14px;

    .row {
      margin-left: 0.4rem;
      margin-right: 0.4rem;
    }
  }
}

@media (min-width: 768px) {
  .latest-inv {
    font-size: 13px;
    padding-left: 1rem;
    padding-right: 1rem;

    .row {
      padding: 0.8rem 0;
      margin-left: 0;
      margin-right: 0;
    }
  }
}

@media (min-width: 1200px) {
  .latest-inv {
    font-size: 14px;
    padding-left: 2rem;
    padding-right: 2rem;

    .row {
      padding: 1rem 0;
    }
  }
}
</style>

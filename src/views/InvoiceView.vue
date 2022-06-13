<template>
  <!-- Modal -->
  <Teleport to="body">
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <h5 class="mb-0">Edit invoice</h5>
      </template>
    </modal>
  </Teleport>

  <router-link :to="{ name: 'Invoices' }" class="btn-back">
    <font-awesome-icon icon="angle-left" /> Back
  </router-link>

  <div
    class="container invoice-view pt-4"
    v-for="(invoice, index) in currentInvoice"
    :invoice="invoice"
    :key="index"
  >
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <button
          @click="updateStatusToPaid(invoice.docId)"
          v-if="invoice.invoicePending"
          class="btn btn-mark"
        >
          Mark as Paid
        </button>
        <button
          v-if="invoice.invoiceDraft || invoice.invoicePaid"
          @click="updateStatusToPending(invoice.docId)"
          class="btn btn-mark"
        >
          Mark as Pending
        </button>
      </div>
      <!-- Status -->
      <div
        class="invoice-status user-select-none"
        :class="{
          paid: invoice.invoicePaid,
          pending: invoice.invoicePending,
          draft: invoice.invoiceDraft,
        }"
      >
        <span v-if="invoice.invoicePaid" class="d-flex justify-content-center"
          ><font-awesome-icon
            icon="circle-check"
            size="lg"
            class="me-1"
          />Paid</span
        >

        <span
          v-if="invoice.invoicePending"
          class="d-flex justify-content-center"
          ><font-awesome-icon
            icon="circle"
            size="lg"
            class="me-1"
          />Pending</span
        >
        <span v-if="invoice.invoiceDraft" class="d-flex justify-content-center"
          ><font-awesome-icon icon="o" size="lg" class="me-1" />Draft</span
        >
      </div>

      <!-- Edit and Delete btn -->
      <div class="d-flex group-button">
        <button id="show-modal" @click="editInvoice" class="btn">
          <font-awesome-icon icon="pen-to-square" />
        </button>

        <button @click="deleteInvoice(invoice.docId)" class="btn btn-delete">
          <font-awesome-icon icon="trash-can" />
        </button>
      </div>
    </div>

    <!-- Invoice preview -->
    <div class="invoice-container mt-3">
      <div class="text">
        <div class="d-flex invoice-top">
          <div class="logo">
            <img v-if="isLogoLoaded" :src="logoImg" />
            <div v-if="!isLogoLoaded" class="no-logo-found heading-text">
              <p class="mb-2">No logo found</p>
              <button
                class="btn btn-default btn-green"
                @click="$router.push({ path: '/company', replace: true })"
              >
                Upload
              </button>
            </div>
          </div>
          <div class="ms-auto text-end heading-text" v-if="this.company">
            <p class="fw-bolder">{{ company.companyName }}</p>
            <p>{{ company.companyAddress }}</p>
            <p>{{ company.companyCity }}, {{ company.companyState }}</p>
            <p>{{ company.companyPostCode }}</p>
            <p>
              <font-awesome-icon icon="at" class="icon-at" />
              {{ company.companyEmail }}
            </p>
          </div>
        </div>
        <div class="d-flex align-items-end invoice-center">
          <div class="heading-text">
            <h6>Bill To</h6>
            <p>{{ invoice.clientName }}</p>
            <p>{{ invoice.clientAddress }}</p>
            <p>
              {{ invoice.clientCity }},
              {{ invoice.clientState }}
              {{ invoice.clientPostCode }}
            </p>
          </div>
          <div class="ms-auto text-end">
            <h3 class="text-uppercase fw-bolder">Invoice</h3>
            <h3 class="invoice-id text-uppercase fw-bold">
              #{{ invoice.invoiceId }}
            </h3>
            <div class="payment">
              <p>Invoice Date:</p>
              <p>
                {{ invoice.invoiceDate }}
              </p>
              <p>Terms:</p>
              <p>{{ invoice.paymentTerms }} days</p>
              <p>Due Date:</p>
              <p>{{ invoice.dueDate }}</p>
            </div>
          </div>
        </div>
        <div class="d-flex flex-column invoice-items">
          <div>
            <div class="d-flex heading heading-text">
              <p>Item Name</p>
              <p>QTY</p>
              <p>Price</p>
              <p>Total</p>
            </div>

            <div
              v-for="(item, index) in invoice.invoiceItemList"
              :key="index"
              class="d-flex item"
            >
              <p>{{ item.itemName }}</p>
              <p>{{ item.qty }}</p>
              <p>${{ item.price }}</p>
              <p>${{ item.itemTotal.toFixed(2) }}</p>
            </div>
          </div>
          <div class="total d-flex ms-auto">
            <p>Total</p>
            <p>${{ invoice.invoiceTotalAmount.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Modal from "../components/Modal.vue";

export default {
  name: "InvoiceView",
  components: {
    Modal,
  },
  data() {
    return {
      showModal: false,
      invoice: null,
      company: null,
      isLoading: true,
    };
  },
  created() {
    this.GET_INVOICES();
  },

  methods: {
    ...mapMutations(["GET_INVOICE_BY_ID"]),
    ...mapActions([
      "GET_INVOICES",
      "GET_COMPANY_INFO",
      "GET_LOGO",
      "UPDATE_TO_PAID",
      "UPDATE_TO_PENDING",
      "DELETE_INVOICE",
    ]),

    updateStatusToPaid(docId) {
      this.UPDATE_TO_PAID(docId);
    },

    updateStatusToPending(docId) {
      this.UPDATE_TO_PENDING(docId);
    },

    editInvoice() {
      this.$store.commit("SET_EDIT_INVOICE", true);
      this.showModal = true;
    },

    async deleteInvoice(docId) {
      await this.DELETE_INVOICE(docId);
    },
  },
  computed: {
    ...mapState(["currentInvoice", "companyInfo", "logoImg"]),

    isLogoLoaded() {
      const logoLoaded = this.logoImg;
      return logoLoaded;
    },
  },
  async mounted() {
    await this.GET_COMPANY_INFO();
    this.company = this.companyInfo;

    const invoiceId = this.$route.params.invoiceId;
    this.GET_INVOICE_BY_ID(invoiceId);
  },
};
</script>

<style lang="scss" scoped>
$secondary-color: #494949;
.invoice-view {
  padding-bottom: 2rem;

  .btn-mark {
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 13px;
    border: 1px solid gray;
    height: unset;
  }
}

.invoice-status {
  font-size: 14px;
}

.invoice-container {
  position: relative;
  width: 100%;
  padding-top: 135%; /* 4:3 Aspect Ratio */
  background-color: white;
  box-shadow: 0px 0px 17px #e7e7e7;
  border-bottom: 7px solid #7898b0;
}

.text {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.heading-text {
  font-size: 10px;
  color: #727272;

  p {
    margin-bottom: 0.2rem;
  }
}

.invoice-top {
  padding: 1.5rem 1.5rem 1rem;

  .logo img {
    width: 20vw;
    min-width: 80px;
    max-width: 170px;
  }
}

.invoice-center {
  padding: 0 1.5rem 1rem;

  .invoice-id {
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1rem;
  }

  h6 {
    font-size: 0.7rem;
  }
}

.payment {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  color: #5f5f5f;

  p {
    margin-bottom: 0.2rem;
  }
}

.payment,
.item {
  font-size: 8px;
}

// Table
.invoice-items {
  padding: 0.6rem 1.5rem;
  background-color: #f6f6f6;
}
.heading p,
.item p {
  flex: 1;
  text-align: right;
  margin: 0.5rem;
}

.heading {
  font-weight: 600;
  color: $secondary-color;
  border-bottom: 1.5px solid $secondary-color;

  p:first-child {
    flex: 3;
    text-align: left;
  }
}

.item {
  border-bottom: 1px solid #dddddd;

  p:first-child {
    flex: 3;
    text-align: left;
  }
}

.total {
  width: 40%;
  padding-top: 10px;
  align-items: center;
  justify-content: flex-end;
  font-size: 12px;

  p {
    flex: 1;
    font-weight: 600;

    color: $secondary-color;
    margin-bottom: 0;
  }

  p:nth-child(2) {
    text-align: right;
  }
}

.group-button {
  button {
    color: #898782;
  }

  .btn-delete:hover {
    color: #d84548;
  }
}

.icon-at {
  color: #0072e1;
}

.no-logo-found {
  display: block;
  text-align: center;
  padding: 12px;
  border: 1px dashed #c5c5c5;
}

@media (max-width: 420px) {
  .invoice-view {
    padding-right: 0px;
    padding-left: 0px;
  }
}

@media (min-width: 455px) {
  .heading-text {
    font-size: 12px;
  }

  .invoice-center {
    padding: 0 1.5rem 1.5rem;
  }

  .invoice-items {
    padding: 1rem 1.5rem 1.5rem;
  }

  .payment,
  .item {
    font-size: 10px;
  }

  .total {
    font-size: 14px;
  }
}

@media (min-width: 520px) {
  .invoice-top {
    padding: 2rem;
  }

  .invoice-center {
    padding: 0 2rem 2rem;

    .invoice-id {
      margin-bottom: 2.5rem;
    }
  }

  .invoice-items {
    padding: 1.5em 2rem;
  }
}

@media (min-width: 576px) {
  .invoice-top {
    padding: 1.5rem 2rem;
  }

  .invoice-center {
    padding: 0 2rem 1.5rem;

    .invoice-id {
      margin-bottom: 2rem;
    }

    h3 {
      font-size: 1.2rem;
    }

    h6 {
      font-size: 0.9rem;
    }
  }

  .invoice-items {
    padding: 1rem 2rem;
  }

  .heading p,
  .item p {
    margin: 0.6rem;
  }

  .heading {
    border-bottom: 3px solid $secondary-color;
  }
}

@media (min-width: 660px) {
  .invoice-top {
    padding: 2rem 3rem;
  }

  .invoice-center {
    padding: 0 3rem 2rem 3rem;

    h3 {
      font-size: 1.5rem;
    }

    h6 {
      font-size: 1rem;
    }
  }

  .invoice-items {
    padding: 1.5rem 3rem;
  }
}

@media (min-width: 768px) {
  .invoice-view {
    max-width: 720px;
  }

  .heading-text {
    font-size: 14px;
  }
  .invoice-top {
    padding: 3rem;
  }

  .invoice-center {
    padding: 0 3rem 3rem 3rem;
  }

  .payment,
  .item {
    font-size: 12px;
  }

  .heading p,
  .item p {
    margin: 0.9rem;
  }
  .total {
    font-size: 16px;
  }
}

@media (min-width: 900px) {
  .heading-text {
    font-size: 16px;
  }

  .invoice-top {
    padding: 4rem 3rem 3rem;
  }

  .invoice-center {
    h3 {
      font-size: 2rem;
    }

    h6 {
      font-size: 1.2rem;
    }

    .invoice-id {
      margin-bottom: 2.5rem;
    }
  }

  .payment,
  .item {
    font-size: 14px;
  }

  .total {
    font-size: 18px;
  }
}
</style>

<template>
  <!-- Modal -->
  <Teleport to="body">
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <h5 class="mb-0">Edit invoice</h5>
      </template>
    </modal>
  </Teleport>

  <div class="d-flex">
    <CreateInvoice />
  </div>
  <div class="d-lg-flex justify-content-between mt-3 mb-4">
    <!-- Search -->
    <div class="d-flex search bar-left">
      <label class="d-flex align-items-center">
        <font-awesome-icon icon="search" color="gray" class="search-icon" />
        <input
          type="search"
          class="search-input"
          placeholder="Search..."
          v-model="search"
        />
      </label>
    </div>
    <!-- Select -->
    <div class="d-flex filter bar-right">
      <select
        class="form-select"
        aria-label="Default select example"
        v-model="statusSelected"
      >
        <option value="All" selected>All invoices</option>
        <option v-for="item in statusOptions" :value="item" :key="item.index">
          {{ item }}
        </option>
      </select>

      <select
        class="form-select ms-2"
        aria-label="Default select example"
        v-model="monthSelected"
      >
        <option value="All" selected>All months</option>
        <option v-for="item in monthOptions" :value="item" :key="item.index">
          {{ item }}
        </option>
      </select>
      <button class="btn btn-default btn-clear" @click="clearFilter">
        Clear
      </button>
    </div>
  </div>

  <div v-if="filteredInvoices">
    {{ filteredInvoices.length }} invoices was found
  </div>
  <div v-if="!filteredInvoices">Invoice was not found</div>

  <table class="invoices-table mt-2">
    <thead>
      <tr>
        <th>#Invoice no.</th>
        <th>Invoice date</th>
        <th class="d-none d-lg-block">Due date</th>
        <th>Client name</th>
        <th>Amount</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
    <div v-if="isDataLoaded"></div>
    <tbody>
      <tr
        v-for="(invoice, index) in filteredInvoices"
        :key="index"
        @click="viewInvoice(invoice.invoiceId)"
      >
        <td class="inv-id">#{{ invoice.invoiceId }}</td>
        <td class="inv-date">{{ invoice.invoiceDate }}</td>
        <td class="inv-duedate d-none d-lg-block">
          {{ invoice.dueDate }}
        </td>
        <td class="client-name">
          {{ invoice.clientName }}
        </td>
        <td class="price">${{ invoice.invoiceTotalAmount.toFixed(2) }}</td>
        <td class="status">
          <div
            class="invoice-status user-select-none d-flex"
            :class="{
              draft: invoice.invoiceDraft,
              pending: invoice.invoicePending,
              paid: invoice.invoicePaid,
            }"
          >
            <span v-if="invoice.invoiceDraft"
              ><font-awesome-icon
                icon="o"
                size="lg"
                class="me-1 d-none d-md-block"
              />Draft</span
            >
            <span v-if="invoice.invoicePending"
              ><font-awesome-icon
                icon="circle"
                size="lg"
                class="me-1 d-none d-md-block"
              />Pending</span
            >
            <span v-if="invoice.invoicePaid"
              ><font-awesome-icon
                icon="circle-check"
                size="lg"
                class="me-1 d-none d-md-block"
              />Paid</span
            >
          </div>
        </td>
        <td class="d-none d-md-block">
          <div class="d-none d-xl-block">
            <div class="button-group d-flex">
              <router-link :to="'/invoices/' + invoice.invoiceId">
                <div class="icon-button" type="button" title="View">
                  <font-awesome-icon :icon="['far', 'file-lines']" /></div
              ></router-link>
              <div
                class="icon-button btn-edit"
                type="button"
                title="Edit"
                @click="editInvoice(invoice.invoiceId)"
              >
                <font-awesome-icon icon="pen" />
              </div>

              <div
                type="button"
                class="icon-button btn-delete"
                title="Delete"
                @click="deleteInvoice(invoice.docId)"
              >
                <font-awesome-icon icon="xmark" />
              </div>
            </div>
          </div>

          <div
            @click="toggleDropdown(invoice)"
            type="button"
            class="d-xl-none btn-dot icon-button"
          >
            <font-awesome-icon icon="ellipsis" />
          </div>
          <div v-show="invoice.isActive" class="dot-dropdown" tabindex="-1">
            <div>
              <router-link
                :to="'/invoices/' + invoice.invoiceId"
                class="_10flxfyq"
                ><div class="_ojs7nk">View</div></router-link
              >
              <a
                class="_10flxfyq"
                @click="editInvoice(invoice.invoiceId, invoice)"
                ><div class="_ojs7nk">Edit</div></a
              >
              <a class="_10flxfyq" @click="deleteInvoice(invoice.docId)"
                ><div class="_ojs7nk">Delete</div>
              </a>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Modal from "../components/Modal.vue";
import CreateInvoice from "../components/CreateInvoice.vue";
import moment from "moment-timezone";
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "InvoiceList",
  data() {
    return {
      enableClick: null,
      search: null,
      showBox: false,
      showModal: false,
      invoices: {
        invoiceId: null,
        clientName: null,
        clientAddress: null,
        clientCity: null,
        clientState: null,
        clientPostCode: null,
        invoiceDate: null,
        paymentTerms: null,
        dueDate: null,
        invoiceItemList: null,
        invoiceTotalAmount: null,
        invoiceDraft: null,
        invoicePending: null,
        invoicePaid: null,
        isActive: null,
      },
      statusSelected: "All",
      monthSelected: "All",
      statusOptions: ["Draft", "Pending", "Paid"],
      monthOptions: [
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
    };
  },
  components: {
    Modal,
    CreateInvoice,
  },
  created() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  computed: {
    ...mapState(["searchInvoice"]),
    ...mapGetters(["sortedInvoices"]),

    filteredInvoices() {
      return this.filteredMonth(
        this.filteredType(this.searchItem(this.sortedInvoices))
      );
    },

    isDataLoaded() {
      const dataLoaded = this.sortedInvoices;

      if (dataLoaded) {
        this.invoiceId = dataLoaded.invoiceId;
        this.invoices.clientName = dataLoaded.clientName;
        this.invoices.clientAddress = dataLoaded.clientAddress;
        this.invoices.clientCity = dataLoaded.clientCity;
        this.invoices.clientState = dataLoaded.clientState;
        this.invoices.clientPostCode = dataLoaded.clientPostCode;
        this.invoices.invoiceDate = dataLoaded.formattedInvoiceDate;
        this.invoices.paymentTerms = dataLoaded.paymentTerms;
        this.invoices.dueDate = dataLoaded.formattedDueDate;
        this.invoices.invoiceItemList = dataLoaded.invoiceItemList;
        this.invoices.invoiceTotalAmount = dataLoaded.invoiceTotalAmount;
        this.invoices.invoiceDraft = dataLoaded.invoiceDraft;
        this.invoices.invoicePending = dataLoaded.invoicePending;
        this.invoices.invoicePaid = dataLoaded.invoicePaid;
        this.invoices.isActive = false;
      }
      return dataLoaded;
    },
  },

  methods: {
    ...mapMutations(["GET_INVOICE_BY_ID", "SEARCH"]),
    ...mapActions(["GET_INVOICES", "DELETE_INVOICE"]),

    async deleteInvoice(docId) {
      await this.DELETE_INVOICE(docId);
    },

    async editInvoice(invoiceId, invoice) {
      this.GET_INVOICE_BY_ID(invoiceId);
      this.$store.commit("SET_EDIT_INVOICE", true);
      this.showModal = true;
      this.toggleDropdown(invoice);
    },

    searchItem(invoices) {
      if (!this.search) {
        return invoices;
      }

      return invoices.filter((invoice) => {
        return (
          invoice.clientName
            .toLowerCase()
            .includes(this.search.toLowerCase()) ||
          invoice.invoiceId.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },

    filteredType(invoices) {
      if (this.statusSelected === "All") {
        return invoices;
      }
      if (this.statusSelected === "Draft") {
        return invoices.filter((invoice) => invoice.invoiceDraft);
      }
      if (this.statusSelected === "Pending") {
        return invoices.filter((invoice) => invoice.invoicePending);
      }
      if (this.statusSelected === "Paid") {
        return invoices.filter((invoice) => invoice.invoicePaid);
      }
    },

    filteredMonth(invoices) {
      if (this.monthSelected === "All") {
        return invoices;
      }
      if (this.monthSelected === "Jan") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "1"
        );
      }
      if (this.monthSelected === "Feb") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "2"
        );
      }
      if (this.monthSelected === "Mar") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "3"
        );
      }
      if (this.monthSelected === "Apr") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "4"
        );
      }
      if (this.monthSelected === "May") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "5"
        );
      }
      if (this.monthSelected === "Jun") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "6"
        );
      }
      if (this.monthSelected === "Jun") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "6"
        );
      }
      if (this.monthSelected === "Jul") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "7"
        );
      }
      if (this.monthSelected === "Aug") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "8"
        );
      }
      if (this.monthSelected === "Sep") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "9"
        );
      }
      if (this.monthSelected === "Oct") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "10"
        );
      }
      if (this.monthSelected === "Nov") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "11"
        );
      }
      if (this.monthSelected === "Dec") {
        return invoices.filter(
          (invoice) =>
            moment(invoice.invoiceDate, "DD/MM/YYYY").format("M") === "12"
        );
      }
    },

    clearFilter() {
      this.statusSelected = "All";
      this.monthSelected = "All";
    },

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

    toggleDropdown(invoice) {
      invoice.isActive = !invoice.isActive;
      console.log(invoice.isActive);
    },
  },
};
</script>

<style lang="scss">
$--e-swdx-p: 0 2px 4px rgba(0, 0, 0, 0.18);
$--f-k-smk-x: #222222;
$--f-mkcy-f: #ffffff;

.btn-dot {
  position: relative !important;
}

.bar-left {
  padding: 1rem;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #f4f3ef;
}
.bar-right {
  padding: 0.7rem 0.6rem;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

/* Search */

.search {
  background-color: #fff;
  width: 100%;

  .search-icon {
    margin: 0 8px 0 12px;
  }

  .search-input {
    outline: none;
    border: none;
    width: 100%;
    font-size: 16px;
  }

  label {
    width: 100%;
  }
}

/* Filter */
.filter {
  .form-select {
    font-size: 0.8rem;
    width: 120px;
    border-radius: 12px;
  }

  .form-select:focus {
    border-color: #50c0b1;
    box-shadow: 0 0 0 0.2rem rgb(80 192 177 / 25%);
  }

  .btn-clear {
    color: #50c0b1 !important;
    width: 75px;
    display: none;
  }

  .btn-clear:hover {
    color: #49ab9e !important;
  }
}

/* Table */
.invoices-table {
  width: 100%;

  thead {
    display: none;
  }

  tr {
    background-color: #fff;
    margin-bottom: 0.8rem;
    display: flex;
    flex-wrap: wrap;
    padding: 0.8rem;
  }

  th {
    /* head */
    padding: 0.7rem 1rem 0.3rem;
    font-weight: 500;
    color: #000;
  }

  .inv-id {
    order: 1;
    flex: 0 0 25%;
  }

  .client-name {
    order: 2;
    flex: 0 0 44%;
  }

  .price {
    order: 3;
    flex: 0 0 30%;
    text-align: right;
  }

  .inv-date {
    order: 4;
    flex: 0 0 70%;
    font-size: 0.8rem;
  }

  .inv-date,
  .status {
    margin-top: 3px;
  }

  .status {
    order: 5;
    flex: 0 0 30%;

    .invoice-status {
      justify-content: flex-end;

      span {
        display: flex;
      }
    }
  }

  .icon-button {
    background-color: #eceff5;
    color: #8589a9;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    margin: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-button:hover {
    background-color: #d9dbe0;
  }

  .btn-delete:hover {
    background-color: #d84548;
    color: white;
  }
}

/* Status */
.invoice-status {
  font-family: "Quicksand";
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  align-items: center;
}

.draft {
  color: #919191;
}

.pending {
  color: #e36300;
}

.paid {
  color: #1eb58b;
}

@media (min-width: 400px) {
  .filter {
    .btn-clear {
      display: block;
    }
  }
}

@media (min-width: 576px) {
  .bar-left {
    border-bottom: 2px solid #f4f3ef;
  }

  .bar-right {
    padding: 0.6rem 1rem;
  }

  .invoices-table {
    tr {
      padding: 0.8rem 2rem;
    }
  }

  .invoice-status {
    font-size: 12px;
  }
}

@media (max-width: 767px) {
  .invoices-table {
    tr {
      height: 90px;
      border-radius: 10px;
    }
  }

  .inv-id {
    text-transform: uppercase;
  }

  .inv-id,
  .client-name,
  .price {
    font-weight: 500;
    font-size: 16px;
    align-items: flex-end;
    height: 50%;
  }

  .inv-date,
  .status {
    height: 50%;
  }
}

@media (min-width: 768px) {
  .invoices-table {
    display: table;

    thead {
      display: table-header-group;
    }

    tr {
      display: table-row;
      padding: 0;
    }

    th {
      display: table-cell;
    }

    td {
      display: table-cell;
      width: auto;
      padding: 0.7rem 1rem;
      font-size: 14px !important;
    }

    .inv-id {
      font-size: 1rem;
    }

    .status {
      .invoice-status {
        justify-content: start;
      }
    }
  }

  .invoice-status {
    font-size: 11px;
  }
}

@media (min-width: 992px) {
  .bar-left {
    border-top-right-radius: 0px;
    border-bottom-left-radius: 10px;
    border-bottom: none;
  }
  .bar-right {
    padding: 1rem;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 10px;
  }
  .search {
    border-right: 2px solid #f4f3ef;
  }
}

////

._1h75pd34:hover {
  box-shadow: $--e-swdx-p !important;
}
._1h75pd34 {
  -webkit-box-align: center !important;
  -ms-flex-align: center !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  background: transparent !important;
  border: 1px solid #dddddd !important;
  color: $--f-k-smk-x !important;
  cursor: pointer !important;
  display: -webkit-inline-box !important;
  display: -moz-inline-box !important;
  display: -ms-inline-flexbox !important;
  display: -webkit-inline-flex !important;
  display: inline-flex !important;
  font-family: inherit !important;
  font-size: inherit !important;
  font-weight: inherit !important;
  line-height: inherit !important;
  margin: 0 !important;
  outline: none !important;
  overflow: visible !important;
  padding: 5px 5px 5px 12px !important;
  text-align: inherit !important;
  text-decoration: none !important;
  -webkit-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  user-select: auto !important;
  -webkit-align-items: center !important;
  align-items: center !important;
  background-color: $--f-mkcy-f !important;
  border-radius: 21px !important;
  height: 42px !important;
  position: relative !important;
  vertical-align: middle !important;
  -webkit-transition: box-shadow 0.2s ease !important;
  -moz-transition: box-shadow 0.2s ease !important;
  transition: box-shadow 0.2s ease !important;
  z-index: 1 !important;
}
._1h75pd34::-moz-focus-inner {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
._1h75pd34:focus::-moz-focus-inner {
  border: none !important;
}
._1h75pd34:-moz-focusring {
  outline: none !important;
}
@media (prefers-reduced-motion: reduce) {
  ._1h75pd34 {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    transition: none !important;
  }
}
._1h75pd34:focus-visible {
  -webkit-transition: box-shadow 0.2s ease !important;
  -moz-transition: box-shadow 0.2s ease !important;
  transition: box-shadow 0.2s ease !important;
  box-shadow: 0 0 0 2px $--f-k-smk-x, 0 0 0 4px $--f-mkcy-f !important;
}
@media (prefers-reduced-motion: reduce) {
  ._1h75pd34:focus-visible {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    transition: none !important;
  }
}
._1h75pd34:focus[data-focus-visible-added] {
  -webkit-transition: box-shadow 0.2s ease !important;
  -moz-transition: box-shadow 0.2s ease !important;
  transition: box-shadow 0.2s ease !important;
  box-shadow: 0 0 0 2px $--f-k-smk-x, 0 0 0 4px $--f-mkcy-f !important;
}
@media (prefers-reduced-motion: reduce) {
  ._1h75pd34:focus[data-focus-visible-added] {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    transition: none !important;
  }
}
._1h75pd34:hover {
  box-shadow: $--e-swdx-p !important;
}
._167wsvl {
  display: inline !important;
  position: relative !important;
}
._1xp7o8n {
  color: #717171 !important;
  -webkit-flex: 0 0 30px !important;
  -ms-flex: 0 0 30px !important;
  flex: 0 0 30px !important;
  height: 30px !important;
  margin-left: 12px !important;
  overflow: hidden !important;
  position: relative !important;
  width: 30px !important;
  z-index: 1 !important;
}
._10flxfyq {
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  border: 0;
  color: #222222 !important;
  cursor: pointer;
  display: -webkit-box !important;
  display: -moz-box !important;
  display: -ms-flexbox !important;
  display: -webkit-flex !important;
  display: flex;
  font-family: inherit;
  font-size: 14px;
  line-height: 18px;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 9px 16px;
  text-align: inherit !important;
  text-decoration: none !important;
  -webkit-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  user-select: auto !important;
  white-space: nowrap;
  width: 100%;
  -webkit-align-items: center;
  align-items: center;
}
._10flxfyq::-moz-focus-inner {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
._10flxfyq:focus::-moz-focus-inner {
  border: none !important;
}
._10flxfyq:-moz-focusring {
  outline: none !important;
}
._10flxfyq:hover:not(:active) {
  background-color: #f7f7f7 !important;
}
._10flxfyq:focus-visible {
  -webkit-transition: box-shadow 0.2s ease !important;
  -moz-transition: box-shadow 0.2s ease !important;
  transition: box-shadow 0.2s ease !important;
  box-shadow: inset 0 0 0 2px #222222 !important;
}
@media (prefers-reduced-motion: reduce) {
  ._10flxfyq:focus-visible {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    transition: none !important;
  }
}
._10flxfyq:focus[data-focus-visible-added] {
  -webkit-transition: box-shadow 0.2s ease !important;
  -moz-transition: box-shadow 0.2s ease !important;
  transition: box-shadow 0.2s ease !important;
  box-shadow: inset 0 0 0 2px #222222 !important;
}
@media (prefers-reduced-motion: reduce) {
  ._10flxfyq:focus[data-focus-visible-added] {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    transition: none !important;
  }
}
._ojs7nk {
  -webkit-flex: 1 0 auto !important;
  -ms-flex: 1 0 auto !important;
  flex: 1 0 auto !important;
}

.dot-dropdown {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  color: #222222 !important;
  padding: 8px 0;
  position: absolute;
  max-height: -webkit-calc(100vh - 100px) !important;
  max-height: -moz-calc(100vh - 100px) !important;
  max-height: calc(100vh - 100px) !important;
  overflow-y: auto !important;
  z-index: 2 !important;
  min-width: 95px;
}
</style>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">default header</slot>
            <button
              class="modal-default-button btn-close"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>

          <form @submit.prevent="submitForm" class="needs-validation">
            <div class="modal-body">
              <div class="bill-to mt-2">
                <h5>Bill to</h5>
                <div class="row">
                  <div class="col-md-5">
                    <label for="clientName" class="form-label"
                      >Client name</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="clientName"
                      v-model="clientName"
                      required
                    />
                  </div>
                  <div class="col-md-7">
                    <label for="clientAddress" class="form-label"
                      >Address</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="clientAddress"
                      v-model="clientAddress"
                      required
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    <label for="clientCity" class="form-label">City</label>
                    <input
                      type="text"
                      class="form-control"
                      id="clientCity"
                      v-model="clientCity"
                      required
                    />
                  </div>
                  <div class="col-sm-3">
                    <label for="clientState" class="form-label">State</label>
                    <select
                      class="form-select"
                      id="clientState"
                      v-model="clientState"
                      required
                    >
                      <option selected disabled value="">Choose...</option>
                      <option value="ACT">ACT</option>
                      <option value="NSW">NSW</option>
                      <option value="VIC">VIC</option>
                      <option value="QLD">QLD</option>
                      <option value="SA">SA</option>
                      <option value="WA">WA</option>
                      <option value="TAS">TAS</option>
                      <option value="NT">NT</option>
                    </select>
                  </div>
                  <div class="col-sm-3">
                    <label for="clientPostCode" class="form-label"
                      >Postcode</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="clientPostCode"
                      v-model="clientPostCode"
                      required
                    />
                  </div>
                </div>

                <!-- Payment -->
                <div class="row">
                  <div class="col-sm-4">
                    <label for="invoiceDate" class="form-label"
                      >Invoice Date</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="invoiceDate"
                      v-model="invoiceDate"
                      required
                    />
                  </div>
                  <div class="col-sm-4">
                    <label for="paymentTerms" class="form-label">Terms</label>
                    <select
                      class="form-select"
                      id="paymentTerms"
                      v-model="paymentTerms"
                      required
                    >
                      <option value="30" default>Net 30 days</option>
                      <option value="60">Net 60 days</option>
                    </select>
                  </div>
                  <div class="col-sm-4">
                    <label for="dueDate" class="form-label">Due date</label>
                    <input
                      disabled
                      type="text"
                      class="form-control"
                      id="dueDate"
                      v-model="formattedDueDate"
                    />
                  </div>
                </div>
              </div>

              <div class="invoice-items mt-4">
                <h5>Item list</h5>
                <table class="table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Item &amp; Description</th>
                      <th scope="col" class="text-center">Qty</th>
                      <th scope="col" class="text-center">Unit price</th>
                      <th scope="col" class="text-end">Amount</th>
                      <th scope="col" style="width: 10%"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in invoiceItemList" :key="index">
                      <td class="item-name">
                        <input
                          class="form-control"
                          v-model="item.itemName"
                          required
                        />
                      </td>
                      <td class="item-qty">
                        <input
                          class="form-control"
                          type="number"
                          min="0"
                          v-model="item.qty"
                          required
                        />
                      </td>
                      <td class="item-unit-price">
                        <input
                          class="form-control text-end"
                          type="number"
                          min="0"
                          step=".01"
                          v-model="item.price"
                          required
                        />
                      </td>
                      <td class="item-amount text-end">
                        ${{ item.itemTotal }}
                      </td>
                      <td class="item-del-icon">
                        <font-awesome-icon
                          class="btn-delete-item"
                          icon="xmark"
                          color="red"
                          @click="deleteInvoiceItem(item.id)"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <p
                    v-if="!itemIsEnter"
                    class="d-inline-flex alert alert-danger item-enter-alert"
                  >
                    <font-awesome-icon icon="circle-exclamation" class="pe-1" />
                    Please enter invoice item
                  </p>
                </div>
                <div class="d-flex">
                  <button
                    type="button"
                    class="btn-add-item"
                    @click="addInvoiceItem"
                  >
                    <font-awesome-icon icon="plus" /> Add item
                  </button>
                  <div class="ms-auto total">
                    Total: ${{ this.totalAmount }}
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-default btn-clear me-auto" @click="clearForm">
                Clear
              </button>
              <div class="modal-footer-right">
                <button
                  v-if="!editInvoice"
                  type="submit"
                  @click="draft"
                  class="btn-default btn-draft me-2"
                >
                  <span v-if="!loadingDraft">Save Draft</span>
                  <div
                    v-if="loadingDraft"
                    class="spinner-border spinner-border-sm"
                    role="status"
                  ></div>
                </button>
                <button
                  v-if="!editInvoice"
                  type="submit"
                  class="btn-default btn-green"
                  @click="pending"
                >
                  Publish
                  <font-awesome-icon
                    v-if="!loading"
                    :icon="['far', 'paper-plane']"
                  />
                  <div
                    v-if="loading"
                    class="spinner-border spinner-border-sm text-light"
                    role="status"
                  ></div>
                </button>
                <button
                  v-if="editInvoice"
                  type="submit"
                  class="btn-default btn-green"
                >
                  Update
                  <div
                    v-if="loading"
                    class="spinner-border spinner-border-sm text-light"
                    role="status"
                  ></div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import moment from "moment-timezone";
import db from "../firebase/firebase";
import { collection, doc, addDoc, updateDoc } from "firebase/firestore";
import { uid } from "uid";
import { mapState, mapActions } from "vuex";

export default {
  props: {
    show: Boolean,
  },

  data() {
    return {
      showModal: false,
      loading: null,
      loadingDraft: null,
      itemIsEnter: false,
      docId: null,
      clientName: null,
      clientAddress: null,
      clientCity: null,
      clientState: null,
      clientPostCode: null,
      invoiceDate: null,
      dueDate: null,
      formattedInvoiceDate: null,
      formattedDueDate: null,
      paymentTerms: 30,
      invoiceItemList: [],
      invoiceTotalAmount: 0,
      invoiceDraft: null,
      invoicePending: null,
      invoicePaid: null,
    };
  },
  methods: {
    ...mapActions(["GET_INVOICES", "UPDATE_INVOICE"]),

    addInvoiceItem() {
      const item = this.invoiceItemList[this.invoiceItemList.length - 1];

      if (this.invoiceItemList.length <= 0) {
        this.invoiceItemList.push({
          id: uid(4),
          itemName: "",
          qty: null,
          price: null,
          itemTotal: null,
        });
      } else if (
        item.itemName == "" ||
        item.qty == null ||
        item.price == null
      ) {
        this.itemIsEnter = false;
      } else {
        this.invoiceItemList.push({
          id: uid(4),
          itemName: "",
          qty: null,
          price: null,
          itemTotal: null,
        });
        this.itemIsEnter = true;
      }
    },

    draft() {
      if (
        this.invoiceItemList[this.invoiceItemList.length - 1].itemName ==
          null ||
        this.invoiceItemList[this.invoiceItemList.length - 1].qty == null ||
        this.invoiceItemList[this.invoiceItemList.length - 1].price == null
      ) {
        return;
      } else if (this.itemIsEnter) {
        this.invoiceDraft = true;
        this.invoicePending = null;
      }
    },

    pending() {
      if (
        this.invoiceItemList[this.invoiceItemList.length - 1].itemName ==
          null ||
        this.invoiceItemList[this.invoiceItemList.length - 1].qty == null ||
        this.invoiceItemList[this.invoiceItemList.length - 1].price == null
      ) {
        return;
      } else if (this.itemIsEnter) {
        this.invoicePending = true;
        this.invoiceDraft = null;
      }
    },

    deleteInvoiceItem(id) {
      this.invoiceItemList = this.invoiceItemList.filter(
        (item) => item.id !== id
      );
    },

    async uploadToDatabase() {
      if (this.invoiceItemList.length <= 0) {
        this.itemIsEnter = false;
        return;
      }

      //Loading
      if (this.invoiceDraft) {
        this.loadingDraft = true;
      } else if (this.invoicePending) {
        this.loading = true;
      }

      this.itemIsEnter = true;

      await addDoc(collection(db, "invoices"), {
        invoiceId: uid(6),
        clientName: this.clientName,
        clientAddress: this.clientAddress,
        clientCity: this.clientCity,
        clientState: this.clientState,
        clientPostCode: this.clientPostCode,
        invoiceDate: this.formattedInvoiceDate,
        paymentTerms: this.paymentTerms,
        dueDate: this.formattedDueDate,
        invoiceItemList: this.invoiceItemList,
        invoiceTotalAmount: this.invoiceTotalAmount,
        invoiceDraft: this.invoiceDraft,
        invoicePending: this.invoicePending,
        invoicePaid: null,
      });
      this.loading = false;
      this.loadingDraft = false;
      this.clearForm();
      this.GET_INVOICES();
      this.$emit("close");
    },
    async updateInvoice() {
      if (this.invoiceItemList.length <= 0) {
        this.itemIsEnter = false;
        return;
      }

      this.itemIsEnter = true;
      this.loading = true;

      const docRef = doc(db, "invoices", this.docId);
      await updateDoc(docRef, {
        clientName: this.clientName,
        clientAddress: this.clientAddress,
        clientCity: this.clientCity,
        clientState: this.clientState,
        clientPostCode: this.clientPostCode,
        invoiceDate: this.formattedInvoiceDate,
        paymentTerms: this.paymentTerms,
        dueDate: this.formattedDueDate,
        invoiceItemList: this.invoiceItemList,
        invoiceTotalAmount: this.invoiceTotalAmount,
        invoiceDraft: this.invoiceDraft,
        invoicePending: this.invoicePending,
        invoicePaid: this.invoicePaid,
      });
      this.loading = false;

      const data = {
        docId: this.docId,
        routeId: this.$route.params.invoiceId,
      };

      this.UPDATE_INVOICE(data);
      this.GET_INVOICES();
      this.$emit("close");
    },
    submitForm() {
      if (this.editInvoice) {
        this.updateInvoice();
      } else {
        this.uploadToDatabase();
      }
    },
    closeModal() {
      this.clearForm();

      if (this.editInvoice) {
        this.$store.commit("SET_EDIT_INVOICE", false);
        this.$emit("close");
      }
      this.$emit("close");
    },
    clearForm() {
      this.docId = null;
      this.clientName = null;
      this.clientAddress = null;
      this.clientCity = null;
      this.clientState = null;
      this.clientPostCode = null;
      this.invoiceDate = null;
      this.paymentTerms = null;
      this.formattedDueDate = null;
      this.invoiceItemList = [];
      this.invoiceTotalAmount = null;
      this.invoiceDraft = null;
      this.invoicePending = null;
      this.invoicePaid = null;
    },
  },
  watch: {
    invoiceDate() {
      let date = new Date(this.invoiceDate);
      date.setDate(date.getDate() + parseInt(this.paymentTerms));

      this.dueDate = new Date(date);
      this.formattedDueDate = moment(this.dueDate).format("DD/MM/YYYY");
      this.formattedInvoiceDate = moment(this.invoiceDate).format("DD/MM/YYYY");
    },
    paymentTerms() {
      let date = new Date(this.invoiceDate);
      date.setDate(date.getDate() + parseInt(this.paymentTerms));

      this.dueDate = new Date(date);
      this.formattedDueDate = moment(this.dueDate).format("DD/MM/YYYY");
    },
    editInvoice() {
      if (this.editInvoice) {
        const cInvoice = this.currentInvoice[0];

        this.docId = cInvoice.docId;
        this.clientName = cInvoice.clientName;
        this.clientAddress = cInvoice.clientAddress;
        this.clientCity = cInvoice.clientCity;
        this.clientState = cInvoice.clientState;
        this.clientPostCode = cInvoice.clientPostCode;
        this.invoiceDate = moment(cInvoice.invoiceDate, "DD/MM/YYYY").format(
          "yyyy-MM-DD"
        );
        this.paymentTerms = cInvoice.paymentTerms;
        this.formattedDueDate = cInvoice.dueDate;
        this.invoiceItemList = cInvoice.invoiceItemList;
        this.invoiceTotalAmount = cInvoice.invoiceTotalAmount;
        this.invoiceDraft = cInvoice.invoiceDraft;
        this.invoicePending = cInvoice.invoicePending;
        this.invoicePaid = cInvoice.invoicePaid;
      } else {
        this.docId = "";
        this.clientName = "";
        this.clientAddress = "";
        this.clientCity = "";
        this.clientState = "";
        this.clientPostCode = "";
        this.invoiceDate = "";
        this.paymentTerms = "";
        this.formattedDueDate = "";
        this.invoiceItemList = [];
        this.invoiceTotalAmount = "";
        this.invoiceDraft = "";
        this.invoicePending = "";
        this.invoicePaid = "";
      }
    },
    invoiceItemList() {
      if (this.invoiceItemList > 0) {
        this.itemIsEnter = true;
      } else if (this.invoiceItemList <= 0) {
        this.itemIsEnter = false;
      }
    },
  },

  computed: {
    ...mapState(["editInvoice", "currentInvoice", "editInvoice"]),

    totalAmount() {
      let sum = 0;
      this.invoiceItemList.forEach((item) => {
        item.itemTotal = parseFloat((item.price * item.qty).toFixed(2));

        sum += item.itemTotal;
      });
      this.invoiceTotalAmount = sum;
      return sum;
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;200;300;400;500;600;700;800&display=swap");
$hover-gray: #ebebeb;

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: block;
  height: 100%;
  overflow-y: auto;
}

.modal-container {
  font-family: "Work Sans", sans-serif;
  width: 100%;
  padding: 0px 10px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;

  .btn-default {
    font-family: "Work Sans", sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    border: none;
    border-radius: 12px;
    height: 42px;
    min-width: 75px;
    letter-spacing: 0.4px;
  }

  .btn-green {
    background-color: #50c0b1;
  }

  .btn-green:hover {
    background-color: #49ab9e;
  }

  .btn-add-item {
    color: #d81e5b;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    padding: 0.5rem 0.75rem;
    background-color: transparent;
    border: none;
    border-radius: 12px;
  }

  .btn-clear {
    background-color: transparent;
    color: #6c757d;
    min-width: 0 !important;
  }

  .btn-clear:hover {
    color: #000;
  }

  .btn-draft {
    border: 1px solid #ced4d9;
    background-color: #efefef;
    color: #979797;
  }

  .btn-draft:hover {
    background-color: $hover-gray;
  }

  .btn-delete-item {
    cursor: pointer;
  }

  .btn-delete-item:hover {
    color: black;
  }

  .btn-check:focus + .btn,
  .btn:focus {
    box-shadow: none;
  }
}

.modal-header h3 {
  margin-top: 0;
}

.modal-header {
  padding: 1.5rem 1rem !important;
}

.modal-body {
  padding: 0.5rem !important;
  margin: 0;

  input,
  select {
    padding: 10px 16px;
    margin-bottom: 16px;
    font-size: 14px;
    border-radius: 12px;
  }

  .bill-to {
    label {
      color: gray;
      margin-bottom: 0.2rem;
    }
  }

  .form-control:focus {
    border-color: #50c0b1;
    box-shadow: 0 0 0 0.2rem rgb(80 192 177 / 25%);
  }

  .form-select:focus {
    border-color: #50c0b1;
    box-shadow: 0 0 0 0.2rem rgb(80 192 177 / 25%);
  }

  /* input type number without arrow */
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
}

.modal-footer {
  padding: 0.75rem 0 !important;

  .modal-footer-right {
    button {
      width: 110px;
    }
  }
}

.modal-default-button {
  float: right;
}

.invoice-items {
  .table {
    font-size: 12px;
    color: gray;
    margin-bottom: 0rem;

    td,
    th {
      padding-top: 0.5rem;
      padding-right: 0.5rem;
      padding-bottom: 0.5rem;
      padding-left: 0;
    }

    th {
      font-weight: 400;
    }

    input {
      margin-bottom: 0;
      padding: 8px 8px;
    }

    .item-name {
      width: 40%;
    }
    .item-qty {
      width: 18%;
    }
    .item-unit-price {
      width: 18%;
    }
    .item-amount {
      width: 20%;
      font-size: 14px;
    }
    .item-del-icon {
      width: 3%;
      text-align: right;
    }
  }

  .total {
    margin-right: 2rem;
    font-weight: 500;
    color: rgb(83, 83, 83);
  }

  .alert {
    padding: 0.5rem 1rem;
  }
}

/* Modal transition */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.item-enter-alert {
  font-size: 13px;
  padding: 0.3rem 0.5rem;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
}

@media (min-width: 576px) {
  .modal-container {
    width: 576px;
    padding: 0px 20px;
    margin: 85px auto;
    border-radius: 12px;
  }

  .modal-body {
    padding: 1rem;

    input,
    select {
      font-size: 14px;
      padding: 8px 16px;
    }
  }

  .invoice-items {
    .table {
      font-size: 14px;

      td,
      th {
        padding-right: 1rem;
      }

      input {
        padding: 10px 12px;
      }

      .item-name {
        width: 35%;
      }
      .item-qty {
        width: 15%;
      }
      .item-unit-price {
        width: 15%;
      }
      .item-amount {
        width: 20%;
      }
      .item-del-icon {
        width: 10%;
      }
    }

    .total {
      margin-right: 4rem;
    }
  }

  .modal-footer {
    padding: 0.75rem !important;
  }
}

@media (min-width: 600px) {
  .modal-container {
    width: 600px;
  }

  .modal-body {
    input,
    select {
      margin-bottom: 10px;
    }
  }
}
</style>

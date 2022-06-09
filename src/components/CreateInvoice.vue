<template>
  <div class="d-flex ms-auto">
    <!-- Button trigger modal -->
    <button
      id="show-modal"
      @click="newInvoice"
      class="btn btn-default btn-green btn-create-invoice"
    >
      <font-awesome-icon icon="plus" /> New invoice
    </button>

    <!-- use the modal component, pass in the prop -->
    <Teleport to="body">
      <modal :show="showModal" @close="showModal = false">
        <template #header>
          <h5 class="mb-0">Create new invoice</h5>
        </template>
      </modal>
    </Teleport>
  </div>
</template>

<script>
import Modal from "./Modal.vue";

export default {
  name: "CreateInvoice",
  components: {
    Modal,
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    newInvoice() {
      this.$store.commit("SET_EDIT_INVOICE", false);
      this.showModal = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-create-invoice {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.23);
  padding-left: 1.2rem;
  padding-right: 1.2rem;
  height: 45px !important;
}

.btn-create-invoice:hover {
  box-shadow: 0px 0px 17px #49ab9e;
}

@media (max-width: 575px) {
  .btn-create-invoice {
    position: absolute;
    top: 20px;
    right: 23px;
  }
}
</style>

<template>
  <div class="content-box company row mb-3">
    <div class="col-12 col-md-5 col-lg-4">
      <div class="logo-img mx-auto mb-3" @click="browseLogo">
        <div v-if="isLogoLoaded">
          <img
            v-if="!loadingLogo"
            id="frame"
            :src="logoImg"
            class="img-fluid"
          />
          <div v-if="loadingLogo" class="spinner-border" role="status"></div>
        </div>
      </div>
      <input
        type="file"
        ref="file"
        accept="image/jpeg/*"
        name="vue-file-input"
        @change="uploadLogo"
        hidden
      />
      <div class="btn-group-logo d-flex justify-content-center">
        <button
          id="show-modal"
          type="button"
          class="btn btn-default btn-green"
          @click="browseLogo"
        >
          Change
        </button>
        <button
          v-if="isLogoLoaded"
          type="button"
          class="btn btn-default btn-cancel ms-2"
          data-bs-toggle="modal"
          data-bs-target="#deleteModal"
        >
          Remove
        </button>
      </div>

      <!-- Delete modal -->
      <div
        class="modal modal-fade fade"
        id="deleteModal"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content modal-delete-logo">
            <h6 class="text-center mb-3">Are you sure?</h6>
            <div class="d-flex">
              <button
                class="btn btn-default btn-red"
                data-bs-dismiss="modal"
                @click="removeLogo"
              >
                Remove
              </button>
              <button
                class="btn btn-default btn-cancel ms-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Company data -->
    <div class="col-12 col-md-7 col-lg-8 company-data">
      <div v-if="isDataLoaded"></div>
      <form class="g-3" @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="inputName" class="form-label">Company name</label>
          <input
            type="text"
            id="inputName"
            v-model="company.name"
            class="form-control"
            :disabled="!isEditing"
          />
        </div>
        <div class="row">
          <div class="col-12 col-sm-6 col-md-12 col-lg-6 mb-3">
            <label for="inputEmail" class="form-label">Email</label>
            <input
              type="email"
              id="inputEmail"
              v-model="company.email"
              class="form-control"
              :disabled="!isEditing"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-12 col-lg-6 mb-3">
            <label for="inputPhone" class="form-label">Contact number</label>
            <input
              type="text"
              id="inputPhone"
              v-model="company.phone"
              class="form-control"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="mb-3">
          <label for="inputStreet" class="form-label">Street Address</label>
          <input
            type="text"
            id="inputStreet"
            v-model="company.address"
            class="form-control"
            :disabled="!isEditing"
          />
        </div>

        <div class="mb-3">
          <label for="inputCity" class="form-label">City</label>
          <input
            type="text"
            id="inputCity"
            v-model="company.city"
            class="form-control"
            :disabled="!isEditing"
          />
        </div>

        <div class="row">
          <div class="col-12 col-sm-6 mb-3">
            <label for="inputState" class="form-label">State</label>
            <select
              id="inputState"
              v-model="company.state"
              :class="!isEditing ? 'view form-control' : 'form-select'"
              :disabled="!isEditing"
            >
              <option selected disabled value="">Choose...</option>
              <option value="Australian Capital Territory">
                Australian Capital Territory
              </option>
              <option value="New South Wales">New South Wales</option>
              <option value="Victoria">Victoria</option>
              <option value="Queensland">Queensland</option>
              <option value="South Australia">South Australia</option>
              <option value="Western Australia">Western Australia</option>
              <option value="Tasmania">Tasmania</option>
              <option value="Northern Territory">Northern Territory</option>
            </select>
          </div>
          <div class="col-12 col-sm-6 mb-3">
            <label for="inputPostcode" class="form-label">Postcode</label>
            <input
              type="text"
              id="inputPostcode"
              v-model="company.postcode"
              class="form-control"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <button
          @click="isEditing = !isEditing"
          v-if="!isEditing"
          type="button"
          class="btn btn-default btn-red"
        >
          <font-awesome-icon icon="pen-to-square" />
          Edit
        </button>
        <button
          v-else-if="isEditing"
          class="btn btn-default btn-green"
          type="submit"
        >
          <span v-if="!loading">Update</span>
          <div
            v-else
            class="spinner-border spinner-border-sm text-light"
            role="status"
          ></div>
        </button>
        <button
          v-if="isEditing"
          @click="cancel"
          type="button"
          class="btn btn-default btn-cancel ms-2"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import db from "../firebase/firebase";
import { mapState, mapActions, mapMutations } from "vuex";
import { ref, getStorage, uploadBytes, deleteObject } from "firebase/storage";
import { collection, doc, addDoc, updateDoc } from "firebase/firestore";

export default {
  name: "Company",
  data() {
    return {
      isExist: false,
      isEditing: false,
      loading: null,
      loadingLogo: null,
      company: {
        docId: null,
        name: null,
        phone: null,
        email: null,
        address: null,
        city: null,
        state: null,
        postcode: null,
      },
    };
  },
  computed: {
    ...mapState(["companyInfo", "companyId", "logoImg"]),

    isDataLoaded() {
      const dataLoaded = this.companyInfo;

      if (dataLoaded === null) {
        this.isExist = false;
        this.isEditing = true;
      } else {
        this.company.name = dataLoaded.companyName;
        this.company.phone = dataLoaded.companyPhone;
        this.company.email = dataLoaded.companyEmail;
        this.company.address = dataLoaded.companyAddress;
        this.company.city = dataLoaded.companyCity;
        this.company.state = dataLoaded.companyState;
        this.company.postcode = dataLoaded.companyPostCode;
        this.isEditing = false;
        this.isExist = true;
      }
      return dataLoaded;
    },

    isLogoLoaded() {
      return this.logoImg;
    },
  },
  methods: {
    ...mapActions(["GET_COMPANY_INFO"]),
    ...mapMutations(["GET_LOGO"]),

    async uploadCompanyInfo() {
      console.log("add company");
      this.loading = true;
      await addDoc(collection(db, "company"), {
        companyName: this.company.name,
        companyPhone: this.company.phone,
        companyEmail: this.company.email,
        companyAddress: this.company.address,
        companyCity: this.company.city,
        companyState: this.company.state,
        companyPostCode: this.company.postcode,
      });
      this.isEditing = false;
      this.loading = false;
      this.GET_COMPANY_INFO();
    },
    async updateCompanyInfo() {
      console.log("update company");
      const docRef = doc(db, "company", this.companyId);
      this.loading = true;
      await updateDoc(docRef, {
        companyName: this.company.name,
        companyPhone: this.company.phone,
        companyEmail: this.company.email,
        companyAddress: this.company.address,
        companyCity: this.company.city,
        companyState: this.company.state,
        companyPostCode: this.company.postcode,
      });
      this.isEditing = false;
      this.loading = false;
      this.GET_COMPANY_INFO();
    },
    cancel() {
      this.isEditing = false;
      this.GET_COMPANY_INFO();
    },
    submitForm() {
      if (this.isExist) {
        this.updateCompanyInfo();
      } else {
        this.uploadCompanyInfo();
      }
    },
    browseLogo(e) {
      e.preventDefault();
      this.$refs.file.click();
    },
    async uploadLogo() {
      // Convert to base64
      const file = document.querySelector("input[type=file]").files[0];

      if (file) {
        let loadedLogo = null;
        this.loadingLogo = true;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        // Upload to firebase storage
        const storage = getStorage();
        const storageRef = ref(storage, "logo");
        loadedLogo = await uploadBytes(storageRef, file);
        this.GET_LOGO();

        if (loadedLogo) {
          this.loadingLogo = false;
        }
      }
    },
    removeLogo() {
      const storage = getStorage();
      const logoRef = ref(storage, "logo");

      // Delete the file
      deleteObject(logoRef)
        .then(() => {
          this.GET_LOGO();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  async mounted() {
    const company = await this.companyInfo;

    if (company) {
      this.company.name = company.companyName;
      this.company.phone = company.companyPhone;
      this.company.email = company.companyEmail;
      this.company.address = company.companyAddress;
      this.company.city = company.companyCity;
      this.company.state = company.companyState;
      this.company.postcode = company.companyPostCode;
      this.isExist = true;
    } else {
      this.isExist = false;
      this.isEditing = true;
    }
  },
  watch: {
    logoImg(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);
    },
  },
};
</script>

<style lang="scss">
.content-box {
  padding: 1rem;
  border-radius: 12px;
  margin-left: 0 !important;
  margin-right: 0 !important;
  background-color: white;
}

.modal-dialog {
  width: fit-content !important;
}

.modal-delete-logo {
  padding: 32px;
}

.modal-fade {
  transition: opacity 0.15s ease-out;
}

.modal-content {
  border: none;
}

.logo-img {
  background-color: white;
  border: 2px dashed #c7ccd2;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  max-width: 200px;
  height: 200px;

  img {
    width: auto;
    height: 200px;
    object-fit: contain;
  }
}

.btn-group-logo {
  button {
    width: 38%;
    max-width: 98px;
  }
}

.company {
  label {
    color: #878a8d;
    font-weight: 500;
    padding-left: 0.75rem;
    margin-bottom: 0.2rem;
  }

  .form-control {
    background-color: #e9ecef;
    border-radius: 12px;
  }

  .form-select {
    border-radius: 12px;
  }

  .form-control:disabled {
    background-color: transparent;
    border: 1px solid transparent;
  }

  .btn-cancel {
    color: #202529 !important;
    background-color: #ebebeb;
  }

  .btn-cancel:hover {
    background-color: #c7ccd2;
  }
}

@media (min-width: 480px) {
  .content-box {
    padding: 2rem;
  }

  .logo-img {
    background-color: transparent;
  }
}
@media (min-width: 768px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */
}
@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */
}
@media (min-width: 1281px) {
  /* hi-res laptops and desktops */
}

@media (max-width: 767px) {
  .company-data {
    padding-top: 2rem;
  }
}
</style>

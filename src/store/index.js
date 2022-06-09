import { createStore } from "vuex";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import db from "../firebase/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import moment from "moment-timezone";

export default createStore({
  state: {
    invoiceList: [],
    currentInvoice: null,
    editInvoice: false,
    companyInfo: null,
    companyId: null,
    logoImg: null,
  },
  mutations: {
    SET_INVOICE_LIST(state, payload) {
      state.invoiceList = payload;
      //console.log(state.invoiceList);
    },
    UPDATE_TO_PAID(state, payload) {
      state.invoiceList.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      });
    },
    UPDATE_TO_PENDING(state, payload) {
      state.invoiceList.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      });
    },
    DELETE_INVOICE(state, payload) {
      state.invoiceList = state.invoiceList.filter(
        (invoice) => invoice.docId !== payload
      );
    },
    GET_INVOICE_BY_ID(state, payload) {
      state.currentInvoice = state.invoiceList.filter(
        (invoice) => invoice.invoiceId === payload
      );
    },
    SET_COMPANY_INFO(state, payload) {
      state.companyInfo = payload;
    },
    SET_COMPANY_ID(state, id) {
      state.companyId = id;
    },
    SET_EDIT_INVOICE(state, value) {
      state.editInvoice = value;
    },
    GET_LOGO(state) {
      // Mounted logo image
      const storage = getStorage();
      getDownloadURL(ref(storage, "logo"))
        .then((url) => {
          state.logoImg = url;
        })
        .catch((error) => {
          console.log(error);
          state.logoImg = null;
        });
    },
  },
  actions: {
    async GET_INVOICES({ commit }) {
      const results = await getDocs(collection(db, "invoices"));
      const invoicesArray = [];
      results.forEach((doc) => {
        const data = {
          docId: doc.id,
          invoiceId: doc.data().invoiceId,
          clientName: doc.data().clientName,
          clientAddress: doc.data().clientAddress,
          clientCity: doc.data().clientCity,
          clientState: doc.data().clientState,
          clientPostCode: doc.data().clientPostCode,
          invoiceDate: doc.data().invoiceDate,
          paymentTerms: doc.data().paymentTerms,
          dueDate: doc.data().dueDate,
          invoiceItemList: doc.data().invoiceItemList,
          invoiceTotalAmount: doc.data().invoiceTotalAmount,
          invoiceDraft: doc.data().invoiceDraft,
          invoicePending: doc.data().invoicePending,
          invoicePaid: doc.data().invoicePaid,
        };

        invoicesArray.push(data);
      });
      commit("SET_INVOICE_LIST", invoicesArray);
    },

    async UPDATE_INVOICE({ commit, dispatch }, { routeId }) {
      await dispatch("GET_INVOICES");
      commit("GET_INVOICE_BY_ID", routeId);
      commit("SET_EDIT_INVOICE", false);
    },

    async UPDATE_TO_PAID({ commit }, docId) {
      const docRef = doc(db, "invoices", docId);
      const getInvoice = await getDoc(docRef);
      if (getInvoice.exists()) {
        await updateDoc(docRef, {
          invoicePaid: true,
          invoicePending: false,
        });
      } else {
        console.log("No document was found");
      }
      commit("UPDATE_TO_PAID", docId);
    },

    async UPDATE_TO_PENDING({ commit }, docId) {
      const docRef = doc(db, "invoices", docId);
      const getInvoice = await getDoc(docRef);
      if (getInvoice.exists()) {
        await updateDoc(docRef, {
          invoicePaid: false,
          invoicePending: true,
          invoiceDraft: false,
        });
      } else {
        console.log("No document was found");
      }
      commit("UPDATE_TO_PENDING", docId);
    },

    async DELETE_INVOICE({ commit }, docId) {
      if (confirm("Are you sure you want to delete this invoice?")) {
        await deleteDoc(doc(db, "invoices", docId));
        commit("DELETE_INVOICE", docId);
      }
    },

    async GET_COMPANY_INFO({ commit }) {
      const query = await getDocs(collection(db, "company"));

      if (query.size > 0) {
        const companyInfo = query.docs[0];
        commit("SET_COMPANY_INFO", companyInfo.data());
        commit("SET_COMPANY_ID", companyInfo.id);
      }
    },
  },
  getters: {
    sortedInvoices(state) {
      return state.invoiceList.sort((a, b) => {
        const dateA = moment(a.invoiceDate, "DD/MM/YYYY");
        const formattedDateA = new Date(dateA);
        const dateB = moment(b.invoiceDate, "DD/MM/YYYY");
        const formattedDateB = new Date(dateB);

        return formattedDateB - formattedDateA;
      });
    },
  },
});

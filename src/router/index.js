import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Invoices from "../views/InvoicesList.vue";
import InvoiceView from "../views/InvoiceView.vue";
import Company from "../views/Company.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/invoices",
    name: "Invoices",
    component: Invoices,
  },
  {
    path: "/invoices/:invoiceId",
    name: "Invoice Details",
    component: InvoiceView,
  },
  {
    path: "/company",
    name: "Company",
    component: Company,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBuilding,
  faFileLines,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAt,
  faAngleLeft,
  faArrowRightLong,
  faBars,
  faCircle,
  faCircleCheck,
  faCircleExclamation,
  faChartLine,
  faCheck,
  faClockRotateLeft,
  faDollarSign,
  faEllipsis,
  faFile,
  faFilter,
  faImage,
  faImages,
  faO,
  faPen,
  faPenToSquare,
  faPlus,
  faSearch,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faAt,
  faAngleLeft,
  faArrowRightLong,
  faBars,
  faBuilding,
  faCircle,
  faCircleCheck,
  faCircleExclamation,
  faChartLine,
  faCheck,
  faClockRotateLeft,
  faDollarSign,
  faEllipsis,
  faFile,
  faFilter,
  faImage,
  faImages,
  faO,
  faPen,
  faPenToSquare,
  faPlus,
  faSearch,
  faTrashCan,
  faXmark,
  faFileLines,
  faPaperPlane
);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .mount("#app");

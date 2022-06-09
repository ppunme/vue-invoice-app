<template>
  <div v-if="support" class="d-flex">
    <div class="sidebar d-none d-sm-block">
      <Sidebar />
    </div>
    <div class="main-panel">
      <Navbar />
      <div class="content"><router-view /></div>
    </div>
    <NavbarMobile />
  </div>

  <div v-else class="mobile-message flex flex-column">
    <h5>Sorry, this app is not supported on this screen size</h5>
    <p>To use this app, please use a larger screen size</p>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import NavbarMobile from "@/components/NavbarMobile.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  components: {
    Sidebar,
    Navbar,
    NavbarMobile,
  },
  data() {
    return {
      support: null,
    };
  },
  created() {
    this.GET_INVOICES();
    this.GET_LOGO();
    this.GET_COMPANY_INFO();
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  methods: {
    ...mapActions(["GET_INVOICES", "GET_COMPANY_INFO"]),
    ...mapMutations(["GET_LOGO"]),

    checkScreen() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 374) {
        this.support = false;

        return;
      }
      this.support = true;
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;200;300;400;500;600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap");

$primary-color-font: #4c4c4c;
$light-gray: #dddddd;

#app {
  font-family: "Work Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $primary-color-font;
  font-size: 14px;

  .btn-default {
    font-family: "Work Sans", sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    border: none;
    border-radius: 12px;
    height: 42px;
    min-width: 75px;
  }

  .btn-green {
    background-color: #50c0b1;
  }

  .btn-green:hover {
    background-color: #49ab9e;
  }

  .btn-red {
    background-color: #d34135;
  }

  .btn-red:hover {
    background-color: #b1362b;
  }

  .btn-back {
    text-decoration: none;
    color: #000;
  }

  .btn-back:hover {
    color: #494949;
  }

  .btn:focus {
    box-shadow: none;
  }

  .main-panel {
    background-color: #f4f3ef;
  }
}

label {
  font-size: 14px;
}

.content {
  padding: 0rem 1.5rem 5rem;
}

.sidebar {
  width: 78px;
}

.main-panel {
  width: 100%;
}

.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: #fff;
  padding: 2rem;

  p {
    margin-top: 16px;
  }
}

@media (min-width: 576px) {
  .content {
    padding: 1rem 1.5rem 5rem;
  }

  .main-panel {
    width: calc(100% - 78px);
  }
}

@media (min-width: 768px) {
  .content {
    padding: 1rem 3rem;
  }
}

@media (min-width: 992px) {
  /* smartphones, Android phones, landscape iPhone */
  .sidebar {
    padding-right: 0 !important;
    width: 20%;
  }

  .main-panel {
    width: 80%;
  }
}
</style>

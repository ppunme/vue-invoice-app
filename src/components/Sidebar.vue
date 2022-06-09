<template>
  <div class="sidebar-wrapper d-flex flex-column">
    <div class="logo d-flex align-items-center">
      <StarIcon class="star-icon" /><span
        class="ms-2 logo-text d-none d-lg-block"
        >invoices</span
      >
    </div>

    <ul class="navigation-bar">
      <li>
        <router-link to="/" class="nav-item d-flex">
          <font-awesome-icon icon="chart-line" />
          <span class="nav-item-text d-none d-lg-block">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/invoices" class="nav-item d-flex">
          <font-awesome-icon :icon="['far', 'file-lines']" />
          <span class="nav-item-text d-none d-lg-block">Invoices</span>
        </router-link>
      </li>
      <li>
        <router-link to="/company" class="nav-item d-flex">
          <BuildingIcon class="nav-icon" />
          <span class="nav-item-text d-none d-lg-block">Company data</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import StarIcon from "../icons/StarIcon.vue";
import BuildingIcon from "../icons/BuildingIcon.vue";

export default {
  name: "Sidebar",
  components: {
    StarIcon,
    BuildingIcon,
  },
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap");

$green: #50c0b1;

.sidebar-wrapper {
  position: relative;
  background-color: white;
  color: #66615b;
  height: 100%;
  min-height: 100vh;
  overflow: auto;
  box-shadow: inset -1px 0px 0px 0px #dddddd;

  .dropdown .dropdown-backdrop {
    display: none !important;
  }

  .navbar-form {
    border: none;
  }

  a {
    text-decoration: none;
  }
}

.navigation-bar {
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
  padding: 1rem;

  .nav-item {
    background-color: transparent;
    width: 100%;
    height: 50px;
    border: none;
    padding: 1rem;
    font-weight: 500;
    align-items: center;
    color: black;
  }

  .router-link-active {
    background-color: #eef4fb;
    border-radius: 12px;
    color: $green;

    span {
      color: $green;
    }

    .nav-item {
      color: $green;
    }

    .nav-icon {
      fill: $green;
    }
  }
}

.nav-item-text {
  margin-left: 1rem;
  margin-bottom: 0;
  color: #66615b;
  text-decoration: none;
}

.nav-item:hover {
  background: #e9ecef;
  border-radius: 12px;
  height: 50px;
}

.nav-icon {
  width: 15px;
  height: 100%;
}

.logo {
  font-family: "Comfortaa", cursive;
  font-size: 20px;
  color: #000;
  border-bottom: 1px solid rgba(102, 97, 91, 0.3);
  padding: 18px 0px;
  margin: 0 20px;
  height: 75px;
  justify-content: center;
}

.logo-text {
  letter-spacing: -0.2px;
  font-weight: 700;
}

.star-icon {
  width: 18px;
  height: 100%;
  fill: #4355a0;
}
</style>

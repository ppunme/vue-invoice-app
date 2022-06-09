<template>
  <nav
    class="navbar fixed-bottom navbar-light m-0 d-block d-sm-none nav-mobile"
  >
    <div class="container-fluid justify-content-center">
      <ul class="mb-0 ps-0 row">
        <div class="col">
          <router-link to="/" class="nav-item d-flex align-items-center">
            <font-awesome-icon icon="chart-line" /><span>Dashboard</span>
          </router-link>
        </div>
        <div class="col">
          <router-link
            to="/invoices"
            class="nav-item d-flex align-items-center"
          >
            <font-awesome-icon :icon="['far', 'file-lines']" /><span
              >Invoices</span
            >
          </router-link>
        </div>
        <div class="col">
          <router-link to="/company" class="nav-item d-flex align-items-center">
            <font-awesome-icon :icon="['far', 'building']" /><span
              >Company</span
            >
          </router-link>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarMobile",
};
</script>

<style lang="scss">
.navbar {
  min-height: 65px;
}
.nav-mobile {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);

  a {
    text-decoration: none;
  }

  .nav-item {
    color: #66615b;
    padding: 1rem;
    font-weight: 500;
    width: 50px;
    height: 50px;
    transition: 0.4s ease-out;

    span {
      margin-left: 0.5rem;
      margin-bottom: 0;
      width: 0%;
      overflow: hidden;
      transition: 0.4s ease-out;
    }

    svg {
      font-size: 1.1rem;
    }
  }

  .router-link-active {
    text-align: center;
    background-color: #eef4fb;
    border-radius: 12px;
    width: 130px;
    transition: 0.4s ease-out;

    span,
    svg {
      color: #50c0b1;
    }
  }

  .router-link-active > span {
    width: 100%;
    transition: 0.4s ease-out;
  }
}
</style>

<template>
  <nav class="navbar">
    <span class="nav-title">
      {{ this.$route.name }}
    </span>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style lang="scss">
$light-gray: #dddddd;

.navbar {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-left: 0.5rem;
  height: 75px;

  .nav-title {
    font-family: "Quicksand", sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: 0.5px;
  }
}

.btn-setting {
  cursor: pointer;
  padding-right: 2rem;
}
.dropdown-menu {
  font-size: 14px;
}

.dropdown-menu-end {
  right: 2rem !important;
}

ul {
  height: 0;
}

@media (min-width: 576px) {
  .navbar {
    border-bottom: 1px solid $light-gray;
  }
}

@media (min-width: 768px) {
  .navbar {
    padding-left: 2rem;
  }
}
</style>

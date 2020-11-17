<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated class="bg-primary">
      <q-toolbar>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated class="bg-primary" style="min-height: 6rem">
      <q-toolbar>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

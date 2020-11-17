<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated class="bg-primary">
      <q-toolbar>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-toolbar class="bg-grey-2 text-black q-px-xl">
        <q-toolbar-title class="text-subtitle2">{{currentUser.nombrePersonal}}</q-toolbar-title>
        <q-btn flat="" outline="" label="Cerrar sesion" color="secondary" @click="onLogout"></q-btn>
      </q-toolbar>
      <router-view />
    </q-page-container>
    <q-footer elevated class="bg-primary" style="min-height: 6rem">
      <q-toolbar>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  methods: {
    onLogout () {
      this.$store
        .dispatch('logout')
        .then(() => this.$router.push({ name: 'login' }))
    }
  },
  mounted () {
    if (!this.isAuthenticated) {
      this.$router.push({ name: 'login' })
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'currentUser'
    ])
  }
}
</script>

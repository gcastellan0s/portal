<template lang="pug">
  .row.q-pa-xl.bg-login(style="min-height:83vh")
    .col
      h5.text-secondary.text-weight-bold Oncología Pediátrica
      h4.text-primary “La detección temprana del cáncer puede salvar vidas”
    .col
      div
        q-card.login-card.q-mx-auto
          q-card-section.q-pa-xl
            h6.q-my-md.text-center Inicio de sesión
            h6.text-subtitle1.q-my-md.text-center Consulta el estatus del tratamiento oncológico que lleva tu hija o hijo en el IMSS.
            hr.q-my-md
            div(v-bind:class='{ show: errors.length }')
              p.text-negative.text-center.text-weight-bold(v-for='(error, i) in errors', :key='i')
                | {{ error }}
            q-form.q-gutter-md.q-mt-md(@submit='autenticacion(form)')
              q-input.q-my-md(
                dense=''
                label='CURP'
                outlined=''
                v-model='form.username'
                hint='18 dígitos'
                :rules="[val => !!val || 'Este campo es obligatorio']"
              )
              q-input.q-my-md(
                dense=''
                label='Contraseña'
                v-model='form.password'
                outlined=''
                :type="form.isPwd ? 'password' : 'text'"
                hint='Minimo 8 caracteres'
                :rules="[val => !!val || 'Este campo es obligatorio']"
              )
                template(v-slot:append='')
                  q-icon.cursor-pointer(:name="form.isPwd ? 'visibility_off' : 'visibility'" @click='form.isPwd = !form.isPwd')
              div.q-mt-xl
                q-btn.q-mx-auto(
                  type='submit'
                  :loading='authenting'
                  color='accent'
                  outline=''
                  style='min-width: 160px'
                )
                  | Acceder
                  template(v-slot:loading='')
                    q-spinner-ios.on-left
                    | Verficiando
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      form: {
        username: 'PAZR610508MGTRRF07',
        password: 'PARRAS8kt9',
        isPwd: true
      },
      invalidPassword: false,
      authenting: false
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  },
  methods: {
    autenticacion (form) {
      this.$store.dispatch('logout')
      this.$store
        .dispatch('login', `username=${form.username}|APO&password=${form.password}|APO&grant_type=password&scope=read`)
        .then((data) => {
          this.$router.push({ name: 'carnet' })
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.login-card
  width: 70%
  max-width: 550px
.bg-login
  background-image: url(~assets/img/auth/login/login.jpg);
  background-position: left;
  background-size: contain;
  background-repeat: no-repeat;
</style>

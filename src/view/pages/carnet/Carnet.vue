<template lang="pug">
  div
    .row.q-py-md.q-px-xl
      .col
        span.text-h4 Carnet
        q-separator(color='secondary' size='2px')
        q-separator.q-mb-md(color='secondary' size='.5rem' style='max-width:2.5rem')
        q-form
          p INGRESA LOS DATOS DEL PACIENTE
          .row.q-gutter-md
            .col
              q-input(
                  outlined=''
                  dense=''
                  v-model='form.curp'
                  label='CURP'
                  lazy-rules=''
                )
                  template(v-slot:append='')
                    q-icon(name='assignment_ind')
            .col
              q-input(
                  outlined=''
                  dense=''
                  v-model='form.nss'
                  label='Numero de seguridad social'
                  lazy-rules=''
                )
                  template(v-slot:append='')
                    q-icon(name='contact_mail')
            .col
              q-input(
                  outlined=''
                  dense=''
                  v-model='form.unidad_medica_atencion'
                  label='Unidad Médica'
                  lazy-rules=''
                )
                  template(v-slot:append='')
                    q-icon(name='local_pharmacy')
          .row.q-gutter-md.q-mt-sm
            .col
              q-input(
                  outlined=''
                  dense=''
                  v-model='form.nombre_paciente'
                  label='Nombre del paciente'
                  lazy-rules=''
                )
                  template(v-slot:append='')
                    q-icon(name='contacts')
            .col
              q-input(
                  outlined=''
                  dense=''
                  v-model='form.ap_paterno_paciente'
                  label='Apellido paterno'
                  lazy-rules=''
                )
                  template(v-slot:append='')
                    q-icon(name='contacts')
            .col
              q-input(
                  outlined=''
                  dense=''
                  v-model='form.ap_materno_paciente'
                  label='Apellido materno'
                  lazy-rules=''
                )
                  template(v-slot:append='')
                    q-icon(name='contacts')
          div.q-mt-md
            q-btn(
              :loading='searching'
              color='primary'
              outline=''
              ref='searchPatient'
              @click='search'
              style='min-width: 160px'
            )
              | {{pacientes.length === 0 ? "Buscar paciente" : "Buscar otro paciente"}}
              template(v-slot:loading='')
                q-spinner-hourglass.on-left
                | Buscando...
            q-btn.q-ml-sm(
              label='Limpiar'
              color='secondary'
              flat=''
              @click='reset'
            )
    .row.q-px-xl.q-mb-xl
      .col
        template
          q-banner.bg-warning.text-center.alert-banner.q-mb-md(
            inline-actions=''
            rounded=''
            dense=''
            v-if='!paciente'
          )
            span {{pacientes.length ? `${pacientes.length} Pacientes encontrados` : 'Busca un paciente para ver los resultados'}}
          q-table(
            v-if='pacientes.length'
            :data='pacientes'
            :columns='columns'
            row-key='name'
            flat=''
            bordered=false
            :dense='$q.screen.lt.md'
            :rows-per-page-options='[10, 25, 50, 100, 200]'
            rows-per-page-label='Pacientes por página'
          )
            template(v-slot:body-cell='props')
              q-td.cursor-pointer(:props='props' @click='setPatient(props.row)')
                span(v-if="props.col.field === 'nombre_paciente'") {{props.value}} {{props.row.ap_paterno_paciente}} {{props.row.ap_materno_paciente}}
                span(v-else-if="props.col.field === 'edad'") {{props.value}} años
                span(v-else-if="props.col.field === 'actions'")
                  q-icon(name='person_search' size='md', color='accent')
                span(v-else) {{props.value}}
        template(v-if="paciente")
          q-banner.text-center.alert-banner.alert-img-carnet.q-mb-md.q-py-lg.q-px-xl(
            inline-actions=''
            rounded=''
            dense=''
          )
            .row
              .col.text-left
                span.text-weight-bold Nombre:
                br
                span {{paciente.nombre_paciente}} {{paciente.ap_paterno_paciente}} {{paciente.ap_materno_paciente}}
              .col.text-left
                span.text-weight-bold CURP:
                br
                span {{paciente.curp}}
              .col.text-left
                span.text-weight-bold NSS:
                br
                span {{paciente.nss}}
            .row.q-mt-md
              .col.text-left
                span.text-weight-bold Fecha de nacimiento:
                br
                span {{paciente.fecha_nacimiento.$date | DateTime}}
              .col.text-left
                span.text-weight-bold Edad:
                br
                span {{paciente.edad}} años
              .col.text-left
                span.text-weight-bold Peso:
                br
                span {{paciente.peso}} Kg
            .row.q-mt-md
              .col.text-left
                span.text-weight-bold Agregado médico:
                br
                span {{paciente.agregado_medico}}
              .col.text-left
              .col.text-left
          q-banner.text-center.no-padding.q-mb-md(
            inline-actions=''
            rounded=''
            dense=''
          )
            .row.bg-grey-2.q-py-sm
              .col
                span.text-weight-bold.text-center DIAGNOSTICO
              .col
                span.text-weight-bold.text-center INFORMACIÓN
            .row.bg-grey-4.q-py-sm
              .col
                span.text-center {{paciente.diagnostico_cie10}}
              .col
                span.text-center Tipo mezcla: {{paciente.tipo_mezcla}}
          q-list.q-mb-md(
            bordered=''
            v-for='(carnet, i) in carnets'
            :key='i'
          )
            q-expansion-item.bg-grey-2(
              group='somegroup'
              icon='explore'
            )
              template(v-slot:header='')
                .col
                  q-item-section
                    p.no-margin Unidad de atención
                    p.no-margin.text-weight-bold {{carnet.unidad_medica_atencion ? carnet.unidad_medica_atencion : '-'}}
                .col
                  q-item-section
                    p.no-margin Médico
                    p.no-margin.text-weight-bold {{carnet.medico ? carnet.medico : '-'}}
                .col
                  q-item-section
                    p.no-margin Cama
                    p.no-margin.text-weight-bold {{carnet.cama ? carnet.cama : '-'}}
                .col
                  q-item-section
                    p.no-margin Fecha de la cita
                    p.no-margin.text-weight-bold {{carnet.fecha_prescripcion.$date ? carnet.fecha_prescripcion.$date : null | DateTime}}
              q-markup-table(flat='' bordered=false)
                thead
                  tr
                    th.text-center Genérico
                    th.text-center Consumo
                    th.text-center Cantidad
                    th.text-center Entregado
                tbody
                  tr(v-for='(prescription, p) in carnet.carnet', :key='p')
                    td.text-center {{prescription.generico}}
                    td.text-center {{prescription.consumo}} {{prescription.unidad_medida}}
                    td.text-center {{prescription.cantidad_bolos}}
                    td.text-center
                      q-icon(
                        :color='prescription.entregado === "ENTREGADO" ? "positive" : "negative"'
                        :name='prescription.entregado === "ENTREGADO" ? "done" : "clear"'
                      )
                      span(
                        :color='prescription.entregado === "ENTREGADO" ? "" : "negative"'
                      ) {{prescription.motivo}}

</template>

<script>
import ApiMongoService from '@/boot/services/api.mongo.service'
import { GETPATIENTS, CARNET } from '@/boot/endpoints/carnet'
export default {
  data () {
    return {
      searching: false,
      form: {
        curp: '',
        nss: '',
        unidad_medica_atencion: '',
        nombre_paciente: '',
        ap_paterno_paciente: '',
        ap_materno_paciente: ''
      },
      columns: [
        { label: 'NSS', field: 'nss', align: 'left' },
        { label: 'CURP', field: 'curp', align: 'left' },
        { label: 'Nombre', field: 'nombre_paciente', align: 'left' },
        { label: 'Edad', field: 'edad', align: 'left' },
        { label: 'Diagnostico', field: 'diagnostico_cie10', align: 'left' },
        { label: 'Acciones', field: 'actions', align: 'left' }
      ],
      pacientes: [],
      paciente: null,
      carnets: []
    }
  },
  methods: {
    search () {
      this.paciente = null
      this.searching = true
      ApiMongoService.get(GETPATIENTS, this.form)
        .then(response => response.json())
        .then(data => {
          this.pacientes = data
        })
        .finally(() => { this.searching = false })
    },
    setPatient (patient) {
      this.pacientes = {}
      ApiMongoService.get(CARNET, patient)
        .then(response => response.json())
        .then((data) => {
          console.log(data)
          this.paciente = data[0]
          this.carnets = data
        })
    },
    reset () {
      // this.form = {
      //   curp: '',
      //   nns: '',
      //   unidad_medica_atencion: '',
      //   nombre_paciente: '',
      //   ap_paterno_paciente: '',
      //   ap_materno_paciente: ''
      // }
      this.pacientes = []
      this.paciente = null
      this.carnets = []
    }
  }
}
</script>

<style lang="sass" scoped>
.alert-banner
  background-color: #fcf2ce!important
  border-color: $warning!important
.alert-img-carnet
  background-image: url(~assets/img/carnet/carnet.png);
  background-position: top right 10%;
  background-size: contain;
  background-repeat: no-repeat;
</style>

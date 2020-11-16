import { Component, OnInit } from '@angular/core';
import datepickerFactory from 'jquery-datepicker';
import datepickerESFactory from 'jquery-datepicker/i18n/jquery.ui.datepicker-es';
import * as $ from 'jquery';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Medicamento } from 'src/app/common/model/shared/medicina.model';
import { Tratamiento } from 'src/app/common/model/tratamiento.model';

import { ToastrService } from 'ngx-toastr';
import { PacienteTratamientoService } from 'src/app/common/services/paciente-tratamiento.service';
import { AutenticacionService } from 'src/app/common/services/autenticacion.service';
import { Router } from '@angular/router';
import { NAVIGATION } from 'src/app/common/config/navigations';

datepickerFactory($);
datepickerESFactory($);

@Component({
  selector: 'app-paciente-tratamiento',
  templateUrl: './paciente-tratamiento.component.html',
  styleUrls: ['./paciente-tratamiento.component.scss'],
})
export class PacienteTratamientoComponent implements OnInit {
  // variables de formularios
  tratamientoForm: FormGroup;
  medicinaForm: FormGroup;
  sesionMedicinaForm: FormGroup;
  diluyenteForm: FormGroup;

  // Variabbles de selects
  diluyentes: any[] = [];
  medicamentosCombo: any[] = [];
  tiemposInfusion: any[] = [];
  unidadesMedida: any[] = [];
  viasAdministracion: any[] = [];
  unidadesTiempo: any[] = [];

  tratamientoValido: boolean = true;
  sessionValida: boolean = true;
  mezclaValida: boolean = true;
  medicinaValida: boolean = true;
  medicamentoMezclaAuth = false;
  medicamentoSesionAuth = false;
  medicamentos: Medicamento[] = [];
  sesionMedicamentos = [];
  pacienteActivo = {
    agregadoMedico: '3M2007OR',
    apMaterno: 'TORRES',
    apPaterno: 'VILCHIS',
    curp: 'VITA071106HMCLRNA2',
    cveDelegacionAdscripcion: '16',
    cveUnidadMedicaAdscripcion: '160101252110',
    derechoServicioMedico: 'SI',
    descDelegacionAdscripcion: 'ESTADO DE MÉXICO PONIENTE',
    descUnidadMedicaAdscripcion: 'UMF 222 TOLUCA',
    edad: '12 AÑOS 10 MESES',
    fechaNacimiento: '06/11/2007',
    cveIdee: 'VITA071106$WRKV9A5',
    nombre: 'ANGEL JOSAFAT',
    nss: '1607881908',
    sexo: 'M',
    cveIdeeFechaAtencion:"OORL641001PQTVO9A1_20201212_122755",
    vigenciaHasta: '2023/11/06',
    vigente: 'VIGENTE',
  };
  usuarioActual: any;
  mezclaActual: any;
  tratamiento: Tratamiento = {
    cveIdee: '',
    cvePresupuestalAtiende: '',
    fecInicioTratamiento: '',
    fecFinalTratamiento: '',
    canSesion: 0,
    indTratamiento: 1,
    cveEstado: 5,
    desIndicacionesTratamiento: '',
    cveMotivoCancelacion: null,
    refMotivoCancelacion: null,
    cveUsuarioAlta: '',
    fecAltaRegistro: '',
    cveUsuarioModifica: null,
    fecModificaRegistro: null,
    fecBajaRegistro: null,
    sesiones: [],
  };

  sesionActual: any = {};
  numerodeSesion = 1;

  sesion = {
    fechaIni: '',
    fechaFin: '',
    info: '',
    duracion: 0,
  };

  mezcla = {
    fecha: '',
    medMax: 999,
  };

  mezclas: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private pacienteService: PacienteTratamientoService,
    private router: Router
  ) {
    console.log(this.pacienteService.pacienteActivo);
    // se obtiene el paciente
    this.pacienteActivo = this.pacienteService.pacienteActivo;
    console.log(this.pacienteActivo)
    if (!this.pacienteActivo) this.router.navigate([NAVIGATION.pao]);
  }

  ngOnInit(): void {
    moment.locale('es')
    console.log(this.medicamentos.length > this.mezcla.medMax);
    this.initDatepicker();
    this.initForms();
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuarioSesion'));
    console.log(this.usuarioActual);
    this.pacienteService.getSelects().subscribe((d: any) => {
      console.log(d);
      this.diluyentes = [...d.diluyentes];
      this.medicamentosCombo = [...d.medicamentos];
      this.tiemposInfusion = [...d.tiemposInfusion];
      this.unidadesMedida = [...d.unidadesMedida];
      this.viasAdministracion = [...d.viasAdministracion];
      this.unidadesTiempo = [...d.unidadesTiempo];
    },
      (err) => {
        console.log(err);
      }
    );
  }

  public initDatepicker() {
    $('#f_inicio')
      .datepicker({
        dateFormat: 'dd/mm/yy',
        onClose: (dateText: any) => {
          console.log(dateText)
          this.tratamientoForm.controls['fechaInicio'].setValue((dateText));
          this.checkSesiones();
        },
        changeYear: true,
      })
      .datepicker(
        'option',
        'dd-mm-yy'
      );

    $('#f_fin').datepicker({
      dateFormat: 'dd/mm/yy',
      onClose: (dateText: any) => {
        this.tratamientoForm.controls['fechaFin'].setValue((dateText));
        this.checkSesiones();
      },
      changeYear: true,
    });

    $('#f_inicio2').datepicker({
      dateFormat: 'dd/mm/yy',
      onClose: (dateText: any) => {
        this.sesion.fechaIni = (dateText);
        this.checkSesionActual();
      },
      changeYear: true,
    });

    $('#f_fin2').datepicker({
      dateFormat: 'dd/mm/yy',
      onClose: (dateText: any) => {
        this.sesion.fechaFin = (dateText);
        this.checkSesionActual();
      },
      changeYear: true,
    });

    $('#f_apl').datepicker({
      dateFormat: 'dd/mm/yy',
      onClose: (dateText: any) => {
        this.mezcla.fecha = (dateText);
        this.checkMezcla();
      },
      changeYear: true,
    });

    $.datepicker.regional['es'];
  }

  transformDate(date): string {
    let splitDate = date.split('/');
    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
  }

  public initForms() {
    this.tratamientoForm = this.formBuilder.group({
      sesiones: ['1', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      indicaciones: ['', Validators.required],
    });

    this.medicinaForm = this.formBuilder.group({
      cveMedicamento: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      desDosis: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      cveTiempoInfusion: [{ value: '1', disabled: this.tratamientoValido }, Validators.required],
      desVelocidadInfusion: [{ value: '', disabled: this.tratamientoValido }],
      cveViaAdministracion: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      numIntervalo: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      cveTiempoIntervalo: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      numDuracion: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      cveTiempoDuracion: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      refIndicacion: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      refFolio: ['0', Validators.required],
    });

    // sesionMedicinaForm
    this.sesionMedicinaForm = this.formBuilder.group({
      cveMedicamento: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      desDosis: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      cveTiempoInfusion: [{ value: '1', disabled: this.tratamientoValido }, Validators.required],
      desVelocidadInfusion: [{ value: '', disabled: this.tratamientoValido }],
      cveViaAdministracion: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      numIntervalo: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      cveTiempoIntervalo: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      numDuracion: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      cveTiempoDuracion: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      refIndicacion: [{ value: '', disabled: this.tratamientoValido }, Validators.required],
      refFolio: ['0', Validators.required],
    });

    this.diluyenteForm = this.formBuilder.group({
      cveDiluyente: [{ value: '', disabled: this.tratamientoValido }],
      desDosis: [{ value: '', disabled: this.tratamientoValido }],
      cveUnidadMedida: [{ value: '5', disabled: this.tratamientoValido }],
    });
  }

  checkSesiones() {
    this.tratamientoValido = !this.tratamientoForm.valid;
    if (this.tratamientoForm.valid) {
      let date = moment().format('YYYY-MM-DD');
      let inicio = (this.transformDate(this.tratamientoForm.value.fechaInicio));
      let fin = (this.transformDate(this.tratamientoForm.value.fechaFin));

      if (new Date(inicio).getTime() > new Date(fin).getTime()) {
        console.log('fecha inicio mayor')
        this.toastr.warning('Fecha de término no puede ser menor a Fecha inicio en Tratamiento');
        this.tratamientoForm.controls.fechaFin.setValue('');
        return;
      }

      this.tratamiento = {
        ...this.tratamiento,
        cveIdee: this.pacienteActivo.cveIdee,
        cvePresupuestalAtiende: this.usuarioActual.listaAsignacionUnidadMedica[0].cvePresupuestal,
        fecInicioTratamiento: inicio.toString(),
        fecFinalTratamiento: fin.toString(),
        canSesion: this.tratamientoForm.value.sesiones,
        indTratamiento: 1,
        cveEstado: 5,
        desIndicacionesTratamiento: this.tratamientoForm.value.indicaciones,
        cveMotivoCancelacion: null,
        refMotivoCancelacion: null,
        cveUsuarioAlta: this.usuarioActual.cveMatricula,
        fecAltaRegistro: date,
        cveUsuarioModifica: null,
        fecModificaRegistro: null,
        fecBajaRegistro: null,
        sesiones: [...this.tratamiento.sesiones],
      };

      console.log(this.tratamiento);
    }
  }

  checkSesionActual() {
    if (
      this.sesion.fechaIni != '' &&
      this.sesion.fechaFin != '' &&
      this.sesion.info != ''
    ) {
      let mezclas = this.tratamiento.sesiones[this.numerodeSesion - 1] ?
        this.tratamiento.sesiones[this.numerodeSesion - 1].mezclas : [];

      this.sessionValida = false;
      this.activarSesionMedicamentos(true);
      let inicio = new Date(this.transformDate(this.sesion.fechaIni)).getTime();
      let fin = new Date(this.transformDate(this.sesion.fechaFin)).getTime();
      this.sesion.duracion = ((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;

      if (new Date(inicio).getTime() > new Date(fin).getTime()) {
        console.log('fecha inicio mayor')
        this.toastr.warning('Fecha de término no puede ser menor a Fecha inicio en sesión');
        this.sesion.fechaFin = '';
        return;
      }

      // formato sessionActual
      let inicioS = (this.transformDate(this.sesion.fechaIni));
      let finS = (this.transformDate(this.sesion.fechaFin));

      this.sesionActual = {
        ...this.sesionActual,
        fecInicioSesion: inicioS,
        fecFinSesion: finS,
        numSesion: this.numerodeSesion,
        numDuracion: this.sesion.duracion,
        indSesion: this.numerodeSesion,
        cveEstado: 5,
        cveMotivoCancelacion: null,
        refMotivoCancelacion: null,
        cveUsuarioAlta: this.usuarioActual.cveMatricula,
        fecAltaRegistro: moment().format('YYYY-MM-DD'),
        cveUsuarioModifica: null,
        fecModificaRegistro: null,
        fecBajaRegistro: null,
        refIndicacionSesion: this.sesion.info,
        sesionMedicamentos: [],
        mezclas: [...mezclas],
      };
      // checar el numero actual de la sesion
      console.log(this.tratamiento.sesiones.length < this.numerodeSesion)
      if (this.tratamiento.sesiones.length < this.numerodeSesion) {
        this.tratamiento.sesiones.push(this.sesionActual);
      } else {
        this.tratamiento.sesiones[this.numerodeSesion - 1] = this.sesionActual;
      }
      console.log(this.tratamiento);
    } else {
      this.sessionValida = true;
      this.activarSesionMedicamentos(false);
    }
  }

  checkMezcla() {
    if (this.mezcla.fecha != '') {
      this.medicinaForm.controls.cveMedicamento.enable();
      this.medicinaForm.controls.desDosis.enable();
      this.medicinaForm.controls.cveTiempoInfusion.enable();
      this.medicinaForm.controls.desVelocidadInfusion.enable();
      this.medicinaForm.controls.cveViaAdministracion.enable();
      this.medicinaForm.controls.numIntervalo.enable();
      this.medicinaForm.controls.cveTiempoIntervalo.enable();
      this.medicinaForm.controls.numDuracion.enable();
      this.medicinaForm.controls.cveTiempoDuracion.enable();

      this.diluyenteForm.controls.cveDiluyente.enable();
      this.diluyenteForm.controls.desDosis.enable();
      this.diluyenteForm.controls.cveUnidadMedida.enable();
      this.mezclaValida = false;

      let fecha = this.transformDate(this.mezcla.fecha);
      this.mezclaActual = {
        fecAplicacion: fecha,
        refHoraAplicacion: null,
        numMezcla: (this.sesionActual.mezclas.length)+1,
        cveViaAdministracion: null, //campo nuevo de via oral
        refMotivo: null,
        cveMotivoCancelacion: null,
        refMotivoCancelacion: null,
        indMezcla: 1,
        cveUsuarioAlta: this.usuarioActual.cveMatricula,
        fecAltaRegistro: moment().format('YYYY-MM-DD'),
        cveUsuarioModifica: null,
        fecModificaRegistro: null,
        fecBajaRegistro: null,
        refCanMedicamento: 3,
        cveIdeeFechaAtencion:this.pacienteActivo.cveIdeeFechaAtencion,
        mezclasMedicamento: [],
      };
    } else {
      this.medicinaForm.controls.cveMedicamento.disable();
      this.medicinaForm.controls.desDosis.disable();
      this.medicinaForm.controls.cveTiempoInfusion.disable();
      this.medicinaForm.controls.desVelocidadInfusion.disable();
      this.medicinaForm.controls.cveViaAdministracion.disable();
      this.medicinaForm.controls.numIntervalo.disable();
      this.medicinaForm.controls.cveTiempoIntervalo.disable();
      this.medicinaForm.controls.numDuracion.disable();
      this.medicinaForm.controls.cveTiempoDuracion.disable();
      this.mezclaValida = true;
    }
  }

  addMedicina() {
    this.successAlerts();
    this.medicamentos.push({
      ...this.medicinaForm.value,
      refIndicacion:this.medicinaForm.controls.refIndicacion.value,
      indMedicamento: this.medicamentos.length,
      cveUsuarioAlta: this.usuarioActual.cveMatricula,
      fecAltaRegistro: moment().format('YYYY-MM-DD'),
      cveUsuarioModifica: null,
      fecModificaRegistro: null,
      fecBajaRegistro: null,
      mezclaDiluyente: {
        cveMezcla: 1,
        cveDiluyente: this.diluyenteForm.value.cveDiluyente,
        desDosis: this.diluyenteForm.value.desDosis,
        cveUnidadMedida: this.diluyenteForm.value.cveUnidadMedida,
        indDiluyente: 1,
        cveUsuarioAlta: this.usuarioActual.cveMatricula,
        fecAltaRegistro: moment().format('YYYY-MM-DD'),
        cveUsuarioModifica: null,
        fecModificaRegistro: null,
        fecBajaRegistro: null,
      }
    });
    console.log(this.medicamentos);

    this.medicinaValida = !(this.medicamentos.length >= 1);
  }

  addMedicinaSesion(){
    // sesionMedicamentos
    this.successAlerts();
    this.sesionMedicamentos.push({
      ...this.sesionMedicinaForm.value,
      refIndicacion:this.sesionMedicinaForm.controls.refIndicacion.value,
      indMedicamento: this.sesionMedicamentos.length,
      cveUsuarioAlta: this.usuarioActual.cveMatricula,
      fecAltaRegistro: moment().format('YYYY-MM-DD'),
      cveUsuarioModifica: null,
      fecModificaRegistro: null,
      fecBajaRegistro: null,
    });
    console.log(this.sesionMedicamentos);
  }

  changeMedicamentoSesion(){
    console.log(this.sesionMedicinaForm.controls.cveMedicamento.value);
    let medicina = this.tomarMedicamento(this.sesionMedicinaForm.controls.cveMedicamento.value)
    this.sesionMedicinaForm.controls.refIndicacion.setValue(medicina.desForma)
    console.log(this.sesionMedicinaForm.controls.refIndicacion.value)
    if (medicina.indAltoCosto) {
      this.sesionMedicinaForm.controls.refFolio.setValue('');
      this.medicamentoSesionAuth = true;
    } else {
      this.sesionMedicinaForm.controls.refFolio.setValue('0');
      this.medicamentoSesionAuth = false;
    }
  }

  // cuando cambia el medicamento verifica el medicamento y agrega campos
  changeMedicamentoMezcla() {
    console.log(this.medicinaForm.controls.cveMedicamento.value);
    let medicina = this.tomarMedicamento(this.medicinaForm.controls.cveMedicamento.value)
    this.medicinaForm.controls.refIndicacion.setValue(medicina.desForma)
    console.log(this.medicinaForm.controls.refIndicacion.value)
    if (medicina.indAltoCosto) {
      this.medicinaForm.controls.refFolio.setValue('');
      this.medicamentoMezclaAuth = true;
    } else {
      this.medicinaForm.controls.refFolio.setValue('0');
      this.medicamentoMezclaAuth = false;
    }
  }

  deleteMedicina(i) {
    this.medicamentos.splice(i, 1);
    this.medicinaValida = !(this.medicamentos.length === this.mezcla.medMax);
  }

  deleteMedicinaSesion(i) {
    this.sesionMedicamentos.splice(i, 1);
  }

  guardarMezcla() {
    this.mezclaActual.mezclasMedicamento = this.medicamentos;
    this.tratamiento.sesiones[(this.numerodeSesion - 1)].mezclas.push(this.mezclaActual);
    this.tratamiento.sesiones[(this.numerodeSesion - 1)].sesionMedicamentos=(this.sesionMedicamentos);
    console.log(this.tratamiento)
    this.pacienteService.saveTratamiento(this.tratamiento).subscribe((res: any) => {
      // reset de datos
      console.log(res);
      this.tratamiento = res;
      this.clearMezcla();

    }, err => {
      console.log(err)
      this.toastr.error(err.message, 'Ha ocurrido un error!');
    });
  }

  nextSession() {
    this.numerodeSesion++;
    this.sesion = {
      fechaIni: '',
      fechaFin: '',
      info: '',
      duracion: 0,
    };

    this.clearMezcla();
    this.clearSesion();
  }
  // limpia formularios de mezcla
  clearMezcla() {
    this.mezcla = {
      fecha: '',
      medMax: 1,
    }
    this.medicamentos = [];
    this.medicinaForm.setValue({
      cveMedicamento: '0',
      desDosis: '',
      cveTiempoInfusion: '',
      desVelocidadInfusion: '',
      cveViaAdministracion: '',
      numIntervalo: '',
      cveTiempoIntervalo: '',
      numDuracion: '',
      cveTiempoDuracion: '',
      refIndicacion: '',
      refFolio: '0',
    })
    this.medicinaValida = true;
    this.medicamentoMezclaAuth = false;
    this.checkMezcla();
  }
  // limpia formularios de sesion
  clearSesion() {
    this.sesion = {
      fechaIni: '',
      fechaFin: '',
      info: '',
      duracion: 0,
    };
    this.checkSesionActual();
  }

  tomarMedicamento(id) {
    return this.medicamentosCombo.filter(elem => elem.cveMedicamento === id)[0];
  }

  tomarUnidad(id) {
    return this.unidadesMedida.filter(elem => elem.cveUnidadMedida == id)[0].desUnidadMedida;
  }

  tomarDiluyentes(id) {
    if (!id) return 'Sin diluyente';
    return this.diluyentes.filter(elem => elem.cveDiluyente == id)[0].desDiluyente;
  }

  tomarTiempoInfusion(id) {
    if (!id) return 'Sin diluyente';
    return this.tiemposInfusion.filter(elem => elem.cveTiempoInfusion == id)[0].desTiempoInfusion;
  }

  tomarTiempo(id) {
    return this.unidadesTiempo.filter(elem => elem.cveUnidadTiempo == id)[0];
  }

  activarSesionMedicamentos(status) {
    if (status) {
      this.sesionMedicinaForm.controls.cveMedicamento.enable();
      this.sesionMedicinaForm.controls.desDosis.enable();
      this.sesionMedicinaForm.controls.cveTiempoInfusion.enable();
      this.sesionMedicinaForm.controls.desVelocidadInfusion.enable();
      this.sesionMedicinaForm.controls.cveViaAdministracion.enable();
      this.sesionMedicinaForm.controls.numIntervalo.enable();
      this.sesionMedicinaForm.controls.cveTiempoIntervalo.enable();
      this.sesionMedicinaForm.controls.numDuracion.enable();
      this.sesionMedicinaForm.controls.cveTiempoDuracion.enable();
    }else{
      this.sesionMedicinaForm.controls.cveMedicamento.disable();
      this.sesionMedicinaForm.controls.desDosis.disable();
      this.sesionMedicinaForm.controls.cveTiempoInfusion.disable();
      this.sesionMedicinaForm.controls.desVelocidadInfusion.disable();
      this.sesionMedicinaForm.controls.cveViaAdministracion.disable();
      this.sesionMedicinaForm.controls.numIntervalo.disable();
      this.sesionMedicinaForm.controls.cveTiempoIntervalo.disable();
      this.sesionMedicinaForm.controls.numDuracion.disable();
      this.sesionMedicinaForm.controls.cveTiempoDuracion.disable();
    }

  }

  // mostrar alerta de guardado
  successAlerts() {
    this.toastr.success('Bien!', 'Guardado con exito')
  }
  
  saveECEPAciente(){
    this.toastr.success("Tratamiento guardado","Bien!");
    setTimeout( ()=>{
      window.close();
    },5000 )
  }

}

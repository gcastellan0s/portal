import { Component, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GLOBAL, ROLES, MENSAJES_ERROR } from 'src/app/common/config/global';
import { AutenticacionService } from 'src/app/common/services/autenticacion.service';
import { NAVIGATION } from 'src/app/common/config/navigations';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { ActivarLoadingAction, DesActivarLoadingAction } from 'src/app/redux/ui.actions';
// import { UsuarioCredenciales } from 'src/app/common/model/local/usuarioCredenciales';


@Component({
  selector: 'app-autenticacion',
  templateUrl: './autenticacion.component.html',
  styleUrls: ['./autenticacion.component.scss']
})
export class AutenticacionComponent implements OnInit, AfterViewInit {

  @ViewChildren('pcaptcha')
  captchaComponent: any;
  autenticacionForm: FormGroup;
  validarFormulario = false;
  captcha: boolean = false;
  tituloDialogo: string;
  mensajeDialogo: string;
  botonDialogo: string;
  showDialog: boolean;
  botonEvento: string;
  smallRequerido = 'Este campo es obligatorio';
  capacitacion = window.location.hostname === GLOBAL.hostnameProd ? false : true;
  asignaciones: any[];

  constructor(
    private formBuilder: FormBuilder,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private store:Store<AppState>) { }

  ngOnInit(): void {
    // this.autenticacionService.logout();
    this.createFormGroup();
  }

  ngAfterViewInit() {
    this.captchaComponent.reset;
  }

  public createFormGroup() {
    this.autenticacionForm = this.formBuilder.group({
      usuario: ['PAZR610508MGTRRF07', Validators.required],
      password: ['PARRAS8kt9', Validators.required]
    });
  }

  get formulario() {
    return this.autenticacionForm.controls;
  }

  public captchaResponse($event) {
    this.captcha = true;
  }

  public captchaExpired($event) {
    this.captcha = !$event;
  }

  public showModal(titulo: string, mensaje: string, boton: string, mostrar: boolean) {
    this.tituloDialogo = titulo;
    this.mensajeDialogo = mensaje;
    this.botonDialogo = boton;
    this.showDialog = mostrar;
  }

  public autenticar(): void {
    this.validarFormulario = true;
    if (this.autenticacionForm.invalid) return;
    this.store.dispatch( new ActivarLoadingAction() );
    this.autenticacionService.autenticacion(this.autenticacionForm.value.usuario, this.autenticacionForm.value.password)
      .subscribe((response: any) => {
        this.store.dispatch( new DesActivarLoadingAction() );
        switch (response.status) {
          case 400:
            this.showModal('Error Autenticación', 'El usuario y/o la clave son incorrectas. Favor de verificar.', 'Aceptar', true);
            break;
          case 401:
            this.showModal('Error Autenticación', 'El usuario y/o la clave son incorrectas. Favor de verificar.', 'Aceptar', true);
            break;
        }
        this.autenticacionService.guardarUsuario(response.access_token);
        this.autenticacionService.guardarToken(response.access_token);
        this.autenticacionService.guardarRefresh(response.refresh_token);
        this.asignaciones = response.asignaciones;
        // switch (this.autenticacionService.usuarioSesion.roles[0]) {
        //   case ROLES.MEDICO:
        //     // this.autenticacionService.consultarPersonal().subscribe((response)=>{
        //     if (this.autenticacionForm.get('usuario').value == this.autenticacionForm.get('password').value) {
        //       let credenciales: UsuarioCredenciales = new UsuarioCredenciales();
        //       credenciales.cveMatricula = this.autenticacionForm.get('password').value;
        //       credenciales.password = this.autenticacionForm.get('usuario').value;
        //       this.router.navigate([NAVIGATION.cambioContrasena], { state: { credenciales: credenciales, asignaciones: this.asignaciones } });
        //     } else {
        //       if (this.asignaciones.length > 1) {
        //         this.router.navigate([NAVIGATION.asignacion], { state: { asignaciones: this.asignaciones } });
        //       } else {
        //         this.autenticacionService.guardarAsignacionUsuario(response.access_token, this.asignaciones[0]);
        //         this.router.navigate([NAVIGATION.seleccionPaciente], { state: { indAsignacionUnica: true, asignaciones: this.asignaciones }});
        //       }
        //     }
        //     // });
        //     break;
        //   case ROLES.ASISTENTE_MEDICO:
        //   // case ROLES.ENFERMERIA:
        // }
        this.router.navigate([NAVIGATION.pao]);

      },
        err => {
          if (err.status == 400 || err.status == 401) {
            this.store.dispatch( new DesActivarLoadingAction() );
            this.showModal('Error Autenticación', 'El usuario y/o la clave son incorrectas. Favor de verificar.', 'Aceptar', true);
          } else {
            this.store.dispatch( new DesActivarLoadingAction() );
            // FIX-ME Quitar para consumir back
            this.showModal('Atención', MENSAJES_ERROR.http500, 'Aceptar', true);
            // this.router.navigate([NAVIGATION.seleccionPaciente]);
          }
        }
      )
  }

  // public reestablecerPassword(){
  //   this.router.navigate([NAVIGATION.reestablecerPassword]);
  // }

  public dispararEvento(evento) {
    if (evento) {
      // this.router.navigate([NAVIGATION.seleccionPaciente]);
    }
    else {
      this.showDialog = false;
    }
  }

}

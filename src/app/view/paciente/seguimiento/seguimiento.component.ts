import { Component, OnInit, Inject } from '@angular/core';
import * as $ from 'jquery';
import { AutenticacionService } from 'src/app/common/services/autenticacion.service';
import { Router } from '@angular/router';
import { SeguimientoService } from 'src/app/common/services/seguimiento.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Seguimiento } from 'src/app/common/model/local/seguimiento';
import { DetalleMedicinaComponent } from './detalle-medicina/detalle-medicina.component';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss']
})
export class SeguimientoComponent implements OnInit {
  nssFlag: String = '';
  fecha: String = '';
  searchForm: FormGroup;
  seguimiento: Seguimiento[];

  tituloDialogo: string;
  mensajeDialogo: string;
  botonDialogo: string;
  showDialog: boolean;
  objReqSeg: Seguimiento = new Seguimiento();

  //se asigna 0    o    1
  cveMezcla: String;

  //banderas
  flagNoAplicado: String = '';
  flagHoraApp: String = '';


  //datos prueba
  observaciones: string;
  modalNoAplicado: string;

  constructor(private autenticacionService: AutenticacionService,
    private router: Router,
    private seguimientoService: SeguimientoService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
   ) { }

  ngOnInit(): void {
    if (!this.autenticacionService.isAuthenticated2) {
      this.router.navigate(['/login']);
    }
    this.initDatepicker();

    this.searchForm = this.formBuilder.group({
      nssFlag: ['', [Validators.required,this.validarNss]],
      fecha: ['', Validators.required],
    });

  }

  public initDatepicker() {

    $('#f_inicio_seg').datepicker({
      dateFormat: 'dd/mm/yy',
      onClose: (dateText: any) => {
        this.fecha = this.transformDate(dateText);
        this.searchForm.controls.fecha.setValue(this.transformDate(dateText));
      },
      changeYear: true,
    });

    $.datepicker.regional['es'];
  }

  buscar() {
    console.log(this.fecha)
    if ((this.nssFlag == null || this.nssFlag.length <= 9 || this.nssFlag.length > 10) && (this.fecha == null || this.fecha.length < 1)) {
      this.toastr.error('Aviso', 'Favor de proporcionar Número de Seguro Social a 10 posiciones y una fecha valida');
    } else {
      this.seguimientoService.getMezclas(this.searchForm.controls.nssFlag.value, this.searchForm.controls.fecha.value).subscribe(response => {
        if (response != null || response != '') {
          console.log(response)
          this.seguimiento = response;
          if (this.seguimiento.length < 1) {
            this.toastr.error('Aviso', 'No se encontraron datos');
          }
        }
      });
    }

  }

  validarNss(nss){
    const regExp = /\d{10}/gm;
    return regExp.test(nss.value)
  }

  openDialog2(objSeguimiento: Seguimiento): void {
    console.log('esto estoy recibiendo');
    console.log(objSeguimiento);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, { data: objSeguimiento });
    dialogRef.afterClosed().subscribe(result => {
      this.buscar();
      console.log('The dialog was closed');
      this.observaciones = result;
      console.log('componete seguimiento ' + this.observaciones);
      // if (this.flagHoraApp.length > 0 || this.flagNoAplicado.length > 0) {
      //   this.seguimientoService.putSeguimiento(objSeguimiento, this.cveMezcla).subscribe(response => {
      //     console.log('respuesta al guardar');
      //     console.log(response);
      //   });
      // } else {
      //   this.toastr.error('Aviso', 'No puedes guardar');
      // }

    });
  }

  // Mostrar el detalle del medicamento
  openDialog(med): void {
    const dialogRef = this.dialog.open(DetalleMedicinaComponent,{
      width:'720px',
      height:'600px',
      data: med
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.modalNoAplicado = result;
      console.log('componete seguimiento ' + this.modalNoAplicado);
      this.buscar();
    });
  }

  checkSesiones(e, i) {
    let btn = <HTMLInputElement>document.getElementById('btnsave' + i);
    btn.disabled = false;
    if (e.checked) {
      this.seguimiento[i].indMezcla = e.checked;
      this.seguimiento[i].horaAplicacion = '';
    } else {
      this.seguimiento[i].indMezcla = false;
      this.seguimiento[i].horaAplicacion = e.target.value;
    }
    this.flagNoAplicado = 'cambio'
  }

  transformDate(date): string {
    let splitDate = date.split('/');
    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
  }

}
// Modal 2
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html',
})
export class DialogOverviewExampleDialog {
  dialogo: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data, private seguimientoService: SeguimientoService,
    private toastr: ToastrService) { }

  onNoClick(): void {
    console.log('cerraste ');
  }

  envia(dia: any) {
    console.log(this.data.indMezcla)
    this.data.indMezcla = this.data.indMezcla ? 0 : 1;
    this.seguimientoService.putSeguimiento(this.data).subscribe(response => {
      console.log('respuesta al guardar');
      console.log(response);
      this.toastr.success('Aviso', 'Guardado con exito');
    }, err => {
      this.toastr.error('Aviso', 'No puedes guardar');
    });
  }

}

// Modal 1
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog2.html',
})
export class DialogOverviewExampleDialog2 {
  dialogo: any;

  constructor() { }

  onNoClick(): void {
    console.log('cerraste ');
  }
  envia(dia: any) {
    console.log('oprimieron envia' + dia);
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SeguimientoService } from 'src/app/common/services/seguimiento.service';

@Component({
  selector: 'app-detalle-medicina',
  templateUrl: './detalle-medicina.component.html',
  styleUrls: ['./detalle-medicina.component.scss']
})
export class DetalleMedicinaComponent implements OnInit {

  horaAplicacion="";
  indMezcla = false;
  motivo = 21;
  observaciones = new FormControl('');

  showMotivo = false;
  showObs = false;

  usuarioActual:any= null;

  motivosCancelacion = [
    {value:'21', desc:'Complicaciones que impiden el tratamiento'},
    {value:'9', desc:'Enfermedad concomitante'},
    {value:'22', desc:'Decisión voluntaria y/o de familiares'},
    {value:'23', desc:'Efectos secundarios'},
    {value:'24', desc:'Reacciones adversas'},
    {value:'25', desc:'Falla al tratamiento'},
    {value:'26', desc:'Toxicidad inaceptable'},
    {value:'27', desc:'Desabasto de medicamentos'},
    {value:'28', desc:'Disponibilidad de cama'}
  ]

  constructor( 
    public dialogRef: MatDialogRef<DetalleMedicinaComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private seguimientoService: SeguimientoService,
    private toastr: ToastrService, ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuarioSesion'));
    console.log(this.usuarioActual);
    this.horaAplicacion = this.data.horaAplicacion;
    this.indMezcla = this.data.indAplicado;
    this.showMotivo = this.data.indAplicado;
    this.showObs = this.data.observacion ? true:false;
    this.observaciones.setValue(this.data.observacion);
    this.motivo = this.data.cveMotivoCancelacion
  }

  checkSesiones(e) {
    this.showObs = true;
    if (e.checked) {
      this.showMotivo = true;
      this.horaAplicacion = '';
      this.motivo = 21;
    } else {
      this.motivo = null;
      this.showMotivo = false;
      this.indMezcla = false;
    }
    // this.flagNoAplicado = 'cambio'
  }

  guardarMed(){
    this.data.horaAplicacion = this.horaAplicacion;
    this.data.indAplicado = this.indMezcla ? 0:1;
    this.data.cveMotivoCancelacion = this.motivo;
    this.data.observacion = this.observaciones.value;
    this.data.cveMatriculaModifica = this.usuarioActual.cveMatricula;
    console.log(this.data);
    this.seguimientoService.putSeguimiento(this.data).subscribe(response => {
      console.log('respuesta al guardar');
      console.log(response);
      this.dialogRef.close();
      this.toastr.success('Aviso', 'Guardado con exito');
    }, err => {
      this.toastr.error('Aviso', 'No puedes guardar');
    });
  }

}

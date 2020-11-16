import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

export interface CarnetElement {
  fecha_prescripcion: string;
  id_prescripcion: string;
  generico: string;
  consumo: string;
  cantidad_bolos: string;
  entregado: string;
}

let ELEMENT_DATA: CarnetElement[] = [];

@Component({
  selector: 'app-carnet',
  templateUrl: './carnet.component.html',
  styleUrls: ['./carnet.component.scss']
})

export class CarnetComponent implements OnInit {
  searchForm: FormGroup;
  nssPdf: any;
  arraySesiones: any[] = [];
  showIndex = false;
  pacientes = [];
  paciente = null;
  pacienteHistoria = [];
  dataSource = ELEMENT_DATA;
  displayedColumns: string[] = ['fecha_prescripcion', 'id_prescripcion', 'generico', 'consumo', 'cantidad_bolos', 'entregado'];
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    this.searchForm = this.formBuilder.group({
      curpPaciente: ['', Validators.required],
      nnsPaciente: ['', Validators.required],
      unidadMedicaPaciente: ['', Validators.required],
      nombrePaciente: ['', Validators.required],
      apellidoPaternoPaciente: ['', Validators.required],
      apellidoMaternoPaciente: ['', Validators.required],
    });
  }

  limpiar() {
    this.searchForm.controls['curpPaciente'].setValue('');
    this.searchForm.controls['nnsPaciente'].setValue('');
    this.searchForm.controls['unidadMedicaPaciente'].setValue('');
    this.searchForm.controls['nombrePaciente'].setValue('');
    this.searchForm.controls['apellidoPaternoPaciente'].setValue('');
    this.searchForm.controls['apellidoMaternoPaciente'].setValue('');
    this.paciente = null;
    this.pacientes = [];
  }

  searchByNss() {
    const url = `http://10.100.6.97/api/v1/resources/padrones?nss=${this.searchForm.controls['nnsPaciente'].value}&curp=${this.searchForm.controls['curpPaciente'].value}&nombre_paciente=${this.searchForm.controls['nombrePaciente'].value}&ap_paterno_paciente=${this.searchForm.controls['apellidoPaternoPaciente'].value}&ap_materno_paciente=${this.searchForm.controls['apellidoMaternoPaciente'].value}&unidad_medica_atencion=${this.searchForm.controls['unidadMedicaPaciente'].value}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.pacientes = data.map((value) => {
          return value._id;
        });
      })
      .catch(error => this.toastr.error(error))
  }

  asignarPaciente(paciente) {
    this.paciente = paciente;
    this.pacientes = [];
    const url = `http://10.100.6.97/api/v1/resources/carnets?nss=${paciente.nss}`;
    fetch(url)
      .then(response => response.json())
      .then(async data => {
        // console.log(data)
        this.dataSource = await data.map((value) => {
          value.fecha_prescripcion = value.fecha_prescripcion.$date;
          return value;
        });
        this.paciente.edad = data[0].edad;
        this.paciente.fecha_nacimiento = data[0].fecha_nacimiento;
        this.paciente.peso = data[0].peso;
        this.paciente.agregado_medico = data[0].agregado_medico;
        this.paciente.diagnostico = data[0].diagnostico;
        this.paciente.tipo_mezcla = data[0].tipo_mezcla;
        function groupBy(collection, property) {
          let i = 0, val, index, values = [], result = [];
          for (; i < collection.length; i++) {
            if (collection[i]['generico'] != 'Jeringas'){
              val = collection[i][property];
              index = values.indexOf(val);
              if (index > -1) result[index].push(collection[i]);
              else {
                values.push(val);
                result.push([collection[i]]);
              }
            }
          }
          return result;
        }
        this.pacienteHistoria = groupBy(data, 'fecha_prescripcion');
        console.log(this.pacienteHistoria)
        // this.dataSource = data.map((value) => {
        //   return {
        //     fecha_prescripcion: value.fecha_prescripcion,
        //     id_prescripcion: value.id_prescripcion,
        //     generico: value.generico,
        //     consnumo: value.consumo,
        //     cantidad_bolos: value.cantidad_bolos,
        //     entregado: value.entregado
        //   };
        // });
      })
      .catch(error => this.toastr.error(error));
  }
}

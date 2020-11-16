import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RegistroPacienteService } from 'src/app/common/services/registro-paciente.service';
import {AseguradoAcceder} from 'src/app/common/model/local/asegurado-acceder';
import { Pacientes } from 'src/app/common/model/local/pacientes';
import { NotasMedicas } from 'src/app/common/model/local/notas-medicas';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AutenticacionService } from 'src/app/common/services/autenticacion.service';
import { PacienteTratamientoService } from 'src/app/common/services/paciente-tratamiento.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

declare var $:any;

@Component({
  selector: 'app-paciente-registro',
  templateUrl: './paciente-registro.component.html',
  styleUrls: ['./paciente-registro.component.scss']
})
export class PacienteRegistroComponent implements OnInit {

  firstForm: FormGroup;
  datosPaciente: FormGroup;
  diagnostico: FormGroup;

  nssFlag:string;
  aseguradoAcceder:AseguradoAcceder[];
  activeTableNucleFamiliar:boolean= false;
  objAseguradoAcceder:AseguradoAcceder= new AseguradoAcceder();
  objNotasMedicas:NotasMedicas= new NotasMedicas();
  objPacientes:Pacientes= new Pacientes();
  activarBotonSiguiente :boolean=false;
  fechaFormato:String;


  constructor( private formBuilder: FormBuilder,private registroPacienteService:RegistroPacienteService,
    private router: Router,
    private toastr: ToastrService,
    private autenticacionService: AutenticacionService,
    private pacienteTratamientoService: PacienteTratamientoService) { }

  ngOnInit(): void {
    this.firstForm = this.formBuilder.group({
      numeroSS: ['', Validators.required]
    });

    this.datosPaciente = this.formBuilder.group({
      numNss: ['',Validators.required ],
      refAgregadoMedico: ['', ],
      cveCurp: ['', ],
      nomNombre: ['', ],
      nomApellidoPaterno: ['', ],
      nomApellidoMaterno: ['', ],
      indVigencia: ['',],
      edad: ['', ],
      delegacion: ['',],
      unidad: ['', ],
    });

    this.diagnostico = this.formBuilder.group({
      descDiagnostico: ['', Validators.required],
      descProcedimiento: ['', Validators.required],
      complementoDiagnostico: ['', Validators.required],
    });

    this.filteredOptions = this.descDelegacionAdscripcion.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
    );


  }

  getDerechohabientesByNss(nss:any) {
    this.nssFlag=nss;
    if(typeof  this.nssFlag=== 'undefined'|| this.nssFlag=== null){
      this.toastr.error('Aviso', 'Favor de proporcionar Número de Seguro Social a 10 posiciones');
    }else if(this.nssFlag.length<=9 || this.nssFlag.length>10  ){
      this.toastr.error('Aviso', 'Favor de proporcionar Número de Seguro Social a 10 posiciones');
    }
    else if(this.nssFlag != null && this.nssFlag.length===10){
      this.objNotasMedicas= new NotasMedicas();
      this.objAseguradoAcceder= new AseguradoAcceder();
      this.registroPacienteService.getDerechohabientesByNss(this.nssFlag).subscribe(response => {
        if(response != null){
          this.aseguradoAcceder= response;
        this.activeTableNucleFamiliar= true;
        }else{
          this.toastr.error('Aviso', 'No se encontraron datos');
          this.activeTableNucleFamiliar= false;
        }
      });
    }
  }

  fillDatosPaciente(aseguradoAcceder:AseguradoAcceder){
    this.pacienteTratamientoService.pacienteActivo = aseguradoAcceder;
    this.objNotasMedicas= new NotasMedicas();
    this.objAseguradoAcceder= new AseguradoAcceder();
    this.objAseguradoAcceder= aseguradoAcceder;
    this.descDelegacionAdscripcion.setValue( {name:this.objAseguradoAcceder.descDelegacionAdscripcion} )
    console.log(this.objNotasMedicas, this.objAseguradoAcceder)
    this.registroPacienteService.getNotasMedicas(this.objAseguradoAcceder.idee).subscribe(response =>{
      console.log(response)
      if(response == null){
      }else{
        this.objNotasMedicas= response;
      }
      this.activarBotonSiguiente= true;
    },err=>{
      if(err.status==400){
        this.toastr.error('Error', 'Ha ocurrido un error!');
      }
    }
    );
  }

  limpiaPantalla(){
    this.objNotasMedicas= new NotasMedicas();
    this.objAseguradoAcceder= new AseguradoAcceder();
    this.aseguradoAcceder= [];
    this.activeTableNucleFamiliar=false;
    this.nssFlag=null;
  }

  registratPaciente(){
    if(this.activarBotonSiguiente){
      this.fillObjPaciente();
      this.objPacientes.referenciaDiagnosticoProc= this.objNotasMedicas;
      console.log(this.objPacientes.cveIdeeFechaAtencion = this.objNotasMedicas.cveIdeeFechaAtencion)
      this.pacienteTratamientoService.pacienteActivo = this.objPacientes;
      this.registroPacienteService.postPacientes(this.objPacientes).subscribe(response =>{
        if(response != null){
          this.router.navigate(['pao/paciente/tratamiento']);
        }
      },err=>{
        if(err.status==409){
          this.toastr.error('Error', 'El paciente fue registrado previamente');
        }
      }
      );
    }
  }

  fillObjPaciente(){
    this.objPacientes.cveIdee=this.objAseguradoAcceder.idee;
    this.objPacientes.cvePresupuestalAdscripcion= this.objAseguradoAcceder.cveUnidadMedicaAdscripcion;
    this.objPacientes.numNss = this.objAseguradoAcceder.nss;
    this.objPacientes.nomNombre= this.objAseguradoAcceder.nombre;
    this.objPacientes.nomApellidoPaterno= this.objAseguradoAcceder.apPaterno;
    this.objPacientes.fecNacimiento= this.objAseguradoAcceder.fechaNacimiento;

    this.objPacientes.nomApellidoMaterno=  this.objAseguradoAcceder.apMaterno;
    this.objPacientes.refAgregadoMedico = this.objAseguradoAcceder.agregadoMedico;
    this.objPacientes.refSexo= this.objAseguradoAcceder.sexo;
    this.objPacientes.cveCurp= this.objAseguradoAcceder.curp;

    this.objPacientes.fecVigencia= this.objAseguradoAcceder.vigenciaHasta;
    this.objPacientes.indVigencia= this.objAseguradoAcceder.vigente==='VIGENTE'?1:0;

  }

  // autocomplete functions
  options = [
    {name: 'Mary'},
    {name: 'Shelley'},
    {name: 'Igor'}
  ];

  descDelegacionAdscripcion = new FormControl({value: '', disabled: true},Validators.required);
  filteredOptions: Observable<any[]>;
  displayFn(user): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}

import { NotasMedicasRes } from './notas-medicas-res';

export class Pacientes {

  cveIdee: String;
  cvePresupuestalAdscripcion: String;
  numNss: String;
  nomNombre: String;
  nomApellidoPaterno: String;
  fecNacimiento: String;

  nomApellidoMaterno: String;
  refAgregadoMedico: String;
  refSexo: String;
  cveCurp: String;

  fecVigencia: String;
  indVigencia: number;
  cveUsuarioAlta: String;
  referenciaDiagnosticoProc:NotasMedicasRes;
  cveIdeeFechaAtencion: any;
}

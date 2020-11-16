export class UsuarioSesion {
  nombrePersonal?: string;
  cveMatricula?: string;
  password?: string;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  cveDelegacion?: string;
  desDelegacion?: string;
  cveUnidadMedica?: string;
  desUnidadMedica?: string;
  roles?: string[] = [];
  listaAsignacionUnidadMedica?: any[];
  cvePacienteEnfermeria: any;
}

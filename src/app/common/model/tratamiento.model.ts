export interface Tratamiento {
    cveIdee: string,
    cvePresupuestalAtiende: string,
    fecInicioTratamiento: string,
    fecFinalTratamiento: string,
    canSesion: number,
    indTratamiento: number,
    cveEstado: number,
    desIndicacionesTratamiento: string,
    cveMotivoCancelacion: any,
    refMotivoCancelacion: any,
    cveUsuarioAlta:string,
    fecAltaRegistro: string,
    cveUsuarioModifica: any,
    fecModificaRegistro:any,
    fecBajaRegistro: any,
    sesiones: any[]
}

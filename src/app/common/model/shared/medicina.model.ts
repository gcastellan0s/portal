export interface Medicamento{
    nombre: string,
    dosis: string,
    unidad:string,
    tiempoInfucion:string,
    velocidadInfucion: string,
    mezclaDiluyente: any
}

export interface Diluyente{
    nombre:string,
    dosis:string,
    unidad:string
}
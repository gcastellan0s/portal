import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PacienteTratamientoService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public pacienteActivo = null;
  constructor( private htpp:HttpClient ) { }



  saveTratamiento(tratamiento){
    let url = 'https://msapop-tratamiento.cloudapps.imss.gob.mx/msapop-tratamiento/v1/tratamiento';
    return this.htpp.post(url,tratamiento,{headers:this.headers});
  }

  getSelects(){
    let url = 'https://msapop-catalogos.cloudapps.imss.gob.mx/msapop-catalogos/v1/catalogos';
    return this.htpp.get(url,{headers:this.headers})
  }

}

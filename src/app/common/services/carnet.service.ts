import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarnetService {

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor( private http: HttpClient ) { }

  getCarnet( nss, fechaInicio, fechaFinal ){
    const url = `https://msapop-carnet-uat.cloudapps.imss.gob.mx/msapop-carnet/v1/busquedasCarnetFamiliar?cveIdee=${nss}&fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`;
    return this.http.get(url,{headers:this.httpHeaders});
  }

  getCarnetMovil(nss, fechaInicio, fechaFinal){
    const url = `https://msapop-carnet-uat.cloudapps.imss.gob.mx/msapop-carnet/v1/busquedasIdeeMobile?cveIdee=${nss}&fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`;
    return this.http.get(url,{headers:this.httpHeaders});
  }

  getPacientes(nss){
    return this.http.get(`https://msapop-paciente-uat.cloudapps.imss.gob.mx/msapop-paciente/v1/pacientes?nss=${nss}`,{headers:this.httpHeaders});
  }

  getPdfByNSS( nss, fechaInicio, fechaFinal){
    const url = `https://msapop-carnet-uat.cloudapps.imss.gob.mx/msapop-carnet/v1/pdfNss?nss=${nss}&fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`;
    return this.http.get(url,{responseType:'blob'});
  }

  getPdfByIdee(idee,fechaInicio, fechaFinal){
    const url = `https://msapop-carnet-uat.cloudapps.imss.gob.mx/msapop-carnet/v1/carnetUnico?cveIdee=${idee}&fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`;
    return this.http.get(url,{responseType:'blob'});
  }

}

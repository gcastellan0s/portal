import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIs } from '../config/endpoints';
import { GLOBAL } from '../config/global';
import { NotasMedicas } from '../model/local/notas-medicas';
import { Pacientes } from '../model/local/pacientes';

@Injectable({
  providedIn: 'root'
})
export class RegistroPacienteService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }

  getDerechohabientesByNss(nss:String):Observable<any>{
    return this.http.get<any>(`https://msapop-paciente.cloudapps.imss.gob.mx/msapop-paciente/v1/derechohabientes/${nss}`,{headers:this.httpHeaders});
  }

  getNotasMedicas(idee:any):Observable<any>{
    return this.http.get<any>(`https://msapop-ece.cloudapps.imss.gob.mx/msapop-ece/v1/notasMedicas/${idee}`,{headers:this.httpHeaders});
  }

  postPacientes(objPacientes:Pacientes):Observable<any>{
    return this.http.post<any>(`https://msapop-paciente.cloudapps.imss.gob.mx/msapop-paciente/v1/pacientes`,objPacientes,{headers:this.httpHeaders});
  }

}

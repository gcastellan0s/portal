import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIs } from '../config/endpoints';
import { GLOBAL } from '../config/global';
import { Seguimiento } from '../model/local/seguimiento';

@Injectable({
  providedIn: 'root',
})
export class SeguimientoService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}


  getMezclas(nssParam:String,fechaParam:String): Observable<any> {
    console.log('nss  ' + nssParam);
    console.log('fechaParam  ' + fechaParam);
    if(nssParam=='' &&  fechaParam.length>0){
      return this.http.get<any>(
        `${GLOBAL.baseURLseguimiento}${APIs.seguimiento.busquedaNssDate}`,
        {
          params: {
            fecha: fechaParam.toString()
          },
        }
      );
    }else if(nssParam.length>0 &&  fechaParam== ''){
      return this.http.get<any>(
        `${GLOBAL.baseURLseguimiento}${APIs.seguimiento.busquedaNssDate}`,
        {
          params: {
            nss: nssParam.toString()

          },
        }
      );
    }else{
      return this.http.get<any>(
        `${GLOBAL.baseURLseguimiento}${APIs.seguimiento.busquedaNssDate}`,
        {
          params: {
            nss: nssParam.toString(),
            fecha: fechaParam.toString()

          },
        }
      );
    }

  }

  putSeguimiento(objSeguimiento:Seguimiento):Observable<any>{
    const url = `https://msapop-seguimiento.cloudapps.imss.gob.mx/msapop-seguimiento/v1/mezclas/`
    return this.http.put<any>(url,objSeguimiento,{headers:this.httpHeaders});
  }
}

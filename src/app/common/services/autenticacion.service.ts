import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { String } from 'typescript-string-operations';
import { UsuarioSesion } from 'src/app/common/model/local/usuarioSesion';
import { APIs } from '../config/endpoints';
import { GLOBAL } from '../config/global';
import { Router } from '@angular/router';
import { NAVIGATION } from '../config/navigations';
import { JsonPipe } from '@angular/common';
import jwt_decode from 'jwt-decode';


// import { EnumNavigatorPlataform } from '../model/enum/enum.navigator.platform';
// import { Asignacion } from '../model/catalogos/asignacion';
// import { UsuarioCredenciales } from '../model/local/usuarioCredenciales';


@Injectable({
  providedIn: 'root'
})

export class AutenticacionService {

  private _token : string;
  private _refresh : string;
  private _usuarioSesion : UsuarioSesion;

  constructor(private http: HttpClient, private router: Router) { }

  public get usuarioSesion(): UsuarioSesion {
    if (this._usuarioSesion != null) {
      return this._usuarioSesion;
    } else if (this._usuarioSesion == null && sessionStorage.getItem('usuarioSesion') != null) {
      this._usuarioSesion = JSON.parse(sessionStorage.getItem('usuarioSesion')) as UsuarioSesion;
      return this._usuarioSesion;
    }
    return new UsuarioSesion();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  public get refresh(): string {
    if (this._refresh != null) {
      return this._refresh;
    } else if (this._refresh == null && sessionStorage.getItem('refresh_token') != null) {
      this._refresh = sessionStorage.getItem('refresh_token');
      return this._refresh;
    }
    return null;
  }

  autenticacion(usuario: string, password: string): Observable<any> {
    const credenciales = btoa('guiapop' + ':' + '1M55*APOP');
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', 'Authorization': 'Basic ' + credenciales });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', `${usuario}|APO`);
    params.set('password', `${password}|APO`);
    params.set('scope', 'read');
    params.set('grant_type', 'password');
    // let url = `${GLOBAL.baseURL}${APIs.autenticacion.login}`;
    let url = "https://msapop-autenticacion-uat.cloudapps.imss.gob.mx/msapop-autenticacion/v1/oauth/token";
    return this.http.post<any>(url, params.toString(), { headers: httpHeaders }).pipe(map((response: any) => {
      this.guardarUsuario(response.access_token);
      this.guardarToken(response.access_token);
      console.log('Token de acceso: ', response.access_token);
      return response;
    },
    catchError(e => {
      return throwError(e);
    })));
  }

  refreshSession() : Observable<any> {
    this._token = null;
    const credenciales = btoa('infocovid' + ':' + '1mss1nf0Covid*01');
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', 'Authorization': 'Basic ' + credenciales });
    let params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', this.refresh.replace("\"", "").replace("\"", ""));

    return this.http.post<any>(APIs.autenticacion.login, params.toString(), { headers: httpHeaders });
  }


  // cambiarContrasena(usuario: UsuarioCredenciales): Observable<any> {

  //   let httpHeaders = new HttpHeaders({'Content-Type':'application/json;charset=utf-8'});

  //   let params = new HttpParams()
  //     .set('refClave', usuario.password);

  //   return this.http.put<any>(`${APIs.autenticacion.cambioContrasena}`+usuario.cveMatricula+'/renovacion', '', {observe: 'response', params: params, headers: httpHeaders}).pipe(
  //     (response: any) => {
  //       return response;
  //     }
  //   );
  // }

  public guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    console.log(payload)
    this._usuarioSesion = {...payload}
    sessionStorage.setItem('usuarioSesion', JSON.stringify(this._usuarioSesion));
  }

  // guardarAsignacionUsuario(accessToken: string, asignacion: Asignacion){
  //   let payload = this.obtenerDatosToken(accessToken);
  //   this._usuarioSesion = this.usuarioSesion;
  //   this._usuarioSesion.nombrePersonal = payload.nombrePersonal;
  //   this._usuarioSesion.cveMatricula = payload.cveMatricula;
  //   this._usuarioSesion.roles = payload.authorities;
  //   this.usuarioSesion.cveUnidadMedica = asignacion.cveUnidadMedica;
  //   this.usuarioSesion.desUnidadMedica = asignacion.nomUnidad;
  //   this.usuarioSesion.cveDelegacion = asignacion.cveDelegacion;
  //   this.usuarioSesion.desDelegacion = asignacion.desDelegacion;
  //   sessionStorage.setItem('usuarioSesion', JSON.stringify(this._usuarioSesion));
  // }

  public guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', JSON.stringify(this._token));
  }

  guardarRefresh(token: string): void {
    this._refresh = token;
    sessionStorage.setItem('refresh_token', JSON.stringify(this._refresh));
  }

  obtenerDatosToken(accessToken: string): any {

    if (accessToken != null) {
      try{
        return JSON.parse(atob(accessToken.split(".")[1]));

      }catch(error){
        return jwt_decode(accessToken);
      }

    }
    return null;

}
  getDataFromToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }



  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);

    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    this.router.navigate([NAVIGATION.login]);
    return false;
  }
  isAuthenticated2(): boolean {
    let payload = this.obtenerDatosToken(sessionStorage.getItem('token'));
    //let payload2 = this.getDataFromToken(sessionStorage.getItem('aToken'));
    if ( payload!=null ) {
      return true;
    }
    return false;
  }

  hasRole(roles: string[]): boolean {
    let hasRole = false;

    roles.forEach(role => {
      if (this.usuarioSesion.roles.includes(role)) {
        hasRole = true;
      }
    });
    return hasRole;
  }

  logout(): void {
    this._token = null;
    this._refresh = null;
    this._usuarioSesion = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuarioSesion');
    this.router.navigate([NAVIGATION.login]);
  }

  public dispararEvento(evento){
    if(evento){

    }
    else{
      // this.showDialog = false;
    }
  }

}

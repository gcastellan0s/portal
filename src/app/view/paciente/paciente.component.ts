import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from 'src/app/common/services/autenticacion.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {

  public User = {
    nombrePersonal:'',
    listaAsignacionUnidadMedica:[{desUnidadMedica:''}],
    cveMatricula:''
  };

  currentLink = '';

  constructor( private router: Router, private authService: AutenticacionService ) { }

  ngOnInit(): void {
    this.User = JSON.parse(decodeURIComponent(escape(sessionStorage.getItem('usuarioSesion'))));
    
    this.currentLink = this.router.url.split('/')[2];
  }
  
  checkUrl(){
    this.currentLink = this.router.url.split('/')[2];
  }

  logout(){
    this.authService.logout();
  }

}

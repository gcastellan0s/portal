import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NAVIGATION } from 'src/app/common/config/navigations';
import { AutenticacionService } from 'src/app/common/services/autenticacion.service';
import { PacienteTratamientoService } from 'src/app/common/services/paciente-tratamiento.service';

@Component({
  selector: 'app-auth-ece',
  templateUrl: './auth-ece.component.html',
  styleUrls: ['./auth-ece.component.scss']
})
export class AuthEceComponent implements OnInit {

  token: any = "";

  constructor( 
    private route:Router, 
    private router: ActivatedRoute, 
    private authService: AutenticacionService,
    private pacienteTratamientoService: PacienteTratamientoService ) { }

  ngOnInit(): void {
    this.token = this.router.snapshot.paramMap.get("token");
    this.token = JSON.parse(this.token);
    console.log(this.token)
    this.pacienteTratamientoService.pacienteActivo = this.token.pacienteActivo;
    this.authService.guardarToken(this.token.access_token);
    this.authService.guardarUsuario(this.token.access_token);
    this.route.navigate(["/pao/"+NAVIGATION.tratamiento_paciente]);
  }

}

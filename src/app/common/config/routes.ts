import { Routes } from '@angular/router';
import { NAVIGATION } from './navigations';
import { AutenticacionComponent } from 'src/app/view/login/autenticacion/autenticacion.component';
import { PacienteComponent } from 'src/app/view/paciente/paciente.component';
import { AuthguardService } from '../services/authguard.service';
import { CarnetComponent } from 'src/app/view/paciente/carnet/carnet.component';


export const appRoutes: Routes = [
  {
    path: NAVIGATION.login,
    pathMatch: 'full',
    component: AutenticacionComponent,
  },
  {
    path: NAVIGATION.pao,
    component: PacienteComponent,
    // canActivate: [AuthguardService],
    children: [
      {
        path: NAVIGATION.carnet,
        component: CarnetComponent,
      },
      {
        path: '**',
        redirectTo: NAVIGATION.carnet,
      },
    ],
  },
  {
    path: '**',
    redirectTo: NAVIGATION.login,
  },
];

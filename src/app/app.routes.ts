import { CanActivateFn, Router, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrarpageComponent } from './registrarpage/registrarpage.component';
import { homeRoutes } from './Modules/home/home.routes';
import { enrollmentRoutes } from './Modules/enrollment/enrollment.routes';
import { messageRoutes } from './Modules/message/message.routes';
import { accountRoutes } from './Modules/account/account.routes';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './auth.guard';
import { inject } from '@angular/core';
import { gradesRoutes } from './Modules/grades/grades.routes';


export const loginGuard: CanActivateFn = (route, state) => {
    const localData = localStorage.getItem('token');
    if (localData != null) {
      // If token exists, redirect to main page (or any other desired page)
      inject(Router).navigateByUrl('/main');
      return false;
    }
    return true;
  };

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [loginGuard]},
    {path: 'signup', component: SignupComponent},
    {path: 'main', component: RegistrarpageComponent, canActivate: [authGuard],
        children: [
            {
                path: 'home',
                loadChildren: () => import('./Modules/home/home.routes').then(r=>homeRoutes),
            },
            {
                path: 'enrollment',
                loadChildren: () => import('./Modules/enrollment/enrollment.routes').then(r=>enrollmentRoutes),
                
            },
            {
                path: 'grades',
                loadChildren: () => import('./Modules/grades/grades.routes').then(r=>gradesRoutes),
                
            },    
            {
                path: 'message',
                loadChildren: () => import('./Modules/message/message.routes').then(r=>messageRoutes),
                
            },
            {
                path: 'account',
                loadChildren: () => import('./Modules/account/account.routes').then(r=>accountRoutes),
                
            },
            {path: '', redirectTo: 'home', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];



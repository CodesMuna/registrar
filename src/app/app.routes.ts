import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrarpageComponent } from './registrarpage/registrarpage.component';
import { homeRoutes } from './Modules/home/home.routes';
import { enrollmentRoutes } from './Modules/enrollment/enrollment.routes';
import { messageRoutes } from './Modules/message/message.routes';
import { accountRoutes } from './Modules/account/account.routes';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'main', component: RegistrarpageComponent,
        children: [
            {
                path: 'home',
                loadChildren: () => import('./Modules/home/home.routes').then(r=>homeRoutes)
            },
            {
                path: 'enrollment',
                loadChildren: () => import('./Modules/enrollment/enrollment.routes').then(r=>enrollmentRoutes)
            },
            {
                path: 'message',
                loadChildren: () => import('./Modules/message/message.routes').then(r=>messageRoutes)
            },
            {
                path: 'account',
                loadChildren: () => import('./Modules/account/account.routes').then(r=>accountRoutes)
            },
            {path: '', redirectTo: 'home', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo: 'main', pathMatch: 'full'}
];

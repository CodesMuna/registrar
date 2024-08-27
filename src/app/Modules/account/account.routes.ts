import { Routes } from '@angular/router';
import { AccountpageComponent } from './accountpage/accountpage.component';
import { ViewComponent } from './view/view.component';

export const accountRoutes: Routes = [
    {path: 'accountpage', component: AccountpageComponent,
        children: [
            {path: 'view', component: ViewComponent},
            {path: '', redirectTo: 'view', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo:'accountpage', pathMatch: 'full'}
];
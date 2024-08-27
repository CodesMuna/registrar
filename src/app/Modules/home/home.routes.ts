import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { MainComponent } from './main/main.component';
import { InquiryComponent } from './inquiry/inquiry.component';

export const homeRoutes: Routes = [
    {path: 'homepage', component: HomepageComponent,
        children: [
            {path: 'inquiry', component: InquiryComponent},
            {path: '', redirectTo: 'inquiry', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo:'homepage', pathMatch: 'full'}
];
import { Routes } from '@angular/router';
import { GradespageComponent } from './gradespage/gradespage.component';
import { StudentlistComponent } from './studentlist/studentlist.component';
import { StudentgradesComponent } from './studentgrades/studentgrades.component';


export const gradesRoutes: Routes = [
    {path: 'gradespage', component: GradespageComponent,
        children: [
            {path: 'studentlist', component: StudentlistComponent},
            {path: 'studentgrades/:lrn/:syr', component: StudentgradesComponent},
            {path: '', redirectTo: 'studentlist', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo:'gradespage', pathMatch: 'full'}
];
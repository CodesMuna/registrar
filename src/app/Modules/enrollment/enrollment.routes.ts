import { Routes } from '@angular/router';
import { EnrollmentpageComponent } from './enrollmentpage/enrollmentpage.component';
import { ApprovalComponent } from './approval/approval.component';
import { MonitorComponent } from './monitor/monitor.component';
import { RosterComponent } from './roster/roster.component';
import { ViewRosterComponent } from './view-roster/view-roster.component';
import { RosteringComponent } from './rostering/rostering.component';
import { EnrollmentlistComponent } from './enrollmentlist/enrollmentlist.component';

export const enrollmentRoutes: Routes = [
    {path: 'enrollmentpage', component: EnrollmentpageComponent,
        children: [
            {path: 'enrollmentlist', component: EnrollmentlistComponent},
            {path: 'approval', component: ApprovalComponent},
            {path: 'monitor', component: MonitorComponent},
            {path: 'roster', component: RosterComponent},
            {path: 'rostering', component: RosteringComponent},
            {path: 'viewroster', component: ViewRosterComponent},
            {path: '', redirectTo: 'approval', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo:'enrollmentpage', pathMatch: 'full'}
];
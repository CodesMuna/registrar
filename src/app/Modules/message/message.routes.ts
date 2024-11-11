import { Routes } from '@angular/router';
import { MessagepageComponent } from './messagepage/messagepage.component';
import { SendComponent } from './send/send.component';
import { ViewComponent } from './view/view.component';
import { ReplaySubject } from 'rxjs';
import { ReplyComponent } from './reply/reply.component';


export const messageRoutes: Routes = [
    {path: 'messagepage', component: MessagepageComponent,
        children: [
            {path: 'messages', component: SendComponent, 
                children: [
                    {path: 'view/:sid', component: ViewComponent},
                ]
            },
            {path: 'reply', component: ReplyComponent},
            {path: '', redirectTo: 'messages', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo:'messagepage', pathMatch: 'full'}
];
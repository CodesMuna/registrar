import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { ViewComponent } from "../view/view.component";
import { SearchFilterPipe } from '../../../search-filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send',
  standalone: true,
  imports: [ViewComponent, RouterOutlet, RouterModule, SearchFilterPipe, FormsModule],
  templateUrl: './send.component.html',
  styleUrl: './send.component.css'
})
export class SendComponent implements OnInit{

  messages: any;
  conversation: any;
  keyword: any;
  sid: any;

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.getMessages()
  }

  getMessages(){
    this.conn.getMessages().subscribe((result: any) => {
      console.log(result)
      this.messages = result; 
    })
  }

  openConvo(sid: any) {
    this.conn.getConvo(sid).subscribe((result: any) => {
      this.route.navigate(['/main/message/messagepage/messages/view', sid])
      console.log(result);
      this.conversation = result;
    });
  }
  

}


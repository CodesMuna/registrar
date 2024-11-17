import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { ViewComponent } from "../view/view.component";
import { SearchFilterPipe } from '../../../search-filter.pipe';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-send',
  standalone: true,
  imports: [ViewComponent, RouterOutlet, RouterModule, SearchFilterPipe, FormsModule, MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './send.component.html',
  styleUrl: './send.component.css'
})
export class SendComponent implements OnInit{

  messages: any;
  conversation: any;
  keyword: any;
  inputClicked: boolean = false;
  sid: any;
  uid: any;
  stupar: any;

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.uid = localStorage.getItem('admin_id')
    this.getMessages()
    this.getStudPar()
  }

  onInputClick() {
    this.inputClicked = true; // Set to true when the input is clicked
    this.keyword = ''; // Clear the keyword if desired
  }

  onBackClick() {
    this.inputClicked = false; // Set to true when the input is clicked
    this.keyword = ''; // Clear the keyword if desired
  }

  getMessages(){
    console.log(this.uid)
    this.conn.getMessages(this.uid).subscribe((result: any) => {
      // console.log(result)
      this.messages = result; 
    })
  }

  getStudPar(){
    this.conn.getStudentParents().subscribe((result: any) => {
      console.log(result)
      this.stupar = result; 
    })
  }

  openConvo(sid: any, uid:any) {
    this.conn.getConvo(sid, uid).subscribe((result: any) => {
      this.route.navigate(['/main/message/messagepage/messages/view', sid])
      console.log(result);
      this.conversation = result;
    });
  }
  

}


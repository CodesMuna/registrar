import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { ViewComponent } from "../view/view.component";
import { SearchFilterPipe } from '../../../search-filter.pipe';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, SlicePipe } from '@angular/common';
import { ReplyComponent } from '../reply/reply.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-send',
  standalone: true,
  imports: [ViewComponent, RouterOutlet, RouterModule, SearchFilterPipe, FormsModule, MatButtonModule, MatDividerModule, MatIconModule, SlicePipe, CommonModule],
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


  private intervalId: any;
  private currentSid: any; // Store the current SID

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.uid = localStorage.getItem('admin_id')

    this.intervalId = setInterval(() => {
      this.getMessages();
    }, 10000)

    this.getMessages()
    this.getStudPar()
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ReplyComponent, {
      width:"500px",
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.messages.unshift(result);
      this.getMessages();
    });
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
      console.log(result)
      const uniqueMessages = [];
      const seenSenders = new Set();

      for (const msg of result) {
          if (!seenSenders.has(msg.sender_name)) {
              seenSenders.add(msg.sender_name);
              uniqueMessages.push(msg);
          }
      }

      this.messages = uniqueMessages; // Assign filtered messages to 'messages'
    })
  }

  getStudPar(){
    this.conn.getStudentParents().subscribe((result: any) => {
      // console.log(result)
      this.stupar = result; 
    })
  }

  // openConvo(sid: any, uid:any) {
  //   this.conn.getConvo(sid, uid).subscribe((result: any) => {
  //     this.route.navigate(['/main/message/messagepage/messages/view', sid])
  //     console.log(result);
  //     this.conversation = result;
  //   });
  // }

  markAsRead(sid: any){
    this.conn.markAsRead(sid).subscribe((result: any) => {
      console.log('Messages marked as read:', result.updated_count);
    })

    this.getMessages()
  }
  

}


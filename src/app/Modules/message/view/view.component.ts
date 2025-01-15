import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { PortalService } from '../../../portal.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  @ViewChild('messageInput') messageInput!: ElementRef;

  adjustInputHeight(input: HTMLTextAreaElement) {
    input.style.height = 'auto'; // Reset height to auto before calculation
    input.style.height = `${input.scrollHeight}px`; // Set the height to match the scroll height
  }

  convo: any = {};
  sid: any;
  uid: any;
  private intervalId: any;

  isLoadingConvo = true

  msgForm = new FormGroup({
    message_sender: new FormControl(localStorage.getItem('admin_id')),
    message_reciever: new FormControl(null),
    message: new FormControl(null)
  });

  constructor(
    private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  toggleTimeDisplay(message: any) {
    message.showTime = !message.showTime;
  }

  ngOnInit(): void {
    const uid = localStorage.getItem('admin_id');
    
    this.aroute.paramMap.pipe(
      switchMap(params => {
        const sid = params.get('sid');
        this.sid = sid;
        this.uid = uid;
        this.msgForm.get('message_reciever')?.setValue(this.sid);
        this.convo = {};
        return this.getConvo(sid, uid);
      })
    ).subscribe();
    
    this.intervalId = setInterval(() => {
      if (this.sid) {
        this.getConvo(this.sid, uid).subscribe();
      }
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getConvo(sid: any, uid: any) {
    // console.log("Fetching conversation with sid:", sid, "and uid:", uid);
    return this.conn.getConvo(sid, uid).pipe(
      tap(result => {
        // console.log("Received conversation:", result);
        this.convo = result;
        this.cdRef.detectChanges();
        this.isLoadingConvo = false
      })

      
    );
  }

  sendMessage(event: Event) {
    event.preventDefault(); // Prevent default form submission

    this.conn.sendMessage(this.msgForm.value).subscribe((result: any) => {
      this.getConvo(this.sid, this.uid).subscribe(); // Refresh conversation after sending
      this.msgForm.get('message')?.reset(); // Clear the message input after sending
    }, error => {
      console.error('Error sending message:', error); // Handle error if sending fails
    });
  }
}
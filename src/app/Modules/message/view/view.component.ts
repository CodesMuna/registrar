import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../../../search-filter.pipe';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SearchFilterPipe,],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit{

  convo: any;
  sid: any;
  aid: any;
  

  msgForm = new FormGroup({
    message_sender: new FormControl(localStorage.getItem('admin_id')),
    message_reciever: new FormControl(null),
    message: new FormControl(null)
  })

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.aroute.paramMap.subscribe(params => {
      const sid = params.get('sid');
      this.sid = sid;
      this.msgForm.get('message_reciever')?.setValue(this.sid);
      // this.msgForm.get('message_sender')?.setValue(1);
      this.getConvo(sid);
    });
  }

  getConvo(sid: any){
    this.conn.getConvo(sid).subscribe((result: any) => {
      console.log(result);
      this.convo = result;
    })
  }

  sendMessage(){
    console.log(this.msgForm.value);
    this.conn.sendMessage(this.msgForm.value).subscribe((result: any) => {
      console.log(result);
      // You can also update the conversation list here
      this.getConvo(this.aroute.snapshot.paramMap.get('sid'));
      this.msgForm.get('message')?.reset(); 
    })
  }

}

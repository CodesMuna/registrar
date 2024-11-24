import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { SendComponent } from '../send/send.component';
import { MatButtonModule } from '@angular/material/button';
import { PortalService } from '../../../portal.service';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatDialogActions,
    MatButtonModule,
    CommonModule
],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css'
})
export class ReplyComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SendComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  
  myControl = new FormControl('');
  recipients: any[] = [];

  msgForm = new FormGroup({
    message_sender: new FormControl(localStorage.getItem('admin_id')),
    message_reciever: new FormControl(''),
    message: new FormControl('')
  })

  constructor(private recipientService: PortalService) {}

  ngOnInit(): void {
    // Fetch the recipients from the backend
    this.recipientService.getRecipients().subscribe((data) => {
      this.recipients = data;
      console.log(this.recipients); 
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

    filteredOptions: Observable<any[]> = this.myControl.valueChanges.pipe(
      startWith(''), 
      map(value => this._filter(value || '')) 
  );

  private _filter(value: string): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.recipients.filter(option =>
      option.receiver_name.toLowerCase().includes(filterValue)
    );
  }
  onOptionSelected(option: any): void {
    if (option && option.receiver_id) {
      this.msgForm.patchValue({
        message_reciever: option.receiver_id 
      });
      console.log('Form after patching:', this.msgForm.value); 
      this.myControl.setValue(option.receiver_name);
    } else {
      console.error('Selected option does not have receiver_id:', option);
    }
  }
    onNoClick(){
      this.dialogRef.close(); 
    }
    submit(): void {
      if (this.msgForm.valid) {
        const messageData = {
          message_sender: this.msgForm.value.message_sender,
          message_reciever: this.msgForm.value.message_reciever,
          message: this.msgForm.value.message,
          message_date: new Date().toISOString().split('T')[0], // Get current date in 'YYYY-MM-DD' format
        };
    
        // Make HTTP POST request to send the message
        this.recipientService.composeMessage(messageData).subscribe({
          next: (response) => {
            console.log('Message sent successfully:', response);
            // Close the dialog and pass the message back to SendComponent
            this.dialogRef.close(messageData);
            
          },
          error: (error) => {
            console.error('Error sending message:', error);
          }
        });
      } else {
        console.error('Form is not valid');
      }
    }
    
  }
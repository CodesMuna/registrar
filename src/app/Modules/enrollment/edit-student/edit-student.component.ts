import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PortalService } from '../../../portal.service';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [  MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './edit-student.component.html',
  styleUrl: './edit-student.component.css'
})
export class EditStudentComponent {

  profileForm = new FormGroup({
    admin_id: new FormControl('',),
    fname: new FormControl(''),
    mname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    newPassword: new FormControl(''),
    // newPassword_confirmation: new FormControl(''),
    role: new FormControl(''),

  })
  
  constructor(
    private conn: PortalService,
    private route: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eid: any }
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }
}

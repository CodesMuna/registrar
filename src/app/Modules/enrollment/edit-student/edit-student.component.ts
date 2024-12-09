import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [  MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule ],
  templateUrl: './edit-student.component.html',
  styleUrl: './edit-student.component.css'
})
export class EditStudentComponent {
  constructor(
    private conn: PortalService,
    private route: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eid: any }
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }
}

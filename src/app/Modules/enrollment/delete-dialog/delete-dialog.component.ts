import { Component, Inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PortalService } from '../../../portal.service';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
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

  delete(): void {
    this.conn.deleteEnrollment(this.data.eid).subscribe((result: any) => {
      console.log('Deleted enrollment ID:', this.data.eid);
      this.dialogRef.close(true); // Close the dialog and return true to indicate deletion was confirmed
    });
  }
}

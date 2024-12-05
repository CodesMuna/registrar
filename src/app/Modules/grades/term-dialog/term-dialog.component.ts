import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { PortalService } from '../../../portal.service';

@Component({
  selector: 'app-term-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, MatSlideToggleModule],
  templateUrl: './term-dialog.component.html',
  styleUrls: ['./term-dialog.component.css']
})
export class TermDialogComponent implements OnInit {
  toggleStates: { [key: string]: boolean } = {
    'First Quarter': false,
    'Second Quarter': false,
    'Third Quarter': false,
    'Fourth Quarter': false,
    'Midterm': false,
    'Final': false
  };

  constructor(
    private conn: PortalService,
    private route: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TermDialogComponent>, // Corrected to use TermDialogComponent
    @Inject(MAT_DIALOG_DATA) public data: { eid: any }
  ) {}

  ngOnInit() {
    this.loadGrades(); // Load grades on initialization
  }

  loadGrades() {
    this.conn.getGradesTP().subscribe((grades: any[]) => {
      grades.forEach(grade => {
        // Set toggle state based on permission
        this.toggleStates[grade.term] = grade.permission === 'on';
      });
    });
  }

  onToggleChange(term: string, event: any) {
    const newPermission = event.checked ? 'on' : 'none';

    // Call enableTerm or disableTerm API based on the new permission state
    if (newPermission === 'on') {
      this.conn.enableTerm({ term, permission: newPermission }).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error('Error enabling term:', error);
        }
      );
    } else {
      this.conn.disableTerm({ term, permission: newPermission }).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error('Error disabling term:', error);
        }
      );
    }

    // Save the current toggle states to local storage
    this.saveToggleStates();
  }


  loadToggleStates() {
    const savedStates = localStorage.getItem('toggleStates');
    if (savedStates) {
      this.toggleStates = JSON.parse(savedStates);
    }
  }

  saveToggleStates() {
    localStorage.setItem('toggleStates', JSON.stringify(this.toggleStates));
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
import {ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { EditStudentComponent } from '../edit-student/edit-student.component';

@Component({
  selector: 'app-approval',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatToolbar,
    MatTabsModule,
    MatIconModule, MatChipsModule, MatSelectModule,MatDatepickerModule, MatSidenavModule, MatTableModule, MatDividerModule, MatButtonModule, RouterModule],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ApprovalComponent implements OnInit{
  enrolinfo: any;
  eid: any;
  studentInfo: any;

  studentForm = new FormGroup({
    LRN: new FormControl('',),
    fname: new FormControl(''),
    mname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    oldPassword: new FormControl(null),
    newPassword: new FormControl(''),
    newPassword_confirmation: new FormControl(''),
    role: new FormControl(''),
  })

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const eid = this.aroute.snapshot.paramMap.get('lrn');
    this.getStudentInfo(eid);
    
  }

  getStudentInfo(eid: any) {
    this.conn.getEnrollmentInfo(eid).subscribe((result: any) => {
      this.studentInfo = result;
      console.log(this.studentInfo);
    });
  }

  approve(eid: any){
    this.conn.approval(eid).subscribe((result: any) => {
      console.log(eid)
      this.route.navigate(['/main/enrollment/enrollmentpage/monitor'])
    })
  }

  deleteEnrollment(eid: any){
    this.conn.deleteEnrollment(eid).subscribe((result: any) => {
      console.log(eid)
      this.route.navigate(['/main/enrollment/enrollmentpage/monitor'])
    })
  }

  openMessage(eid: any): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { eid } // Pass the enrollment ID to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle any actions after the dialog is closed, if needed
        this.deleteEnrollment(eid);
      } 
    });
  }

  openEdit(eid: any) {
    const dialogRef = this.dialog.open(EditStudentComponent, {
      data: { eid } // Pass the enrollment ID to the dialog
    });
  }
  
}

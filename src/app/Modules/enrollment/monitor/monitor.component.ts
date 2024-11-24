import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SearchFilterPipe } from '../../../search-filter.pipe';


@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, CommonModule, MatButtonModule, RouterModule, SearchFilterPipe],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent implements OnInit{
  classes: string[] = [
    'All',
    'PreReg',
    'Payment',
    'Officially',
  ];
  

  enrollments: any;
  keyword: any;
  selectedProgress: string = 'All';

  ngOnInit(): void {
    this.conn.getEnrollments().subscribe((result: any) => {
      this.enrollments = result;
      // this.enrollments.forEach((enrollment:any) => {
        // console.log(enrollment);
      // });
    })
  }

  constructor(private conn: PortalService,
    private route: Router,
  ) { }

  // getEnrollments(): void {
  //   this.conn.getEnrollments().subscribe((result: any) => {
  //     this.enrollments = result;
  //     // this.enrollments.forEach((enrollment:any) => {
  //       // console.log(enrollment);
  //     // });
  //   })
    
  // }

  getFilteredEnrollments() {
    switch (this.selectedProgress) {
      case 'All':
        return this.enrollments;
      case 'PreReg':
        return this.enrollments.filter((enrollment: any) => enrollment.regapproval_date == null && enrollment.payment_approval == null);
      case 'Payment':
        return this.enrollments.filter((enrollment: any) => enrollment.regapproval_date == null && enrollment.payment_approval !== null);
      case 'Officially':
        return this.enrollments.filter((enrollment: any) => enrollment.regapproval_date !== null && enrollment.payment_approval !== null);
      default:
        return []; // Return an empty array if selectedProgress does not match any of the conditions
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { PortalService } from '../../../portal.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// interface User {
//   id: number;
//   name: string;
//   // add other user properties as needed
// }

@Component({
  selector: 'app-inquiry',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inquiry.component.html',
  styleUrl: './inquiry.component.css'
})
export class InquiryComponent implements OnInit{
  inquries: any;
  uid: any;
  
  enrollments: any;
  totalEnrollments: any;
  pendingEnrollees: any;
  officiallyEnrolled: any;

  constructor(private conn: PortalService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.uid = localStorage.getItem('admin_id');
    console.log(this.uid);
    this.getInquiries();
    this.getEnrollments();
  }

  getInquiries(){
    this.conn.getInquiries(this.uid).subscribe((result: any) => {
      this.inquries = result;
      this.inquries.forEach((inquiry:any) => {
        console.log(inquiry);
      });
    })
  }

  getEnrollments(){
    this.conn.getEnrollments().subscribe((results: any) => {
      this.enrollments = results;
      // console.log(this.enrollments)
      this.totalEnrollments = this.enrollments.length
      this.pendingEnrollees = this.enrollments.filter((pndng: any) => pndng.payment_approval === null || pndng.regapproval_date === null ).length
      this.officiallyEnrolled = this.enrollments.filter((ofc: any) => ofc.regapproval_date != null).length

      console.log(this.totalEnrollments)
      console.log(this.pendingEnrollees)
      console.log(this.officiallyEnrolled)
    })
  }

  monitor(){
    this.route.navigate(['/main/enrollment/enrollmentpage/monitor']);
  }

}

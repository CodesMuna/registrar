import { Component, OnInit } from '@angular/core';
import { PortalService } from '../../../portal.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inquiry',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inquiry.component.html',
  styleUrl: './inquiry.component.css'
})
export class InquiryComponent implements OnInit{
  inquiries: any;
  uid: any;
  currentDate: Date = new Date();
  
  enrollments: any;
  totalEnrollments: any;
  pendingEnrollees: any;
  officiallyEnrolled: any;

  isLoadingInquiries = true;
  isLoadingEnrollments = true;

  currentSY: any;

  constructor(private conn: PortalService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth(); // January is 0, December is 11

    let nextYear: number;

    if (currentMonth >= 5) { // June (5) or later
      nextYear = currentYear + 1;
    } else { // Before June
      nextYear = currentYear - 1;
    }

    // Format school year as "YYYY-YYYY"
    this.currentSY = currentYear + '-' + nextYear
  
    this.uid = localStorage.getItem('admin_id');
    console.log(this.uid);
    this.getInquiries();
    this.getEnrollments();
  }

  getInquiries(){
    this.conn.getInquiries(this.uid).subscribe((result: any) => {
      this.inquiries = result;
      this.inquiries.forEach((inquiry:any) => {
        // console.log(inquiry);

        const uniqueMessages = [];
        const seenSenders = new Set();
  
        for (const msg of result) {
            if (!seenSenders.has(msg.sender_name)) {
                seenSenders.add(msg.sender_name);
                uniqueMessages.push(msg);
            }
        }
  
        this.inquiries = uniqueMessages;
      });
      this.isLoadingInquiries = false;
    })
  }

  getEnrollments(){
    this.conn.getEnrollments().subscribe((results: any) => {
      this.enrollments = results;
      this.totalEnrollments = this.enrollments.length
      this.pendingEnrollees = this.enrollments.filter((pndng: any) => pndng.payment_approval === null || pndng.regapproval_date === null ).length
      this.officiallyEnrolled = this.enrollments.filter((ofc: any) => ofc.regapproval_date != null).length

      console.log(this.totalEnrollments)
      console.log(this.pendingEnrollees)
      console.log(this.officiallyEnrolled)

      this.isLoadingEnrollments = false;
    })
    
  }

  monitor(){
    this.route.navigate(['/main/enrollment/enrollmentpage/monitor']);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { SearchFilterPipe } from '../../../search-filter.pipe';

@Component({
  selector: 'app-rostering',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatListModule, SearchFilterPipe],
  templateUrl: './rostering.component.html',
  styleUrl: './rostering.component.css'
})
export class RosteringComponent implements OnInit{
  cid: any;
  rosterInfo: any;
  classInfo: any;
  showSearchEnrolees = false;
  showSearchRoster = false;
  lrn: any;
  enrolees: any;

  enkey: any;
  roskey: any;

  totalStudents:any;
  maleStudents:any;
  femaleStudents:any;

  maleEnrolees: any;
  femaleEnrolees: any;
  totalEnrolees: any;

  classIds: any;
  classDetails: any[] = [];

  lvlform = new FormControl({
    gradelevel: new FormControl(null)
  })
  
  

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.aroute.params.subscribe(params => {
      this.classIds = params['classIds'] ? params['classIds'].split(',') : []; // Split the string into an array
      console.log('Retrieved Class IDs:', this.classIds); // Use the class IDs as needed

      // Fetch class details for all classIds at once
      this.getClassInfo(this.classIds);
    });

    const cid = this.aroute.snapshot.paramMap.get('cid')
    this.getRosterInfo();
    // this.getClass(cid);
    // this.getEnrolees(); // Call getEnrolees() separately
  }

  getClassInfo(classIds: string[]) {
    this.conn.getClassInfo(classIds).subscribe((result: any) => {
        this.classDetails = result; // Store the class details
        console.log('Class Details:', this.classDetails); // Log the class details for debugging

        // Assuming classDetails is an array and you want to get the grade level from the first class
        if (this.classDetails.length > 0) {
            const gradeLevel = this.classDetails[0].grade_level; // Adjust this based on your actual data structure
            this.getEnrolees(gradeLevel); // Call getEnrolees with the grade level
        }
    });
}

getEnrolees(gradeLevel: any) {
    this.conn.getEnrolees(gradeLevel).subscribe((result: any) => {
        this.enrolees = result;
        console.log(this.enrolees);
        this.maleEnrolees = result.filter((enrolee: any) => enrolee.gender === 'Male').length;
        this.femaleEnrolees = result.filter((enrolee: any) => enrolee.gender === 'Female').length;
        this.totalEnrolees = result.length;
    });
}

  addStudent(lrn: any) {
    const classIds = this.classIds; // Assuming classIds is an array of IDs
    this.conn.addStudent(classIds, lrn).subscribe((result: any) => {
        console.log(result);
        this.getRosterInfo(); // Get roster info for the first class ID
        this.getEnrolees(this.classDetails[0].grade_level); // Refresh the enrolees
    }, error => {
        console.error('Error adding students:', error);
    });
  }

  removeStudent(lrn: string) {
    this.conn.removeStudent(lrn).subscribe((result: any) => {
        console.log(result);
        this.getRosterInfo(); // Refresh the roster info
        this.getEnrolees(this.classDetails[0].grade_level); // Refresh the enrolees
    }, error => {
        console.error('Error removing student:', error);
    });
}
  
  getRosterInfo() {
    this.conn.getRosterInfo(this.classIds).subscribe((result: any) => {
        // Create a Set to track unique LRNs
        const uniqueLRNs = new Set();
        
        // Filter the result to only include unique students based on LRN
        this.rosterInfo = result.filter((student: any) => {
            if (!uniqueLRNs.has(student.LRN)) {
                uniqueLRNs.add(student.LRN); // Add LRN to the Set
                return true; // Keep this student
            }
            return false; // Skip this student
        });

        // Calculate counts for male and female students
        this.maleStudents = this.rosterInfo.filter((student: any) => student.gender === 'Male').length;
        this.femaleStudents = this.rosterInfo.filter((student: any) => student.gender === 'Female').length;
        this.totalStudents = this.rosterInfo.length; // Update total students count
    }, error => {
        console.error('Error fetching roster info:', error);
    });
  }
  
}

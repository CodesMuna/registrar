import { CommonModule } from '@angular/common';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { SearchFilterPipe } from '../../../search-filter.pipe';

@Component({
  selector: 'app-studentlist',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, CommonModule, MatButtonModule, SearchFilterPipe],
  templateUrl: './studentlist.component.html',
  styleUrl: './studentlist.component.css'
})
export class StudentlistComponent implements OnInit{

  gradelevel: string[] = [];
  sections: string[] = [];
  strands: string[] = [];
  subjects: string[] = [];

  genders: string[] = [
    'All',
    'Male',
    'Female'
  ]

  selectedLevel: string = "";
  selectedSection: string = "";
  selectedStrand: string = "";
  selectedSubject: string = "";
  selectedGender: string = "All";

  rosters: any;
  filteredRosters: any;
  classId: any;
  classes: any;

  totalStudents:any;
  maleStudents:any;
  femaleStudents:any;
  
  keyword: any;
  enrollments: any;

  showSearchRoster = false;

  // ngOnInit(): void {
  //   this.getAllEnrollments()
  // }

  constructor(private conn: PortalService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.conn.getClasses().subscribe((result: any) => {
      console.log(result)
      const uniqueGradeLevels = Array.from(new Set(result.map((lvl: any) => lvl.grade_level))).map((x) => x as string);
      const uniqueSections = Array.from(new Set(result.map((sect: any) => sect.section_name))).map((x) => x as string);
      const uniqueStrands = Array.from(new Set(result.map((strnd: any) => strnd.strand))).map((x) => x as string);
      const uniqueSubjects = Array.from(new Set(result.map((sbjct: any) => sbjct.subject_name))).map((x) => x as string);
      
      this.gradelevel = uniqueGradeLevels;
      this.sections = uniqueSections;
      this.strands = uniqueStrands;
      this.subjects = uniqueSubjects;
      this.classes = result; // Assign the result to this.classes

      if (this.gradelevel.length > 0) {
        this.selectedLevel = this.gradelevel[0];
      }
      if (this.sections.length > 0) {
        this.selectedSection = this.sections[0]; 
      }
      if (this.sections.length > 0) {
        this.selectedSubject= this.subjects[0]; 
      }

      this.getFilteredRosters(); 
      this.getClassId();
    });
    // this.getRosters();
    // this.getFilteredRosters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedLevel'] || changes['selectedSection'] || changes['selectedStrand'] || changes['selectedGender']) {
        this.getFilteredRosters();
    }
}



getFilteredRosters() {
  const params: any = {
    gradelevel: this.selectedLevel,
    section: this.selectedSection,
    subject: this.selectedSubject
  };

  console.log('Selected Subject:', this.selectedSubject);

  if (this.selectedLevel === '11' || this.selectedLevel === '12') {
    params.strand = this.selectedStrand;
  }

  if (this.selectedGender === 'Male' || this.selectedGender === 'Female') {
    params.gender = this.selectedGender;
  }

  this.conn.getClassGrades(params).subscribe((result: any) => {
    this.rosters = result;
    this.maleStudents = result.filter((student: any) => student.gender === 'Male').length;
    this.femaleStudents = result.filter((student: any) => student.gender === 'Female').length;
    this.totalStudents = result.length;
    this.getClassId();
    console.log(this.rosters);
  });
}

getClassId() {
  if (this.classes && this.classes.length > 0) {
    const classInfo = this.classes.find((classInfo: any) => classInfo.section_name === this.selectedSection && classInfo.grade_level === this.selectedLevel);
    if (classInfo) {
      this.classId = classInfo.class_id;
    }
  }
}

updateRosters() {
  this.getFilteredRosters();
  this.getClassId();
}

gradeLevelChange(event: any) {
  this.selectedLevel = event.target.value;
  this.getClassId();
}

  // getAllEnrollments(): void {
  //   this.conn.getAllEnrollments().subscribe((result: any) => {
  //     this.enrollments = result;
  //     // this.enrollments.forEach((enrollment:any) => {
  //     //   enrollment.student = enrollment.student.fname + ' ' + enrollment.student.mname + ' ' + enrollment.student.lname;
  //     // });
  //   })
  // }
}

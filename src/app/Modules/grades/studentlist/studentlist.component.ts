import { CommonModule } from '@angular/common';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
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

  gradelevel: any[] = [];
  sections: any[] = [];
  strands: any[] = [];
  subjects: any[] = [];

  genders: string[] = [
    'All',
    'Male',
    'Female'
  ]

  selectedLevel: string = "";
  selectedSection: string = "";
  selectedStrand: string = "-";
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
        const uniqueGradeLevels = Array.from(new Set(result.map((lvl: any) => lvl.grade_level)));
        const uniqueStrands = Array.from(new Set(result.map((strnd: any) => strnd.strand)));
        const uniqueSections = Array.from(new Set(result.map((sect: any) => sect.section_name))).map((x) => x as string);
        
        this.gradelevel = uniqueGradeLevels;
        this.strands = uniqueStrands;
        this.sections = uniqueSections;

        if (this.gradelevel.length > 0) {
            this.selectedLevel = this.gradelevel[0];
            this.getSubjects(this.selectedLevel, this.selectedStrand); // Get sections for the default selected level
            this.getSections(this.selectedLevel, this.selectedStrand);
        }
        if (this.gradelevel.length > 0) {
            this.selectedSection = this.sections[0];
        }

        // console.log(this.selectedLevel);
        // console.log(this.selectedSection);
        // console.log(this.selectedStrand);

        this.getFilteredRosters(); 
        this.getClassId();
    });
}

  getSections(gradeLevel: string, strand: any) {
    this.conn.getSectionsByGradeLevel(gradeLevel, strand).subscribe((result: any) => {
        console.log('Sections fetched:', result);
        // Filter the sections based on the selected strand and grade level
        this.sections = result.filter((sect: any) => sect.strand === strand && sect.grade_level === gradeLevel);

        if (this.sections.length > 0) {
            this.selectedSection = this.sections[0].section_name; // Set to the first section
        } else {
            this.selectedSection = ''; // Reset if no sections are available
        }
        this.getFilteredRosters(); // Update rosters based on the new section
    });
  }

  getSubjects(gradeLevel: string, strand: any) {
    this.conn.getSubjects(gradeLevel, strand).subscribe((result: any) => {
        console.log('Subjects fetched:', result);
        // Filter the subjects based on the selected strand and grade level
        this.subjects = result.filter((sub: any) => 
            sub.strand === strand && 
            sub.grade_level === gradeLevel
        );

        if (this.subjects.length > 0) {
            this.selectedSubject = this.subjects[0].subject_name; // Set to the first subject
        }

        this.getFilteredRosters(); // Update rosters based on the new section
    });
  }

  gradeLevelChange(event: MatSelectChange) {
    this.selectedLevel = event.value; // Update selected level

    if (parseInt(this.selectedLevel) >= 7 && parseInt(this.selectedLevel) <= 10) {
        this.selectedStrand = "-"; // Set selectedStrand to "-"
    } else {
        this.selectedStrand = this.strands.length > 0 ? this.strands[1] : ""; // Set to first strand if available
    }

    this.getSubjects(this.selectedLevel, this.selectedStrand); // Fetch sections for the new level, strand, and subject
    this.getSections(this.selectedLevel, this.selectedStrand);
  }

  strandChange(event: MatSelectChange){
    this.selectedStrand = event.value

    this.getSubjects(this.selectedLevel, this.selectedStrand);
    this.getSections(this.selectedLevel, this.selectedStrand);
  } 

  subjectChange(event: MatSelectChange) {
    this.selectedSubject = event.value; // Update selected subject

    this.getSubjects(this.selectedLevel, this.selectedStrand); // Fetch sections for the new level, strand, and subject
    this.getSections(this.selectedLevel, this.selectedStrand);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedLevel'] || changes['selectedSection'] || changes['selectedStrand'] || changes['selectedGender'] ) {
        this.getFilteredRosters();
    }
  }

  isDropdownVisible: boolean = false;

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
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
      // console.log(this.rosters);
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

  permit(gid: any){
    this.conn.permit(gid).subscribe((result: any) => {
      console.log(result)
    })
  }

  decline(gid: any){
    this.conn.decline(gid).subscribe((result: any) => {
      console.log(result)
    })
  }
 
}

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
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { TermDialogComponent } from '../term-dialog/term-dialog.component';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-studentlist',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, CommonModule, MatButtonModule, SearchFilterPipe, MatSlideToggleModule, MatGridListModule],
  templateUrl: './studentlist.component.html',
  styleUrl: './studentlist.component.css'
})
export class StudentlistComponent implements OnInit{

  gradelevel: any[] = [];
  sections: any[] = [];
  strands: any[] = [];
  subjects: any[] = [];
  semester: any [] = [];

  genders: string[] = [
    'All',
    'Male',
    'Female'
  ]

  jhTerms: string[] = [
    '1st Quarter',
    '2nd Quarter',
    '3rd Quarter',
    '4th Quarter'
  ]

  selectedLevel: string = "";
  selectedSection: string = "";
  selectedStrand: string = "-";
  selectedSem: any ;
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
  dropdownVisibility: { [key: string]: boolean } = {};

  isLoadingRosterGrade = true;

  isSlideToggleVisible = false;

  private intervalId: any;

  constructor(private conn: PortalService,
    private route: Router,
    private dialog: MatDialog
  ) { }

  currentDate: Date = new Date();
  currentSY: any;

  ngOnInit(): void {
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth(); // January is 0, December is 11

    let nextYear: number;

    if (currentMonth >= 4) { // June (5) or later
      nextYear = currentYear + 1;
    } else { // Before June
      nextYear = currentYear - 1;
    }

    // Format school year as "YYYY-YYYY"
    this.currentSY = currentYear + '-' + nextYear

    this.conn.getClasses().subscribe((result: any) => {
      const uniqueGradeLevels = Array.from(new Set(result.map((lvl: any) => lvl.grade_level))).sort((a: any, b: any) => a - b);
        const uniqueStrands = Array.from(new Set(result.map((strnd: any) => strnd.strand)));
        const uniqueSem = Array.from(new Set(result.map((sem: any) => sem.semester)));
        const uniqueSections = Array.from(new Set(result.map((sect: any) => sect.section_name))).map((x) => x as string);
        
        
        this.gradelevel = uniqueGradeLevels;
        this.strands = uniqueStrands;
        this.sections = uniqueSections;
        this.semester =uniqueSem;

        if (this.gradelevel.length > 0) {
            this.selectedLevel = this.gradelevel[0];
            this.selectedSem = this.semester[0];
            this.getSubjects(this.selectedLevel, this.selectedStrand, this.selectedSem); // Get sections for the default selected level
            this.getSections(this.selectedLevel, this.selectedStrand);
        }

        this.getFilteredRosters(); 
        this.getClassId();

    });
}
  getClasses() {
    throw new Error('Method not implemented.');
  }

  getSections(gradeLevel: string, strand: any) {
    this.conn.getSectionsByGradeLevel(gradeLevel, strand).subscribe((result: any) => {
        
        // Filter the sections based on the selected strand and grade level
        this.sections = result.filter((sect: any) => 
          sect.strand === strand && 
          sect.grade_level === gradeLevel
        );

        if (this.sections.length > 0) {
            this.selectedSection = this.sections[0].section_name; // Set to the first section
        } 
        this.getFilteredRosters(); // Update rosters based on the new section
    });
  }

  getSubjects(gradeLevel: string, strand: any, semester: any) {
    console.log('Fetching subjects with:', { gradeLevel, strand, semester });
    this.conn.getSubjects(gradeLevel, strand, semester).subscribe((result: any) => {
        // Filter subjects based on the selected strand, grade level, and semester
        this.subjects = result.filter((sub: any) => 
            sub.strand === strand && 
            sub.grade_level === gradeLevel &&
            sub.semester === semester
        );

        // Reset selected subject if no subjects are available
        if (this.subjects.length > 0) {
            this.selectedSubject = this.subjects[0].subject_name; // Set to the first subject if available
        } else {
            this.selectedSubject = ""; // Reset if no subjects are available
        }

        // Update rosters based on the new subject
        this.getFilteredRosters();
    });
}

  gradeLevelChange(event: MatSelectChange) {
    this.selectedLevel = event.value; // Update selected level

    if (parseInt(this.selectedLevel) >= 7 && parseInt(this.selectedLevel) <= 10) {
        this.selectedStrand = "-"; // Set selectedStrand to "-"
        this.selectedSem = null; 
    } else {
        this.selectedSem = this.semester.length > 0 ? this.semester[1] : "";
        this.selectedStrand = this.strands.length > 0 ? this.strands[1] : ""; // Set to first strand if available
    }

    this.getSubjects(this.selectedLevel, this.selectedStrand, this.selectedSem); // Fetch sections for the new level, strand, and subject
    this.getSections(this.selectedLevel, this.selectedStrand);
  }

  strandChange(event: MatSelectChange){
    this.selectedStrand = event.value

    this.getSubjects(this.selectedLevel, this.selectedStrand, this.selectedSem);
    this.getSections(this.selectedLevel, this.selectedStrand);
  } 

  semChange(event: MatSelectChange) {
    this.selectedSem = event.value; // Update selected semester

    // Reset selected subject when semester changes
    this.selectedSubject = ""; // Reset selected subject

    // Fetch subjects for the new semester, level, and strand
    this.getSubjects(this.selectedLevel, this.selectedStrand, this.selectedSem);
}

  subjectChange(event: MatSelectChange) {
    this.selectedSubject = event.value; // Update selected subject

    this.getSubjects(this.selectedLevel, this.selectedStrand, this.selectedSem); // Fetch sections for the new level, strand, and subject
    this.getSections(this.selectedLevel, this.selectedStrand);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedLevel'] || changes['selectedSection'] || changes['selectedStrand'] || changes['selectedGender'] ) {
        this.getFilteredRosters();
    }
  }

  isDropdownVisible: boolean = false;

  toggleDropdown(rosterId: string) {
    // Toggle the visibility for a specific roster item
    this.dropdownVisibility[rosterId] = !this.dropdownVisibility[rosterId];
  }

  getFilteredRosters() {
    const params: any = {
      gradelevel: this.selectedLevel,
      section: this.selectedSection,
      subject: this.selectedSubject,
      // semester: this.selectedSem
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

    this.isLoadingRosterGrade = false;

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

      this.dropdownVisibility[gid] = false;

      this.getFilteredRosters();
      this.getClassId();
    })
  }

  decline(gid: any){
    this.conn.decline(gid).subscribe((result: any) => {
      console.log(result)

      this.dropdownVisibility[gid] = false;

      this.getFilteredRosters();
      this.getClassId();
    })
  }

  enableTerm(term: any){
    this.conn.enableTerm(term).subscribe((result: any) => {
      console.log(term)
      console.log(result)
    })
  }

  disableTerm(term: any){
    this.conn.disableTerm(term).subscribe((result: any) => {
      console.log(result)
    })
  }

  toggleSlideToggle() {
    this.isSlideToggleVisible = !this.isSlideToggleVisible;
  }

  openConfig(): void {
    const dialogRef = this.dialog.open(TermDialogComponent, {
      // data: { eid } // Pass the enrollment ID to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle any actions after the dialog is closed, if needed
        // this.deleteEnrollment(eid);
      }
    });
  }

  calculateAverage(grade1: number, grade2: number, grade3: number, grade4: number): number {
    const grades = [grade1, grade2, grade3, grade4];
    // Filter out invalid or undefined grades
    const validGrades = grades.filter(grade => grade >= 60 && grade <= 99);
    // Calculate the average if there are valid grades
    return validGrades.length > 0 
    ? Math.ceil(validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length)
    : 0;
  }

  calculateAveragee(grade1: number, grade2: number): number {
    const grades = [grade1, grade2];
    // Filter out invalid or undefined grades
    const validGrades = grades.filter(grade => grade >= 60 && grade <= 99);
    // Calculate the average if there are valid grades
    return validGrades.length > 0 
    ? Math.ceil(validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length)
    : 0;
  }
 
}

import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { SearchFilterPipe } from '../../../search-filter.pipe';

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, SearchFilterPipe],
  templateUrl: './roster.component.html',
  styleUrl: './roster.component.css'
})
export class RosterComponent implements OnInit{
  keyword: any;

  gradelevel: any[] = [];
  sections: any[] = [];
  strands: any[] = [];
  

  genders: string[] = [
    'All',
    'Male',
    'Female'
  ]

  selectedLevel: string = "";
  selectedSection: string = "";
  selectedStrand: string = "-";
  selectedGender: string = "All";
  

  showSearchRoster = false;

  hover: boolean = false;
  
  rosters: any;
  filteredRosters: any;
  classId: any;
  classes: any[] = [];

  totalStudents:any;
  maleStudents:any;
  femaleStudents:any;

  classIds: any[] = [];

  isLoadingRoster = true;

  currentDate: Date = new Date();
  currentSY: any;

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router,
  ) { }
  
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

    this.aroute.params.subscribe(params => {
        const classIds = params['classIds'].split(',');
        this.classIds = classIds;
        // console.log('Retrieved Class Ids', classIds);
    });

    this.conn.getClasses().subscribe((result: any) => {
        this.classes = result;

        // Get unique grade levels and sort them in ascending order
        const uniqueGradeLevels = Array.from(new Set(result.map((lvl: any) => lvl.grade_level))).sort((a: any, b: any) => a - b);
        
        const uniqueStrands = Array.from(new Set(result.map((strnd: any) => strnd.strand)));
        const uniqueSections = Array.from(new Set(result.map((sect: any) => sect.section_name))).map((x) => x as string);
        
        this.gradelevel = uniqueGradeLevels;
        this.strands = uniqueStrands;
        this.sections = uniqueSections;

        if (this.gradelevel.length > 0) {
            this.selectedLevel = this.gradelevel[0];
            this.getSections(this.selectedLevel, this.selectedStrand); // Get sections for the default selected level
        }
        if (this.gradelevel.length > 0) {
            this.selectedSection = this.sections[0];
        }
    });
}

  getSections(gradeLevel: string, strand: any) {
    this.conn.getSectionsByGradeLevel(gradeLevel, strand).subscribe((result: any) => {
        // console.log('Sections fetched:', result);
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

  gradeLevelChange(event: MatSelectChange) {
    this.selectedLevel = event.value; // Update selected level

    if (parseInt(this.selectedLevel) >= 7 && parseInt(this.selectedLevel) <= 10) {
        this.selectedStrand = "-"; // Set selectedStrand to "-"
    } else {
        this.selectedStrand = this.strands.length > 0 ? this.strands[1] : ""; // Set to first strand if available
    }

    this.getSections(this.selectedLevel, this.selectedStrand); // Fetch sections for the new level and strand
    // console.log(this.selectedLevel);
    // console.log(this.selectedSection);
    // console.log(this.selectedStrand);
  }

  strandChange(event: MatSelectChange){
    this.selectedStrand = event.value

    this.getSections(this.selectedLevel, this.selectedStrand);
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
  };

  if (this.selectedLevel === '11' || this.selectedLevel === '12') {
    params.strand = this.selectedStrand;
  }

  if (this.selectedGender === 'Male' || this.selectedGender === 'Female') {
    params.gender = this.selectedGender;
  }

  this.conn.getFilteredRosters(params).subscribe((result: any) => {
    const uniqueLRNs = new Set();
        
        // Filter the result to only include unique students based on LRN
        this.rosters = result.filter((student: any) => {
            if (!uniqueLRNs.has(student.LRN)) {
                uniqueLRNs.add(student.LRN); // Add LRN to the Set
                return true; // Keep this student
            }
            return false; // Skip this student
        });

        // Calculate counts for male and female students
        this.maleStudents = this.rosters.filter((student: any) => student.gender === 'Male').length;
        this.femaleStudents = this.rosters.filter((student: any) => student.gender === 'Female').length;
        this.totalStudents = this.rosters.length; // Update total students count

   
    this.getClassId();
    // console.log(this.rosters);

    this.isLoadingRoster = false;
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


// In roster.component.ts
  addtoRoster() {
    // if (!this.classes || this.classes.length === 0) {
    //     console.error('Classes are not loaded or empty.');
    //     alert('Classes are not loaded or empty.');
    //     return; // Exit the function early
    // }

    const filteredClassIds = this.classes
        .filter((classInfo: any) => 
            classInfo.grade_level === this.selectedLevel &&
            classInfo.section_name === this.selectedSection &&
            (this.selectedLevel === '11' || this.selectedLevel === '12' ? classInfo.strand === this.selectedStrand : true)
        )
        .map((classInfo: any) => classInfo.class_id);

    if (filteredClassIds.length > 0) {
            this.route.navigate(['/main/enrollment/enrollmentpage/rostering/', filteredClassIds.join(',')]);
    } 
    else {
        console.error('No matching class IDs available to add to roster.');
        alert('No matching classes available to add to the roster.');
    }
  }

  populateClassIds() {
    if (this.classes && this.classes.length > 0) {
        this.classIds = this.classes.map((classInfo: any) => classInfo.class_id);
    }
  }
  
  updateRosters() {
    this.getFilteredRosters();
    this.getClassId();
  }

  getUniqueRosters() {
    if (!this.rosters) {
        return []; // Return an empty array if rosters is undefined
    }
    
    const uniqueRosters = this.rosters.reduce((acc: any[], current: any) => {
        const x = acc.find((item: any) => item.student_name === current.student_name);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);
    
    return uniqueRosters;
}
  
  
}

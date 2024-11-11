import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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

  gradelevel: string[] = [];
  sections: string[] = [];
  strands: string[] = [];

  genders: string[] = [
    'All',
    'Male',
    'Female'
  ]

  selectedLevel: string = "";
  selectedSection: string = "";
  selectedStrand: string = "";
  selectedGender: string = "All";
  

  showSearchRoster = false;
  
  rosters: any;
  filteredRosters: any;
  classId: any;
  classes: any;

  totalStudents:any;
  maleStudents:any;
  femaleStudents:any;

  classIds: any[] = [];

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router,
  ) { }
  
  ngOnInit(): void {
    this.aroute.params.subscribe(params => {
      this.classIds = params['classIds'].split(','); // Split the string into an array
      console.log(this.classIds); // Use the class IDs as needed
  });

    this.conn.getClasses().subscribe((result: any) => {
      console.log(result)
      const uniqueGradeLevels = Array.from(new Set(result.map((lvl: any) => lvl.grade_level))).map((x) => x as string);
      const uniqueSections = Array.from(new Set(result.map((sect: any) => sect.section_name))).map((x) => x as string);
      const uniqueStrands = Array.from(new Set(result.map((strnd: any) => strnd.strand))).map((x) => x as string);
      
      this.gradelevel = uniqueGradeLevels;
      this.sections = uniqueSections;
      this.strands = uniqueStrands;
      this.classes = result; // Assign the result to this.classes

      if (this.gradelevel.length > 0) {
        this.selectedLevel = this.gradelevel[0];
      }
      if (this.sections.length > 0) {
        this.selectedSection = this.sections[0]; 
      }

      this.getFilteredRosters(); 
      this.getClassId();
    });

    this.conn.getClasses().subscribe((result: any) => {
      this.classes = result; // Store all classes
      this.populateClassIds(); // Populate class IDs
      this.getFilteredRosters(); 
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

gradeLevelChange(event: any) {
  this.selectedLevel = event.target.value;
  this.getClassId();
}

// In roster.component.ts
addtoRoster() {
  // Check if there is an existing roster
 
    const filteredClassIds = this.classes
          .filter((classInfo: any) => 
              classInfo.grade_level === this.selectedLevel &&
              classInfo.section_name === this.selectedSection &&
              (this.selectedLevel === '11' || this.selectedLevel === '12' ? classInfo.strand === this.selectedStrand : true)
          )
          .map((classInfo: any) => classInfo.class_id);

          if (filteredClassIds.length > 0) {
            this.conn.createRoster(filteredClassIds).subscribe((result: any) => {
                console.log(result);
                this.route.navigate(['/main/enrollment/enrollmentpage/rostering/', filteredClassIds.join(',')]);
            });
        } else {
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

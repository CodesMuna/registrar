import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { KeyValuePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

// interface Grade {
//     subject: string;
//     'First Quarter': number | null;
//     'Second Quarter': number | null;
//     'Third Quarter': number | null;
//     'Fourth Quarter': number | null;
//     Midterm: number | null;
//     Final: number | null;
//     Semester: number | null;
//   }

@Component({
  selector: 'app-studentgrades',
  standalone: true,
  imports: [KeyValuePipe, MatButton],
  templateUrl: './studentgrades.component.html',
  styleUrl: './studentgrades.component.css'
})
export class StudentgradesComponent implements OnInit{

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router
  ) { }

  // grades: Grade[] = [];  // Specify the type of the grades array
  filteredGrades: any[] = [];
  grades: any[] = [];
  lrn: any;
  syr: any;
  student: any;
  selectedSemester: 1 | 2 = 1;

  ngOnInit(): void {
    const lrn = this.aroute.snapshot.paramMap.get('lrn');
    const syr = this.aroute.snapshot.paramMap.get('syr');

    this.getGrades(lrn, syr);
  }

  getGrades(lrn: any, syr: any) {
        this.conn.getGrades(lrn, syr).subscribe((data: any) => {
          console.log(data);
          this.student = data;
          // Check for grades data
          if (data && data[1] && data[1].grades) {
            const gradesData = data[1].grades;
            this.grades = Object.keys(gradesData).map(key => {
              return {
                subject: key,
                'First Quarter': gradesData[key]['First Quarter'] || null,
                'Second Quarter': gradesData[key]['Second Quarter'] || null,
                'Third Quarter': gradesData[key]['Third Quarter'] || null,
                'Fourth Quarter': gradesData[key]['Fourth Quarter'] || null,
                'Midterm': gradesData[key]['Midterm'] || null,
                'Final': gradesData[key]['Final'] || null,
                'Semester': gradesData[key]['Semester'] || null, // Add semester
              };
            });
    
            // Initially filter based on the selected semester
            this.filterSemester(this.selectedSemester);
          } else {
            console.error('Error: Grades data is null or undefined');
            this.grades = []; // Initialize grades as an empty array
          }
        });
      }

filterSemester(semester: 1 | 2) {
      this.selectedSemester = semester;
      console.log(`Filtering for ${semester} semester`);
      
      // Adjust according to the exact value in the grade data if needed (e.g., 'First Semester')
      this.filteredGrades = this.grades.filter(grade => grade.Semester === semester);
      console.log(this.filteredGrades);  // Log the filtered grades to check the output
    }

}


// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { PortalService } from '../../../portal.service';
// import { CommonModule, KeyValuePipe } from '@angular/common';

// interface Grade {
//   subject: string;
//   'First Quarter': number | null;
//   'Second Quarter': number | null;
//   'Third Quarter': number | null;
//   'Fourth Quarter': number | null;
//   Midterm: number | null;
//   Final: number | null;
//   Semester: number | null;
// }

// @Component({
//   selector: 'app-studentgrades',
//   standalone: true,
//   imports: [KeyValuePipe, CommonModule],
//   templateUrl: './studentgrades.component.html',
//   styleUrl: './studentgrades.component.css',
// })
// export class StudentgradesComponent implements OnInit {
//   grades: Grade[] = [];  // Specify the type of the grades array
//   filteredGrades: Grade[] = [];  // Specify the type of filteredGrades
//   lrn: any;
//   syr: any;
//   student: any;
//   selectedSemester: 1 | 2 = 1;

//   constructor(private conn: PortalService,
//               private aroute: ActivatedRoute,
//               private route: Router) { }

//   ngOnInit(): void {
//     const lrn = this.aroute.snapshot.paramMap.get('lrn');
//     const syr = this.aroute.snapshot.paramMap.get('syr');
//     this.getGrades(lrn, syr);
//   }

//   getGrades(lrn: any, syr: any) {
//     this.conn.getGrades(lrn, syr).subscribe((data: any) => {
//       console.log(data);
//       this.student = data;
//       // Check for grades data
//       if (data && data[1] && data[1].grades) {
//         const gradesData = data[1].grades;
//         this.grades = Object.keys(gradesData).map(key => {
//           return {
//             subject: key,
//             'First Quarter': gradesData[key]['First Quarter'] || null,
//             'Second Quarter': gradesData[key]['Second Quarter'] || null,
//             'Third Quarter': gradesData[key]['Third Quarter'] || null,
//             'Fourth Quarter': gradesData[key]['Fourth Quarter'] || null,
//             'Midterm': gradesData[key]['Midterm'] || null,
//             'Final': gradesData[key]['Final'] || null,
//             'Semester': gradesData[key]['Semester'] || null, // Add semester
//           };
//         });

//         // Initially filter based on the selected semester
//         this.filterSemester(this.selectedSemester);
//       } else {
//         console.error('Error: Grades data is null or undefined');
//         this.grades = []; // Initialize grades as an empty array
//       }
//     });
//   }

//   filterSemester(semester: 1 | 2) {
//     this.selectedSemester = semester;
//     console.log(`Filtering for ${semester} semester`);
    
//     // Adjust according to the exact value in the grade data if needed (e.g., 'First Semester')
//     this.filteredGrades = this.grades.filter(grade => grade.Semester === semester);
//     console.log(this.filteredGrades);  // Log the filtered grades to check the output
//   }
// }

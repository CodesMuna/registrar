import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-studentgrades',
  standalone: true,
  imports: [KeyValuePipe, MatButton, CommonModule],
  templateUrl: './studentgrades.component.html',
  styleUrls: ['./studentgrades.component.css']
})
export class StudentgradesComponent implements OnInit {
  filteredGrades: any[] = [];
  grades: any[] = [];
  lrn: any;
  syr: any;
  student: any;
  selectedSemester: 1 | 2 = 1;

  constructor(private conn: PortalService, private aroute: ActivatedRoute, private route: Router) {}

  ngOnInit(): void {
    const lrn = this.aroute.snapshot.paramMap.get('lrn');
    const syr = this.aroute.snapshot.paramMap.get('syr');
    this.getGrades(lrn, syr);
  }

  getGrades(lrn: any, syr: any) {
    this.conn.getGrades(lrn, syr).subscribe((data: any) => {
      console.log(data);
      this.student = data;
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
            'Semester': gradesData[key]['Semester'] || null,
          };
        });
        this.filterSemester(this.selectedSemester);
      } else {
        console.error('Error: Grades data is null or undefined');
        this.grades = [];
      }
    });
  }

  filterSemester(semester: 1 | 2) {
    this.selectedSemester = semester;
    console.log(`Filtering for ${semester} semester`);
    this.filteredGrades = this.grades.filter(grade => grade.Semester === semester);
    console.log(this.filteredGrades);
  }

  calculateAverage(grade1: number, grade2: number, grade3: number, grade4: number): number {
    const grades = [grade1, grade2, grade3, grade4];
    const validGrades = grades.filter(grade => grade >= 60 && grade <= 99);
 return validGrades.length > 0 
      ? this.roundCustom(validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length)
      : 0;
  }

  calculateAveragee(grade1: number, grade2: number): number {
    const grades = [grade1, grade2];
    const validGrades = grades.filter(grade => grade >= 60 && grade <= 99);
    return validGrades.length > 0 
      ? this.roundCustom(validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length)
      : 0;
  }

  roundCustom(value: number): number {
    if (typeof value !== 'number') {
      return 0; // Return 0 for non-numeric values
    }
    const integerPart = Math.floor(value);
    const decimalPart = value - integerPart;
    return decimalPart < 0.5 ? integerPart : integerPart + 1; // Custom rounding logic
  }

  calculateGeneralAverage(): number {
    const averages = this.grades.map(grade => 
      this.calculateAverage(grade['First Quarter'], grade['Second Quarter'], grade['Third Quarter'], grade['Fourth Quarter'])
    ).filter(avg => avg > 0);

    const total = averages.reduce((sum, avg) => sum + avg, 0);
    
    return averages.length > 0 ? this.roundCustom(total / averages.length) : 0;
  }

  calculateGeneralAveragee(): number {
    const averages = this.filteredGrades.map(grade => 
      this.calculateAveragee(grade['Midterm'], grade['Final'])
    ).filter(avg => avg > 0);

    const total = averages.reduce((sum, avg) => sum + avg, 0);
    
    return averages.length > 0 ? this.roundCustom(total / averages.length) : 0;
  }
}
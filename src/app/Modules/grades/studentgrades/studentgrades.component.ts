import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortalService } from '../../../portal.service';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-studentgrades',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './studentgrades.component.html',
  styleUrl: './studentgrades.component.css'
})
export class StudentgradesComponent implements OnInit{

  constructor(private conn: PortalService,
    private aroute: ActivatedRoute,
    private route: Router
  ) { }

  grades: any;
  lrn: any;
  syr: any;
  student: any;

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
                    '1st Quarter': gradesData[key]['1st Quarter'] || null,
                    '2nd Quarter': gradesData[key]['2nd Quarter'] || null,
                    '3rd Quarter': gradesData[key]['3rd Quarter'] || null,
                    '4th Quarter': gradesData[key]['4th Quarter'] || null,
                    'Midterm': gradesData[key]['Midterm'] || null,
                    'Final': gradesData[key]['Final'] || null
                };
            });
        } else {
            // Handle the case where there are no grades
            console.error('Error: Grades data is null or undefined');
            this.grades = []; // Initialize grades as an empty array
        }
    });
}

}

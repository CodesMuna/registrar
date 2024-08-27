import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, ],
  templateUrl: './roster.component.html',
  styleUrl: './roster.component.css'
})
export class RosterComponent {
  classes: string[] = [
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
  ];

  sections: string[] = [
    'Emerald',
    'Diamond',
    'Pearl',
    'Sapphire',
    'Amethyst',
    'A',
    'B',
    'C',
  ];

  strands: string[] = [
    'STEM',
    'ABM',
    'HUMSS',
  ];
}

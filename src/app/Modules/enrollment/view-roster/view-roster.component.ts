import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-view-roster',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatListModule],
  templateUrl: './view-roster.component.html',
  styleUrl: './view-roster.component.css'
})
export class ViewRosterComponent {
  enrolees: string[] = ['Victoria Nueman', 'John Lander', 'Jessie Train', 'Queen Maeve', 'Chace Deep'];
}

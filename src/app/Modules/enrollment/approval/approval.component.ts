import {ChangeDetectionStrategy, Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

export interface PeriodicElement {
  name: string;
  gender: string;
  year: string;
  balance: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Miko', gender: "Male",  year: "II", balance: 20000.31},
  { name: 'Helium', gender: "Female", year: "III", balance: 1000.31},
  { name: 'Lithium', gender: "Male", year: "II", balance: 1200.31},
  { name: 'Beryllium', gender: "Female", year: "I", balance: 20000.31},
  { name: 'Boron', gender: "Male", year: "IV", balance: 20120.31},
  { name: 'Carbon', gender: "Male", year: "IV", balance: 80040.31},
  { name: 'Nitrogen', gender:"Female", year: "I", balance: 53231.31},
  { name: 'Oxygen', gender: "Female", year: "III", balance: 14110.31},
  { name: 'Fluorine', gender: "Female", year: "IV", balance: 12400.31},
  { name: 'Neon', gender: "Male", year: "II", balance: 21415.31},
];

@Component({
  selector: 'app-approval',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatToolbar,
    MatTabsModule,
    MatIconModule, MatChipsModule, MatSelectModule,MatDatepickerModule, MatSidenavModule, MatTableModule, MatDividerModule, MatButtonModule],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ApprovalComponent {
  displayedColumns: string[] = ['name', 'gender', 'year', 'balance', ''];
  dataSource = ELEMENT_DATA;
}

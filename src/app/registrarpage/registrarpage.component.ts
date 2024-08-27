import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CustomSidenavComponent } from "../custom-sidenav/custom-sidenav.component";
import { MatBadgeModule } from '@angular/material/badge'
import { MatMenuModule } from '@angular/material/menu'

@Component({
  selector: 'app-registrarpage',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule, CustomSidenavComponent, MatButtonModule, MatBadgeModule, MatMenuModule],
  templateUrl: './registrarpage.component.html',
  styleUrl: './registrarpage.component.css'
})
export class RegistrarpageComponent {

  collapsed = signal(false);
  sidenavMode = signal('side');

  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  menunavWidth = computed(() => this.collapsed() ? '65px' : '450px');


}

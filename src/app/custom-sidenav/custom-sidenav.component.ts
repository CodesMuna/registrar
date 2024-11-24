import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PortalService } from '../portal.service';

export type MenuItem = {
  icon: string,
  label: string,
  route: string,
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.css'
})
export class CustomSidenavComponent implements OnInit{
  sideNavCollapsed = signal(false)
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val);
  }

  role = '';
  lname = '';
  fname = '';
  adminPic: string | null = null;

  constructor(private conn: PortalService,) {}

  ngOnInit(): void {
    this.loadUserData();
    
    this.conn.adminPic$.subscribe((newImageUrl) => {
      if (newImageUrl) {
        this.adminPic = newImageUrl; // Update the component's admin picture
      }
    });

    // Optionally, initialize with the image from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.admin_pic) {
      this.adminPic = user.admin_pic;
    }
  }
  

  loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.role = parsedData.role || '';
      this.lname = parsedData.lname || '';
      this.fname = parsedData.fname || '';
    }
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'home',
      label: 'Home',
      route: 'home'
    },
    {
      icon: 'explicit',
      label: 'Enrollment',
      route: 'enrollment',
      subItems: [
        // {
        //   icon: 'how_to_reg',
        //   label: 'Approval',
        //   route: 'enrollment/enrollmentpage/approval',
        // },
        {
          icon: 'monitoring',
          label: 'Monitor',
          route: 'enrollment/enrollmentpage/monitor',
        },
        {
          icon: 'groups',
          label: 'Roster',
          route: 'enrollment/enrollmentpage/roster',
        },
        // {
        //   icon: 'group_add',
        //   label: 'Rostering',
        //   route: 'enrollment/enrollmentpage/rostering',
        // },
      ]
    },
    {
      icon: 'grade',
      label: 'Grades',
      route: 'grades/gradespage/studentlist',
    },
    {
      icon: 'chat',
      label: 'Message',
      route: 'message'
    },
    // {
    //   icon: 'account_circle',
    //   label: 'My Account',
    //   route: 'account'
    // },
    // {
    //   icon: 'logout',
    //   label: 'Logout',
    //   route: '/login'
    // }
  ]);
 
  profilePicSize = computed( ()=> this.sideNavCollapsed() ? '32' : '100');
}

import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PortalService } from '../portal.service';
import { MatBadgeModule } from '@angular/material/badge';

export type MenuItem = {
  icon: string,
  label: string,
  route: string,
  subItems?: MenuItem[];
  unreadCount?: any;
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent ,MatBadgeModule],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.css',
  template: `
    <a mat-list-item [routerLink]="item.route" class="menu-item" routerLinkActive="selected-menu-item">
    <mat-icon [matBadge]="item.unreadCount > 0 ? item.unreadCount : null" matBadgeColor="warn">
      {{ item.icon }}
    </mat-icon>
      <span>{{ item.label }} yo</span>
    </a>
  `,
  styles: [`
    .badge {
      background-color: red;
      color: white;
      border-radius: 12px;
      padding: 0 6px;
      margin-left: 8px;
    }
  `]
})
export class CustomSidenavComponent implements OnInit{
  @Input() item: any;

  sideNavCollapsed = signal(false)
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val);
  }

  role = '';
  lname = '';
  fname = '';
  uid: any;
  adminPic: string | null = null;

  unreadMessagesCount: any = 0;

  constructor(private conn: PortalService,) {}

  ngOnInit(): void {
    this.uid = localStorage.getItem('admin_id')
    this.loadUserData();

    this.loadUnreadMessagesCount();
    
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

    this.adminPic = user.admin_pic || 'mik.jpg';
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

  loadUnreadMessagesCount() {
    if (this.uid) {
      this.conn.getUnreadMessagesCount(this.uid).subscribe(response => {
        console.log(response)
        this.unreadMessagesCount = response; // Extract the count from the response
        console.log('Unread Messages Count:', this.unreadMessagesCount); // Check value here
        this.updateMenuItems(); // Update menu items with the new count
      });
    }
  }

  updateMenuItems() {
    this.menuItems.set([
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
        route: 'message',
        unreadCount: this.unreadMessagesCount // Ensure this is set correctly
      },
    ]);
  }
  

  menuItems = signal<MenuItem[]>([
    {
      icon: 'home',
      label: 'Home',
      route : 'home'
    },
    {
      icon: 'explicit',
      label: 'Enrollment',
      route: 'enrollment',
      subItems: [
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
      route: 'message',
      unreadCount: this.unreadMessagesCount // Ensure this is set correctly
    },
  ]);

  trackByFn(index: number, item: MenuItem) {
    return item.route; // or any unique identifier
  }

 
  profilePicSize = computed( ()=> this.sideNavCollapsed() ? '32' : '100');
}

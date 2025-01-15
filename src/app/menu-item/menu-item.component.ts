import { Component, input, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../custom-sidenav/custom-sidenav.component';
import { animate, style, transition, trigger } from '@angular/animations';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  animations: [
    trigger('expandContractMenu', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('500ms ease-in-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0, height: '0px' }))
      ])
    ])
  ],
  imports: [MatListModule, RouterModule, MatIcon, MatTooltipModule, MatBadgeModule, CommonModule ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
  
})
export class MenuItemComponent {
  
  item = input.required<MenuItem>()

  collapsed = input(false);

  getBadgeContent(unreadCount: number, pendingCount: number): string | null {
    if (unreadCount > 0 && pendingCount > 0) {
      return `${unreadCount}/${pendingCount}`;
    } else if (unreadCount > 0) {
      return `${unreadCount}`;
    } else if (pendingCount > 0) {
      return `${pendingCount}`;
    }
    return null;
  }

  nestedMenuOpen = signal(false);
  private intervalId: any;

  toggleNested(){
    if (!this.item().subItems) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen())
  }

}

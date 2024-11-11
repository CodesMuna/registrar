import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalService } from '../../../portal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {
  user: any;

  constructor(private adminService: PortalService) {

  }

  profileForm = new FormGroup({
    admin_id: new FormControl('',),
    fname: new FormControl(''),
    mname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    oldPassword: new FormControl(null),
    newPassword: new FormControl(''),
    newPassword_confirmation: new FormControl(''),
    role: new FormControl(''),

  })

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;
    console.log(user);

    if (user) {
      this.profileForm.patchValue({
        admin_id: user.admin_id,
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        email: user.email,
        address: user.address,
        role: user.role,
        oldPassword: user.oldPassword,
      });
    }
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
  
      const adminId = Number(formData.admin_id);
      const oldPassword = formData.oldPassword ?? ''; // Ensure this is a string
  
      if (adminId <= 0 || !oldPassword) {
        console.error('Invalid admin ID or missing old password');
        return;
      }
      this.adminService.update(adminId, oldPassword, {
        fname: formData.fname,
        mname: formData.mname,
        lname: formData.lname,
        email: formData.email,
        address: formData.address,
        newPassword: formData.newPassword,
        newPassword_confirmation: formData.newPassword_confirmation // Include confirmation if needed
      }).subscribe(
        (result) => {
          console.log('Profile updated successfully', result);
          const updatedUser = {
            ...this.user,
            fname: formData.fname,
            mname: formData.mname,
            lname: formData.lname,
            email: formData.email,
            address: formData.address,
          };
  
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.loadUserData();
        },
        (error) => {
          console.error('Error updating profile:', error);
          console.error('Error details:', error.error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
    }
  }
}

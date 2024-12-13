import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalService } from '../../../portal.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';  // Ensure SweetAlert2 is imported
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatError],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {
  user: any;
  adminPic:any;
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
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // if (user && user.admin_pic) {
    //     this.adminPic = user.admin_pic;
    // } else {
    //     console.warn('Admin picture URL not found in localStorage');
    // }
}

loadUserData(): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  this.user = user; // Set the user object
  console.log('Loaded user:', this.user);

  if (user) {
      // Patch the profile form with user details
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

  // Set admin picture
  this.adminPic = user.admin_pic || 'mik.jpg';
}
  // loadUserData(): void {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   this.user = user;
  //   console.log(user);

  //   if (user) {
  //     this.profileForm.patchValue({
  //       admin_id: user.admin_id,
  //       fname: user.fname,
  //       mname: user.mname,
  //       lname: user.lname,
  //       email: user.email,
  //       address: user.address,
  //       role: user.role,
  //       oldPassword: user.oldPassword,
  //     });
  //   }

  //   if (user && user.admin_pic) {
  //     this.adminPic = user.admin_pic;
  //   } else {
  //     console.warn('Admin picture URL not found in localStorage');
  //   }
  // }

  saveChanges(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
  
      const adminId = Number(formData.admin_id);
      const oldPassword = formData.oldPassword ?? ''; // Ensure this is a string
  
      if (adminId <= 0 || !oldPassword) {
        console.error('Invalid admin ID or missing old password');
        Swal.fire({
          title: "Error",
          text: "Enter Old Password to save changes.",
          icon: "error"
        });
        return;
        
      }
      const adminPic = this.adminPic; //bago
      this.adminService.update(adminId, oldPassword, {
        fname: formData.fname,
        mname: formData.mname,
        lname: formData.lname,
        email: formData.email,
        address: formData.address,
        admin_pic: adminPic, // bago
        newPassword: formData.newPassword,
        newPassword_confirmation: formData.newPassword_confirmation // Include confirmation if needed
      }).subscribe(
        (result) => {
          Swal.fire({
            title: "Success!",
            text: "Profile updated successfully!",
            icon: "success"
          });
          console.log('Profile updated successfully', result);

          const updatedUser = {
            ...this.user,            // Retain all existing properties from `this.user`
            admin_pic: adminPic,     // Explicitly retain the old value of `admin_pic`
            fname: formData.fname,
            mname: formData.mname,
            lname: formData.lname,
            email: formData.email,
            address: formData.address,
        };
        
  
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.loadUserData();

          this.profileForm.patchValue({
            newPassword: '',
            newPassword_confirmation: ''

          });
        },
        (error) => {
          console.error('Error updating profile:', error);
          console.error('Error details:', error);
          Swal.fire({
            icon: "error",
            title: "Oopps! Validation Errors",
            html: `
              <p>The following issues need to be resolved:</p>
              <ul style="text-align: left;">
                <li>New password must be 8 characters long.</li>
                <li>Incorrect old password</li>
              </ul>
            `,
          });
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (file && user.admin_id) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('admin_id', user.admin_id);
    
      this.adminService.uploadImage(formData).subscribe(response => {
        console.log(response); 
        const newImageUrl = `http://localhost:8000/assets/adminPic/${response['image_url'].split('/').pop()}`;
        
        // Update adminPic variable and the service
        this.adminPic = newImageUrl;
        user.admin_pic = newImageUrl;
        localStorage.setItem('user', JSON.stringify(user)); 
        
        // Notify other components by updating the service
        this.adminService.updateAdminPic(newImageUrl); // Notify all subscribers
        console.log('Admin Picture URL:', this.adminPic);
      }, error => {
        console.error('Error uploading image:', error);
      });
    
    
    } else {
        console.error('No file selected or admin ID is missing');
    }
}

}

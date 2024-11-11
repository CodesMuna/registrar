import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { PortalService } from '../portal.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FormsModule, RouterOutlet],
  providers: [PortalService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  roles: any = ['Principal', 'Teacher', 'Registrar', 'DSF']

  constructor(private conn: PortalService, private route: Router) { }

  
  ngOnInit(): void {
  }



  adminForm = new FormGroup({
    fname: new FormControl(null),
    lname: new FormControl(null),
    mname: new FormControl(null),
    role: new FormControl(null),
    address: new FormControl(null),
    email: new FormControl(null),
    password: new FormControl(null),
    password_confirmation: new FormControl(null)
  })


  onSubmit(){
    this.conn.register(this.adminForm.value)
      .subscribe((result: any)=>{
        if(result !=null){
          console.log('Success')
          // this.route.navigate(['/login'])
        }
        console.log(result)
      })
  }

  // onSubmit(): void {
  //   if (this.adminForm.valid) {
  //     const adminData = this.adminForm.value;
  //     this.apiService.registerAdmin(adminData).subscribe((response) => {
  //       console.log(response);
  //       // handle success response
  //     }, (error) => {
  //       console.error(error);
  //       // handle error response
  //     });
  //   }
  // }
 

}

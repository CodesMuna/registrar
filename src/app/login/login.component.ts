import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PortalService } from '../portal.service';
import Swal from 'sweetalert2'; 
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  // route = inject(Router)
  // conn = inject(PortalService);

  errorMessage: any;

  ngOnInit(): void {
  }

  constructor(private conn: PortalService,
              private route: Router
  ) { }



  loginForm = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null)
  })

  login() {
    this.conn.login(this.loginForm.value).subscribe(
      (result: any) => {
        if (result.token != null) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('admin_id', result.admin.admin_id);

          // image get
          const user = result.admin;
          if (user && user.admin_pic) {
            if (!user.admin_pic.startsWith('http://localhost:8000')) {
              user.admin_pic = `http://localhost:8000/assets/adminPic/${user.admin_pic}`;
            }
          }
          localStorage.setItem('user', JSON.stringify(user));
          
          console.log('Token stored:', result.token);
          this.navigateToMainPage();
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Something went wrong!",
            text: "Invalid Email or Password",  
          });
        }
        
        
        console.log(result);
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Invalid Email or Password",  
        });
      }
    );
}

  onSubmit() {
    this.conn.login(this.loginForm.value).subscribe(
      (result: any) => {
        if (result.token != null) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('admin_id', result.admin.admin_id);
          // console.log(result)
          
          this.route.navigate(['/main']);
        }
      },
      (error) => {
        // Handle error response
        this.errorMessage = 'Invalid email or password, or no existing accounts.';
        console.error(error); // Log the error for debugging
      }
      
    );
    
  }

  navigateToMainPage() {
    console.log('Router:', this.route); // Check if router is defined
    this.route.navigate(['/main']);
    // window.location.reload()
    }

}

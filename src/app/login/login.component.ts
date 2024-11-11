import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PortalService } from '../portal.service';
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

}

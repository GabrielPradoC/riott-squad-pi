import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import{ LoginService } from "../../@core/services/login.service"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public form: FormGroup;

  constructor( private fb: FormBuilder, private service: LoginService, private router: Router) {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.email,
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.minLength(8),
        Validators.maxLength(100),
        Validators.required
      ])]
    });
  }

  login(): void {
    const email: string = this.form.controls['email'].value;
    const password: string = this.form.controls['password'].value;

    this.loginUser(email, password);
  }

  /**
   * Method that authenticates the user
   * @param email - User entered email
   * @param password - Password entered by user
   * @returns void
   */
   loginUser(email: string, password: string) {
    const body = {
      email,
      password
    };

    this.service.login("v1/login", body).subscribe(
        complete => {
            localStorage.setItem("riott:token", complete.data.token);
            return this.router.navigate(['/pages/lists']);
        },
        error => alert(error.error.error)
    );
}
}

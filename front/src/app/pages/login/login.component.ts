import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from "../../@core/services/login.service"
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/@core/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private localStorageService: LocalStorageService,
    private router: Router) {
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

  /**
   * Method that fetches typed information and calls the authentication method.
   * 
   * @returns void
   */
  login(): void {
    const email: string = this.form.controls['email'].value;
    const password: string = this.form.controls['password'].value;

    this.loginUser(email, password);
  }

  /**
   * Method that authenticates the user.
   * 
   * @param email - User entered email
   * @param password - Password entered by user
   * @returns void
   */
  loginUser(email: string, password: string): void {
    const body = {
      email,
      password
    };
    
    this.service.Create(`${environment.API}login`, body).subscribe(
      complete => {
        this.localStorageService.setItem("riott:token", complete.data.token);
        this.localStorageService.setItem("riott:userId", complete.data.userId.toString());
        return this.router.navigate(['/pages/lists']);
      },
      error => alert(error.error.error)
    );
  }
}

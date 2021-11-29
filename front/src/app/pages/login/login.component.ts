import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
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

    this.router.navigate(['/pages/members']);
  }
}

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
    const mensagem: string = LoginService.loginUsuario(email, password);

    /* TESTE LOGIN (CRIA USUÁRIO COM OS DADOS DO INPUT AO CLICAR EM ENTRAR)
    console.log(LoginService.abreRequisicao("POST", "http://localhost:4444/v1/user", {
      "name": "aaaa",
      "email": email,
      "password": password
    }));
    */

    if(mensagem === "ok") {
      this.router.navigate(['/pages/lists']);
    } else {
      alert(mensagem);
    }
  }
}

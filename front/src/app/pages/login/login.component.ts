import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  /**
   * Pega o email e senha do formulário e cria o body para a requisição
   */
  loginUsuario() {
      event.preventDefault();
      let url: string = "api/login";
      let email: string = document.getElementById("email").accessKey;
      let password: string = document.getElementById("password").accessKey;
      let body = {
          "email": email,
          "password": password
      }

      console.log(password);
      console.log(email);

      this.fazPost(url, body);
      //aqui guardar o retorno da requisição no localstore
  }

  /**
   * Abre uma requisição do tipo POST e envia os dados
   * @param url - caminho especificado da requisição
   * @param body - dados a serem enviados
   * @returns resposta da requisição
   */
  fazPost(url, body) {
    console.log("Body = ", body);

    let request: XMLHttpRequest = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(body));

    request.onload = function() {
        console.log(this.responseText)
        //mostra a resposta quando voltar
        //chamar a pag listas aqui
    }

    return request.responseText;
  }

}

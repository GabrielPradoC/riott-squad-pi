import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    static url: string = "http://localhost:4444/";

    /**
     * Realiza a autenticação do usuário
     * @param email - email inserido pelo usuário
     * @param password - password inserido pelo usuário
     * @returns string indicando sucesso ou erro de autenticação
     */
    static loginUsuario(email: string, password: string) : string {
        event.preventDefault();

        let resposta: any;
        let mensagem: string;
        let tipo: string = "POST";
        let urlLogin: string = LoginService.url + "v1/login";
        let body = {
            "email": email,
            "password": password
        };

        resposta = LoginService.abreRequisicao(tipo, urlLogin, body);

        if(resposta.status === true) {
            mensagem = "ok";
            localStorage.setItem("token", resposta.data.token);
            //sessionStorage.setItem("token", resposta.data.token);
        } else {
            mensagem = resposta.error[0].msg;
        }
        return mensagem;
    }

    /**
     * Faz uma requisição síncrona de acordo com os parâmetros recebidos
     * @param tipo - tipo de requisição
     * @param url - endereço da requisição
     * @param body - dados a serem enviados
     * @returns - retorno da requisição
     */
    static abreRequisicao(tipo: string, url: string, body: any) :  string {
        let request: XMLHttpRequest = new XMLHttpRequest();

        request.open(tipo, url, false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));
    
        return JSON.parse(request.responseText);
    }
}
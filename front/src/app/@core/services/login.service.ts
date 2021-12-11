import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { first } from 'rxjs/operators';  
import { Auth } from "../common/interfaces/auth.interface";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private readonly baseURL: string = "http://localhost:4444/";

    constructor(private http: HttpClient, private router: Router) { }

    /**
     * Method that authenticates the user
     * @param email - User entered email
     * @param password - Password entered by user
     * @returns void
     */
    loginUser(email: string, password: string) {
        const loginURL: string = this.baseURL + "v1/login";

        const body = {
            "email": email,
            "password": password
        };

        this.loginRequest(loginURL, body).subscribe(
            complete => {
                localStorage.setItem("riott:token", complete.data.token);
                return this.router.navigate(['/pages/lists']);
            },
            error => alert(error.error.error)
        );
    }

    /**
     * Method that makes a user authentication request
     * @param url - request url
     * @param body - object containing user email and password
     * @returns - void
     */
    loginRequest(loginURL: string, body: any): Observable<Auth> {
        return this.http.post<Auth>(loginURL, body).pipe(first());
    }
}
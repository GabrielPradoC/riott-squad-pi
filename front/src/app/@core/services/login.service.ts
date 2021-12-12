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

    constructor(private http: HttpClient) { }

    /**
     * Method that makes a user authentication request
     * @param url - request url
     * @param body - object containing user email and password
     * @returns - void
     */
    login(loginURL: string, body: any): Observable<Auth> {
        return this.http.post<Auth>(this.baseURL + loginURL, body).pipe(first());
    }
}
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class PagesAuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) : Observable<boolean> | boolean {
        if(localStorage.getItem("token")) {
            return true
        } else {
            this.router.navigate(['/pages/login'])
            return true;
        }
    }
}
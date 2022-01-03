import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { LocalStorageService } from "../@core/services/local-storage.service";

@Injectable()
export class PagesAuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) : Observable<boolean> | boolean {
        if(this.localStorageService.getItem("riott:token")) {
            return true;
        } else {
            this.router.navigate(['/pages/login'])
            return false;
        }
    }
}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(key: string): string {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    return localStorage.setItem(key, value);
  }
}

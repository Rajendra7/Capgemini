import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs'; 
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HexogoanService { 

  constructor(private http: HttpClient) {}

  getHex(): Observable<any> {
    return this.http.get('./assets/mock-json/hexgoan.json');
  }
}

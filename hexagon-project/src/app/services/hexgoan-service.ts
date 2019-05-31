import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs'; 
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HexogoanService { 

  constructor(private http: HttpClient) {}

  getHex(jsonFile:string): Observable<any> {
    console.log(jsonFile);
    return this.http.get(jsonFile);
  }
}

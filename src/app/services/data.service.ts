import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}
  
  getOrdersAnalysisData(): Observable<any> {
    return this.http.get<any>('./assets/data/db.json').pipe(
      catchError(error => {
        console.error('Error loading chart data:', error);
        return of(this.getMockOrdersData());
      })
    );
  }
  
  getUsersData(): Observable<any> {
    return this.http.get<any>('./assets/data/users.json').pipe(
      catchError(error => {
        console.error('Error loading users data:', error);
        return of({
          users: [
            { username: 'a', password: 'a', role: 'admin' },
            { username: 'user', password: 'password', role: 'user' }
          ]
        });
      })
    );
  }
  
  getMockOrdersData() {
    return {
      stockInventoryAnalysisChartData: [
        {
          "date": "2025-02-01",
          "numOfActiveOrders": 30,
          "numOfInactiveOrders": 45
        },
        {
          "date": "2025-02-08",
          "numOfActiveOrders": 35,
          "numOfInactiveOrders": 42
        },
        {
          "date": "2025-02-15",
          "numOfActiveOrders": 45,
          "numOfInactiveOrders": 38
        },
        {
          "date": "2025-02-22",
          "numOfActiveOrders": 50,
          "numOfInactiveOrders": 35
        },
        {
          "date": "2025-03-01",
          "numOfActiveOrders": 55,
          "numOfInactiveOrders": 32
        },
        {
          "date": "2025-03-08",
          "numOfActiveOrders": 60,
          "numOfInactiveOrders": 28
        }
      ]
    };
  }
}
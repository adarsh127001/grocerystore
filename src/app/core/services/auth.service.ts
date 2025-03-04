import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn = this.isLoggedInSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<string | null>('Manager');
  public currentUser = this.currentUserSubject.asObservable();
  
  private users: User[] = [
    { username: 'a', password: 'a' },
    { username: 'Manager', password: 'password' }
  ];

  constructor(private http: HttpClient) {
    this.isLoggedInSubject.next(true);
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<{users: User[]}>('assets/data/users.json')
      .pipe(
        catchError(() => {
          return of({ users: [] });
        })
      )
      .subscribe(data => {
        if (data && data.users && data.users.length > 0) {
          this.users = [...this.users, ...data.users];
        }
      });
  }

  login(username: string, password: string): Observable<boolean> {
    const user = this.users.find(u => 
      u.username === username && u.password === password);
    
    const success = !!user;
    
    if (success) {
      this.isLoggedInSubject.next(true);
      this.currentUserSubject.next(username);
    }
    
    return of(success);
  }
  
  registerUser(username: string, password: string): Observable<boolean> {
    if (this.users.some(u => u.username === username)) {
      return of(false);
    }
    
    this.users.push({ username, password });
    return of(true);
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }
}
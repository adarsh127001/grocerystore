import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

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
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  
  // In-memory users for development
  private users: User[] = [
    { username: 'a', password: 'a' }
  ];

  constructor(private http: HttpClient) {
    // Load users from JSON initially
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<{users: User[]}>('assets/users.json')
      .subscribe(data => {
        if (data && data.users) {
          this.users = data.users;
          console.log('Users loaded:', this.users);
        }
      }, error => {
        console.error('Error loading users:', error);
      });
  }

  login(username: string, password: string): Observable<boolean> {
    // Simple login check
    console.log('Login attempt:', username, password);
    console.log('Available users:', this.users);
    
    const user = this.users.find(u => 
      u.username === username && u.password === password);
    
    const success = !!user;
    
    if (success) {
      this.isLoggedInSubject.next(true);
      this.currentUserSubject.next(username);
    }
    
    console.log('Login success:', success);
    return of(success);
  }
  
  registerUser(username: string, password: string): Observable<boolean> {
    // Check if user already exists
    if (this.users.some(u => u.username === username)) {
      return of(false);
    }
    
    // Add user to in-memory array
    this.users.push({ username, password });
    
    // In a real app, we'd call an API to save the new user
    console.log('New user registered:', { username, password });
    console.log('Updated users list:', this.users);
    
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
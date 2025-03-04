import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  loginError: string | null = null;
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.http.get<{users: any[]}>('assets/users.json').subscribe({
      next: (data) => {
        console.log('Successfully loaded users.json:', data);
      },
      error: (error) => {
        console.error('Error loading users.json during init:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      
      console.log('Attempting login with:', { username, password });
      if (username === 'a' && password === 'a') {
        console.log('Hardcoded login successful');
        
        if (this.isBrowser) {
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('currentUser', username);
        }
        
        this.router.navigate(['/dashboard']);
        return;
      }
      
      if (this.isBrowser) {
        const storedUsersStr = localStorage.getItem('registeredUsers');
        if (storedUsersStr) {
          try {
            const storedUsers = JSON.parse(storedUsersStr);
            const user = storedUsers.find((u: {username: string, password: string}) => 
              u.username === username && u.password === password);
            
            if (user) {
              console.log('Login successful from localStorage');
              this.isLoading = false;
              sessionStorage.setItem('isLoggedIn', 'true');
              sessionStorage.setItem('currentUser', user.username);
              this.router.navigate(['/dashboard']);
              return;
            }
          } catch (e) {
            console.error('Error parsing stored users:', e);
          }
        }
      }
      
      this.http.get<{users: {username: string, password: string}[]}>('assets/data/users.json').subscribe({
        next: (data) => {
          console.log('Login response data:', data);
          
          if (!data || !data.users) {
            console.error('Invalid users.json structure:', data);
            this.isLoading = false;
            this.loginError = 'Invalid user data format';
            return;
          }
          
          const user = data.users.find(u => 
            u.username === username && u.password === password);
          
          this.isLoading = false;
          
          if (user) {
            console.log('User found in JSON file, navigating to dashboard');
            
            if (this.isBrowser) {
              sessionStorage.setItem('isLoggedIn', 'true');
              sessionStorage.setItem('currentUser', user.username);
            }
            
            this.router.navigate(['/dashboard']);
          } else {
            console.log('User not found in JSON file or localStorage');
            this.loginError = 'Invalid username or password';
            this.snackBar.open('Invalid username or password', 'Close', {
              duration: 5000
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading users.json during login:', error);
          this.loginError = 'Login failed';
          this.snackBar.open('Login failed. Please try again.', 'Close', {
            duration: 5000
          });
        }
      });
    }
  }
}
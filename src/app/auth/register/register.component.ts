import { Component, Inject, PLATFORM_ID } from '@angular/core';
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
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  registerError: string | null = null;
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerError = null;
      const { username, password } = this.registerForm.value;
      
      if (!this.isBrowser) {
        this.snackBar.open('Registration successful! Please login.', 'Close', {
          duration: 5000
        });
        this.router.navigate(['/login']);
        return;
      }
      
      this.http.get<{users: {username: string, password: string}[]}>('assets/data/users.json').subscribe({
        next: (data) => {
          let users = data.users || [];
          
          if (users.some(u => u.username === username)) {
            this.isLoading = false;
            this.registerError = 'Username already exists';
            this.snackBar.open('Username already exists', 'Close', {
              duration: 5000
            });
            return;
          }
          
          // Add new user
          users.push({ username, password });
          
          localStorage.setItem('registeredUsers', JSON.stringify(users));
          
          this.isLoading = false;
          this.snackBar.open('Registration successful! Please login.', 'Close', {
            duration: 5000
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error loading users during registration:', error);
          
          const users = [{ username, password }];
          localStorage.setItem('registeredUsers', JSON.stringify(users));
          
          this.isLoading = false;
          this.snackBar.open('Registration successful! Please login.', 'Close', {
            duration: 5000
          });
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
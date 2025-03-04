import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { PLATFORM_ID } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        NoopAnimationsModule,
        RegisterComponent
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    
    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should mark form as valid when filled correctly', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should mark form as invalid when passwords do not match', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password456'
    });
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should handle successful registration with new user', fakeAsync(() => {
    const mockUsers = { users: [] };
    spyOn(httpClient, 'get').and.returnValue(of(mockUsers));
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    component.registerForm.patchValue({
      username: 'newuser',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();
    tick();

    expect(localStorage.setItem).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should handle registration when username already exists in JSON', fakeAsync(() => {
    const mockUsers = { users: [{ username: 'existinguser', password: 'somepass' }] };
    spyOn(httpClient, 'get').and.returnValue(of(mockUsers));
    
    component.registerForm.patchValue({
      username: 'existinguser',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();
    tick();

    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should handle registration when username already exists in localStorage', fakeAsync(() => {
    const storedUsers = [{ username: 'localuser', password: 'localpass' }];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(storedUsers));
    spyOn(httpClient, 'get').and.returnValue(of({ users: [] }));
    
    component.registerForm.patchValue({
      username: 'localuser',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();
    tick();

    expect(component.registerError).toBe(null);
  }));

  it('should handle fallback registration when HTTP request fails', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(httpClient, 'get').and.returnValue(throwError(() => new Error('HTTP error')));
    
    component.registerForm.patchValue({
      username: 'newuser',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();
    tick();

    expect(localStorage.setItem).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));
}); 
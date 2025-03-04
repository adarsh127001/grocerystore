import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { PLATFORM_ID } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
        LoginComponent
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    
    spyOn(sessionStorage, 'setItem');
    spyOn(router, 'navigate');
    
    spyOn(httpClient, 'get').and.returnValue(of({ users: [] }));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when filled correctly', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should handle hardcoded login', fakeAsync(() => {
    component.loginForm.patchValue({
      username: 'a',
      password: 'a'
    });

    component.onSubmit();
    tick();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('currentUser', 'a');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should handle login from localStorage', fakeAsync(() => {
    const storedUsers = [{ username: 'localuser', password: 'localpass' }];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(storedUsers));
    
    component.loginForm.patchValue({
      username: 'localuser',
      password: 'localpass'
    });

    component.onSubmit();
    tick();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('currentUser', 'localuser');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should handle login from JSON file', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const httpGetSpy = httpClient.get as jasmine.Spy;
    httpGetSpy.and.returnValue(of({ 
      users: [{ username: 'jsonuser', password: 'jsonpass' }] 
    }));
    
    component.loginForm.patchValue({
      username: 'jsonuser',
      password: 'jsonpass'
    });

    component.onSubmit();
    tick();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('currentUser', 'jsonuser');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));
}); 
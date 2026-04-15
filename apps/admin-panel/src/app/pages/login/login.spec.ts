import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthStore } from '../../store/auth';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let signInMock: jest.Mock;

  beforeEach(async () => {
    const signingIn = signal(false);
    signInMock = jest.fn();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        {
          provide: AuthStore,
          useValue: {
            isSigningIn: signingIn,
            signIn: signInMock,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
  });

  it('renders the login page wrapper', () => {
    const page = fixture.nativeElement.querySelector('.login-page');

    expect(page).not.toBeNull();
  });

  it('renders the login card wrapper', () => {
    const card = fixture.nativeElement.querySelector('.login-card');

    expect(card).not.toBeNull();
  });

  it('does not submit when the form is invalid', () => {
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(signInMock).not.toHaveBeenCalled();
  });

  it('submits credentials once when the form is valid', () => {
    const usernameInput = fixture.nativeElement.querySelector('input[name="username"]');
    const passwordInput = fixture.nativeElement.querySelector('input[name="password"]');

    usernameInput.value = 'admin';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'secret';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(signInMock).toHaveBeenCalledTimes(1);
    expect(signInMock).toHaveBeenCalledWith({
      username: 'admin',
      password: 'secret',
    });
  });
});

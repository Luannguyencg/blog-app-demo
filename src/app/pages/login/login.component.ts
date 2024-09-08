import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TextFieldComponent } from '../../components/text-field/text-field.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ETextFieldSize,
  ETextFieldType,
} from '../../components/text-field/types/enum';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ILoginPayload } from '../../types.ts/interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TextFieldComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  ETextFieldType = ETextFieldType;
  ETextFieldSize = ETextFieldSize;
  isSubmitting: boolean = false;

  get f() {
    return this.loginForm.controls;
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  private destroy$ = new Subject<void>();
  private authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm?.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const payload: ILoginPayload = {
        email: this.emailControl?.value,
        password: this.passwordControl?.value,
        remember_me: true
      };
      this.authService
        .handleLogin(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.isSubmitting = false;
            if (res && res.data && res.data.token) {
              this.toastr.success('Login successful!');
              this.router.navigate(['/dashboard/blog']);
            }
          },
          error: (err) => {
            const errMessage = err.error?.errors?.[0]?.message || 'Register failed';
            this.toastr.error(errMessage);
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

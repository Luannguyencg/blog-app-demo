import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, SimpleChange } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextFieldComponent } from '../../components/text-field/text-field.component';
import {
  ETextFieldSize,
  ETextFieldType,
} from '../../components/text-field/types/enum';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TextFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  avatarUrl: string | ArrayBuffer | null | undefined = null;

  registerForm: FormGroup;
  selectedFile: File | null = null;

  ETextFieldType = ETextFieldType;
  ETextFieldSize = ETextFieldSize;
  isSubmitting: boolean = false;

  private destroy$ = new Subject<void>();
  private authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        avatar: [null],
      },
      { validator: this.passwordMatchValidator },
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  get nameControl() {
    return this.registerForm.get('name');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get avatarControl() {
    return this.registerForm.get('avatar');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  previewAvatar(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm?.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = new FormData();

      formData.append('user[name]', this.nameControl?.value);
      formData.append('user[email]', this.emailControl?.value);
      formData.append('user[password]', this.passwordControl?.value);
      if (this.selectedFile) formData.append('user[avatar]', this.selectedFile);

      this.authService
        .handlerRegister(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.isSubmitting = false;

            if (res && res.data) {
              this.toastr.success('Registration successful!');
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            const errMessage = err.error?.errors?.[0]?.message || 'Register failed'
            this.toastr.error(errMessage);
            this.isSubmitting = false;
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { EInputType, ETextFieldSize, ETextFieldType } from './types/enum';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
})
export class TextFieldComponent implements ControlValueAccessor, OnInit {
  @Input() id: string | undefined;
  @Input() label: string | undefined;
  @Input() placeholder: string | undefined;
  @Input() type: ETextFieldType = ETextFieldType.text;
  @Input() inputType: EInputType = EInputType.input;
  @Input() size: ETextFieldSize = ETextFieldSize.medium;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() errorText: string | undefined = '';
  @Input() formControlName: string = '';

  @Output() input = new EventEmitter<Event>();
  @Output() change = new EventEmitter<Event>();

  ETextFieldType = ETextFieldType;
  ETextFieldSize = ETextFieldSize;
  EInputType = EInputType;

  protected _value: any;
  private ngControl: NgControl | undefined;

  get value(): any {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(this._value);
    this.clearErrors();
  }

  get control() {
    return this.ngControl?.control;
  }

  constructor(private injector: Injector) {}

  onChange: (_: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any) {
    this._value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    this.input.emit(event);
  }

  clearErrors(): void {
    if (this.control) {
      this.control.setErrors(null);
      this.control.markAsUntouched();
    }
  }

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl);
  }
}

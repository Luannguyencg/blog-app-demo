import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Blog } from '../../types.ts/interface';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from '../text-field/text-field.component';
import { EInputType } from '../text-field/types/enum';
import { SrcErrorDirective } from '../../directives/src-error.directive';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TextFieldComponent,
    SrcErrorDirective,
  ],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.scss',
})
export class BlogFormComponent implements OnChanges {
  @Output() submitBlog = new EventEmitter();
  @Input() blogDataForEdit: Blog | null = null;
  blogForm: FormGroup;
  EInputType = EInputType;
  imageBlogUrl: string | ArrayBuffer | null | undefined = null;

  selectedFile: File | null | string | undefined = null;

  get f() {
    return this.blogForm.controls;
  }

  get titleControl() {
    return this.blogForm.get('title');
  }

  get contentControl() {
    return this.blogForm.get('content');
  }

  constructor(private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required]],
      image: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blogDataForEdit'] && changes['blogDataForEdit'].currentValue) {
      this.contentControl?.setValue(this.blogDataForEdit?.content);
      this.titleControl?.setValue(this.blogDataForEdit?.title);
      if (this.blogDataForEdit?.image.url) {
        this.selectedFile = this.blogDataForEdit.image.url;
        this.imageBlogUrl = this.blogDataForEdit.image.url;
      }
    }
  }

  previewImageBlog(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageBlogUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.blogForm.markAllAsTouched();
    if (this.blogForm.valid) {
      const formData = new FormData();
      formData.append('blog[title]', this.titleControl?.value || null);
      formData.append('blog[content]', this.contentControl?.value || null);
      if (this.selectedFile) formData.append('blog[image]', this.selectedFile);
      this.submitBlog.emit(formData);
    }
  }
}

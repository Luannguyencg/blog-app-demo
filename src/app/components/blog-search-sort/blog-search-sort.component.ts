import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TextFieldComponent } from '../text-field/text-field.component';
import { ETextFieldType } from '../text-field/types/enum';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ESort } from '../../types.ts/enum';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-search-sort',
  standalone: true,
  imports: [TextFieldComponent, ReactiveFormsModule],
  templateUrl: './blog-search-sort.component.html',
  styleUrl: './blog-search-sort.component.scss',
})
export class BlogSearchSortComponent implements OnInit {
  ESort = ESort
  sortValue: ESort = ESort.desc;
  ETextFieldType = ETextFieldType;
  searchForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
  ) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  get searchControl() {
    return this.searchForm.get('search');
  }

  ngOnInit(): void {
    this.subcribeSearchValueChange();
    this.subcribeQueryParams();
  }

  subcribeQueryParams() {
    this.activateRoute.queryParams
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((params) => {
        this.searchControl?.setValue(params['search']);
        this.sortValue = params['sort'] || ESort.desc
      });
  }

  subcribeSearchValueChange() {
    this.searchControl?.valueChanges
      .pipe(debounceTime(600), takeUntil(this.destroy$))
      .subscribe((searchText) => {
        this.router.navigate([], {
          queryParams: {
            search: searchText || null,
          },
          queryParamsHandling: 'merge',
        });
      });
  }

  handleClickSort() {
    this.sortValue = this.sortValue === ESort.desc ? ESort.asc : ESort.desc;
    this.router.navigate([], {
      queryParams: {
        sort: this.sortValue,
      },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

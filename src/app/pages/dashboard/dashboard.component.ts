import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  combineLatest,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { Blog, IPaginationResponse } from '../../types.ts/interface';
import { BlogListComponent } from '../../components/blog-list/blog-list.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { BlogSearchSortComponent } from '../../components/blog-search-sort/blog-search-sort.component';
import { BlogFormComponent } from '../../components/blog-form/blog-form.component';
import { ESort } from '../../types.ts/enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import {
  selectAllBlogs,
  selectBlogError,
  selectBlogLoading,
  selectBlogPagination,
} from '../../core/store/blog/selectors/blog.selectors';
import * as BlogActions from '../../core/store/blog/actions/blog.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BlogListComponent,
    BlogSearchSortComponent,
    PaginationComponent,
    BlogFormComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild('content', { static: true }) contentModal!: TemplateRef<any>;
  blogs: Blog[] = [];
  searchQuery: string = '';
  sort_direction: ESort = ESort.desc;
  page: number = 1;
  pageSize: number = 20;
  totalBlogs: number = 0;
  blogsLoading: boolean = false;
  isOnEditBlog: boolean = false;
  blogDataForEdit: Blog | null = null;
  private destroy$ = new Subject<void>();

  blogs$: Observable<Blog[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pagination$: Observable<IPaginationResponse | null>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private blogService: BlogService,
    private activateRoute: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private store: Store,
  ) {
    this.blogs$ = this.store.select(selectAllBlogs);
    this.loading$ = this.store.select(selectBlogLoading);
    this.error$ = this.store.select(selectBlogError);
    this.pagination$ = this.store.select(selectBlogPagination);
  }

  ngOnInit(): void {
    this.fetchCurrentUser();
    this.subcribeQueryParams();
    this.subscribeBlogs();
  }

  subscribeBlogs() {
    combineLatest([this.blogs$, this.loading$, this.error$, this.pagination$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([blogs, loading, err, pagination]) => {
        this.blogs = blogs;
          this.totalBlogs = pagination?.count || 0;
          this.blogsLoading = loading;

          if (pagination && this.page > (pagination.total || 0)) {
            this.onPageChange(1);
          }
        
        if (err) {
          console.log('errr', err)
        }
      });
  }

  openModal(content: any = this.contentModal) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onCreateBlog() {
    this.isOnEditBlog = false;
    this.blogDataForEdit = null;
    this.openModal();
  }

  onEditBlog(data: Blog) {
    this.blogDataForEdit = data;
    this.isOnEditBlog = true;
    this.openModal();
  }

  onModalSubmit(event: FormData) {
    if (!this.isOnEditBlog) {
      this.createBlog(event);
    } else {
      this.editBlog(event);
    }
  }

  fetchCurrentUser() {
    this.authService.me().pipe(takeUntil(this.destroy$)).subscribe();
  }

  subcribeQueryParams() {
    this.activateRoute.queryParams
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((params) => {
        this.searchQuery = params['search'];
        this.sort_direction =
          params['sort'] === ESort.asc ? ESort.asc : ESort.desc;
        this.page = params['page'] || 1;

        this.loadBlogs();
      });
  }

  loadBlogs() {
    this.store.dispatch(
      BlogActions.loadBlogs({
        search: this.searchQuery,
        page: this.page,
        sort_direction: this.sort_direction,
      }),
    );
  }

  onPageChange(page: number) {
    this.router.navigate([], {
      queryParams: {
        page: page,
      },
      queryParamsHandling: 'merge',
    });
  }

  navigateToDetail(blogId: number) {
    this.router.navigate([`dashboard/blog/${blogId}`]);
  }

  createBlog(blogData: FormData) {
    this.store.dispatch(BlogActions.addBlog({ blogData }));
  }

  editBlog(blogData: FormData) {
    this.blogService
      .updateBlog(blogData, this.blogDataForEdit?.id.toString() as string)
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.toastr.success('Edit blog successful');
          this.blogs = this.blogs.map((item) => {
            if (item.id === res.data.id) {
              return res.data;
            }
            return item;
          });
          this.modalService.dismissAll();
        },
        error: (err) => {
          const errMessage =
            err.error?.errors?.[0]?.message || 'Edit blog failed';
          this.toastr.error(errMessage);
          this.modalService.dismissAll();
        },
      });
  }

  logout() {
    this.authService.handleLogOut();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

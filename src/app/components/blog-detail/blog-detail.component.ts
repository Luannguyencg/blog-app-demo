import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../types.ts/interface';
import { CommonModule, DatePipe } from '@angular/common';
import { SrcErrorDirective } from '../../directives/src-error.directive';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterModule, CommonModule, DatePipe, SrcErrorDirective],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  private destroy$ = new Subject<void>();
  public currentBlog: Blog | null = null;
  public isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subcribeParams();
  }

  goBack() {
    this.router.navigate(['dashboard/blog'])
  }

  subcribeParams() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['blogId']) this.fetchBlogDetailDataById(params['blogId']);
      });
  }

  fetchBlogDetailDataById(id: string) {
    this.isLoading = true;
    this.blogService
      .getBlogById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.currentBlog = res.data;
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// blog.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as BlogActions from '../actions/blog.actions';
import { BlogService } from '../../../../services/blog.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Injectable()
export class BlogEffects {
  constructor(
    private actions$: Actions,
    private blogService: BlogService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
  ) {}

  navigateToDetail(blogId: number) {
    this.router.navigate([`dashboard/blog/${blogId}`]);
  }

  loadBlogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.loadBlogs),
      mergeMap(({ search, page, sort_direction }) => {
        return this.blogService.getBlogs(search, page, sort_direction).pipe(
          map((response) => {
            return BlogActions.loadBlogsSuccess({
              blogs: response.blogs,
              pagination: response.pagination,
            });
          }),
          catchError((error) => of(BlogActions.loadBlogsFailure({ error }))),
        );
      }),
    ),
  );

  // Effect to add a new blog
  addBlog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.addBlog),
      mergeMap(({ blogData }) =>
        this.blogService.createBlog(blogData).pipe(
          map((response) => {
            this.toastr.success('Blog creation successful');
            this.modalService.dismissAll();
            this.navigateToDetail(response.data.id);
            return BlogActions.addBlogSuccess({ blog: response.data });
          }),
          catchError((error) => {
            const errMessage =
              error.error?.errors?.[0]?.message || 'Blog creation failed';
            this.toastr.error(errMessage);
            this.modalService.dismissAll();
            return of(BlogActions.addBlogFailure({ error }));
          }),
        ),
      ),
    ),
  );

  // Effect to update a blog
  updateBlog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.updateBlog),
      mergeMap(({ blogData, blogId }) =>
        this.blogService.updateBlog(blogData, blogId).pipe(
          map((response) =>{
            this.toastr.success('Edit blog successful');
            this.modalService.dismissAll();
            return BlogActions.updateBlogSuccess({ blog: response.data })
          }
          ),
          catchError((error) => {
            const errMessage =
              error.error?.errors?.[0]?.message || 'Edit blog failed';
            this.toastr.error(errMessage);
            this.modalService.dismissAll();
            return of(BlogActions.updateBlogFailure({ error }));
          }),
        ),
      ),
    ),
  );
}

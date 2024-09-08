// blog.actions.ts
import { createAction, props } from '@ngrx/store';
import { Blog, IPaginationResponse } from '../../../../types.ts/interface';
import { ESort } from '../../../../types.ts/enum';

// Load Blogs
export const loadBlogs = createAction(
  '[Blog] Load Blogs',
  props<{ search: string; page: number; sort_direction: ESort }>()
);
export const loadBlogsSuccess = createAction(
  '[Blog] Load Blogs Success',
  props<{ blogs: Blog[]; pagination: IPaginationResponse }>()
);
export const loadBlogsFailure = createAction(
  '[Blog] Load Blogs Failure',
  props<{ error: any }>()
);

//Create Blog
export const addBlog = createAction(
  '[Blog] Add Blog',
  props<{ blogData: FormData }>()
);
export const addBlogSuccess = createAction(
  '[Blog] Add Blog Success',
  props<{ blog: Blog }>()
);
export const addBlogFailure = createAction(
  '[Blog] Add Blog Failure',
  props<{ error: any }>()
);

//Update
export const updateBlog = createAction(
  '[Blog] Update Blog',
  props<{ blogData: FormData; blogId: string }>()
);
export const updateBlogSuccess = createAction(
  '[Blog] Update Blog Success',
  props<{ blog: Blog }>()
);
export const updateBlogFailure = createAction(
  '[Blog] Update Blog Failure',
  props<{ error: any }>()
);

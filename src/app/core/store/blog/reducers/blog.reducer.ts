// blog.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as BlogActions from '../actions/blog.actions';
import { Blog, IPaginationResponse } from '../../../../types.ts/interface';

export interface BlogState {
  blogs: Blog[];
  pagination: IPaginationResponse | null;
  error: any;
  loading: boolean;
}

export const initialState: BlogState = {
  blogs: [],
  pagination: null,
  error: null,
  loading: false,
};

export const blogReducer = createReducer(
  initialState,
  on(BlogActions.loadBlogs, (state) => ({ ...state, loading: true })),
  on(BlogActions.loadBlogsSuccess, (state, { blogs, pagination }) => ({
    ...state,
    blogs,
    pagination,
    loading: false,
  })),
  on(BlogActions.loadBlogsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(BlogActions.addBlogSuccess, (state, { blog }) => ({
    ...state,
    blogs: [...state.blogs, blog],
  })),
  on(BlogActions.updateBlogSuccess, (state, { blog }) => ({
    ...state,
    blogs: state.blogs.map((b) => (b.id === blog.id ? blog : b)),
  })),
);

// blog.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BlogState } from '../reducers/blog.reducer';

export const selectBlogState = createFeatureSelector<BlogState>('blog');

export const selectAllBlogs = createSelector(selectBlogState, (state) => state.blogs);
export const selectBlogLoading = createSelector(selectBlogState, (state) => state.loading);
export const selectBlogError = createSelector(selectBlogState, (state) => state.error);
export const selectBlogPagination = createSelector(selectBlogState, (state) => state.pagination);

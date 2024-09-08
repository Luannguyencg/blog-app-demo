import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.sevice';
import { ApiBlogCRRespone, Blog, IPaginationResponse } from '../types.ts/interface';
import { blogs } from '../../environments/environment';
import { ESort } from '../types.ts/enum';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private apiService: ApiService) {}

  getBlogs(
    search: string,
    page: number,
    sort_direction: ESort,
  ): Observable<{ blogs: Blog[]; pagination: IPaginationResponse }> {
    const params = {
      page: page.toString(),
      search: search || '',
      sort_direction
    };

    return this.apiService.getAPI(blogs, '', params).pipe(
      map((response) => ({
        blogs: response.data.items,
        pagination: response.pagination,
      })),
    );
  }

  getBlogById(id: string): Observable<ApiBlogCRRespone> {
    return this.apiService.getAPI(blogs, `/${id}`)
  }

  createBlog(blogData: FormData): Observable<ApiBlogCRRespone> {
    return this.apiService.postFormAPI(blogs, '', blogData);
  }

  updateBlog(blogData: FormData, blogId: string): Observable<ApiBlogCRRespone> {
    return this.apiService.putFormAPI(blogs, `/${blogId}`, blogData);
  }
}

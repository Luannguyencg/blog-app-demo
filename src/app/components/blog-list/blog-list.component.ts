import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Blog } from '../../types.ts/interface';
import { CommonModule } from '@angular/common';
import { SrcErrorDirective } from '../../directives/src-error.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, SrcErrorDirective],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
  imgFallbackUrl: string = 'https://files.fullstack.edu.vn/f8-prod/user_avatars/309573/64af7196d84c6.png'
  @Input() blogs: Blog[] = [];
  @Input() loading: boolean = false;

  @Output() onEditBlog = new EventEmitter();

  constructor(private router: Router) {}

  editBlog(blog: Blog) {
    this.onEditBlog.emit(blog)
  }

  navigateToDetail(blogId: number) {
    this.router.navigate([`dashboard/blog/${blogId}`])
  }

  blogTrackBy(index: number, item: Blog) {
    return item.id
  }
}

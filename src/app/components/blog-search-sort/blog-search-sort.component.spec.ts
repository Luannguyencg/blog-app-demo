import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSearchSortComponent } from './blog-search-sort.component';

describe('BlogSearchSortComponent', () => {
  let component: BlogSearchSortComponent;
  let fixture: ComponentFixture<BlogSearchSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogSearchSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogSearchSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

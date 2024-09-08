import { importProvidersFrom } from '@angular/core';
import { Route } from '@angular/router';
import { blogFeatureName } from '../../types.ts/type';
import { blogReducer } from '../../core/store/blog/reducers/blog.reducer';
import { StoreModule } from '@ngrx/store';
import { BlogEffects } from '../../core/store/blog/effects/blog.effects';
import { EffectsModule } from '@ngrx/effects';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BlogDetailComponent } from '../../components/blog-detail/blog-detail.component';

export const LayoutRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: 'blog',
            providers: [
              importProvidersFrom(
                StoreModule.forFeature(blogFeatureName, blogReducer),
                EffectsModule.forFeature([BlogEffects]),
              ),
            ],
            component: DashboardComponent,
          },
          {
            path: 'blog/:blogId',
            component: BlogDetailComponent,
          },
        ],
      },
    ],
  },
];

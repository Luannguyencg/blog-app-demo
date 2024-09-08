import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    component: LoginComponent,
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    component: RegisterComponent,
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/layout/layout.routes').then(m => m.LayoutRoutes)
  },
];

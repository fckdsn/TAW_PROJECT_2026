import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home').then(m => m.Home)
  },

  // ✅ BLOG — bez guarda
  {
    path: 'blog',
    loadComponent: () =>
      import('./components/blog-home/blog-home').then(m => m.BlogHomeComponent)
  },

  // ✅ Szczegóły posta
  {
    path: 'blog/detail/:id',
    loadComponent: () =>
      import('./components/blog-item-details/blog-item-details')
        .then(m => m.BlogItemDetailsComponent),
    canActivate: [authGuard]
  },

  // ✅ Dodawanie posta
  {
    path: 'blog/add',
    loadComponent: () =>
      import('./components/add-post/add-post')
        .then(m => m.AddPostComponent),
    canActivate: [authGuard]
  },

  // ✅ EDYCJA POSTA (🔥 FIX)
  {
    path: 'blog/edit/:id',
    loadComponent: () =>
      import('./components/add-post/add-post')
        .then(m => m.AddPostComponent),
    canActivate: [authGuard]
  },

  // ✅ Profil użytkownika
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./components/user-profile/user-profile')
        .then(m => m.UserProfileComponent),
    canActivate: [authGuard]
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login')
        .then(m => m.LoginComponent)
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup')
        .then(m => m.SignupComponent)
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];

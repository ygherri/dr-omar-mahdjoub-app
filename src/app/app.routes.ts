import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MentionsLegales } from './pages/mentions-legales/mentions-legales';
import { PolitiqueDeConfidentialite } from './pages/politique-de-confidentialite/politique-de-confidentialite';
import { PolitiqueCookies } from './pages/politique-cookies/politique-cookies';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'mentions-legales', component: MentionsLegales },
  { path: 'confidentialite', component: PolitiqueDeConfidentialite },
  { path: 'politique-cookies', component: PolitiqueCookies },

  { path: '**', redirectTo: '' }

  
];
export class AppRoutingModule {}


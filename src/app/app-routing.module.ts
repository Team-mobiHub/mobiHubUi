import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ImpressumComponent } from './impressum/impressum.component';

export const routes: Routes = [
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        pathMatch: 'prefix'
    },
    {
        path: 'trafficmodel',
        loadChildren: () => import('./traffic-model/traffic-model.module').then(m => m.TrafficModelModule),
        pathMatch: 'prefix'
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        title: 'Home'
    },
    {
        path: 'about',
        component: AboutComponent,
        title: 'About'
    },
    {
        path: 'impressum',
        component: ImpressumComponent,
        title: 'Impressum'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

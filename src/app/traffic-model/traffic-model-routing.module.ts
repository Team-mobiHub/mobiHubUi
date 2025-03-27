import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceptTmOwnershipComponent } from './accept-tm-ownership/accept-tm-ownership.component';
import { CreateTrafficModelComponent } from './create-traffic-model/create-traffic-model.component';
import { EditTrafficModelComponent } from './edit-traffic-model/edit-traffic-model.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ViewTrafficModelComponent } from './view-traffic-model/view-traffic-model.component';
import { authGuardService } from '../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: 'acceptownership/:token',
    component: AcceptTmOwnershipComponent,
    title: 'Accept Ownership',
    pathMatch: 'full',
    canActivate: [authGuardService]
  },
  {
    path: 'create',
    component: CreateTrafficModelComponent,
    title: 'Create Traffic Model',
    pathMatch: 'full',
    canActivate: [authGuardService]
  },
  {
    path: 'edit/:id',
    component: EditTrafficModelComponent,
    title: 'Edit Traffic Model',
    pathMatch: 'full',
    canActivate: [authGuardService]
  },
  {
    path: 'search',
    component: SearchResultComponent,
    title: 'Search Result',
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: ViewTrafficModelComponent,
    title: 'View Traffic Model',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrafficModelRoutingModule { }

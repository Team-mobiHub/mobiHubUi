import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponentComponent } from '../search-bar-component/search-bar-component.component';
import { TrafficModelListItemComponent } from '../traffic-model-list-item/traffic-model-list-item.component';
import { TrafficModelListComponent } from '../traffic-model-list/traffic-model-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MatProgressSpinner } from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    SearchBarComponentComponent,
    TrafficModelListComponent,
    TrafficModelListItemComponent,
    StarRatingComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormField,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinner,
  ],
  exports: [
    SearchBarComponentComponent,
    TrafficModelListComponent,
    TrafficModelListItemComponent,
    StarRatingComponent,
  ],
})
/**
 * The SharedModule class is an Angular module that is intended to be shared across different parts of the application.
 * It can contain common components, directives, pipes, and services that are used by multiple feature modules.
 */
export class SharedModule {
}

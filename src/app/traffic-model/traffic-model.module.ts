import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/dtos/shared.module';
import { AcceptTmOwnershipComponent } from './accept-tm-ownership/accept-tm-ownership.component';
import { CommentsComponent } from './comments/comments.component';
import { CreateTrafficModelComponent } from './create-traffic-model/create-traffic-model.component';
import { DropZoneComponent } from './drop-zone/drop-zone.component';
import { EditTrafficModelComponent } from './edit-traffic-model/edit-traffic-model.component';
import { EllipsisPipe } from './ellipsis.pipe';
import { FileSizePipe } from './file-size.pipe';
import { OverwriteFileDialogComponent } from './overwrite-file-dialog/overwrite-file-dialog.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TrafficModelRoutingModule } from './traffic-model-routing.module';
import { ViewTrafficModelComponent } from './view-traffic-model/view-traffic-model.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TrafficModelFormComponent } from './traffic-model-form/traffic-model-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeleteTmDialogComponent } from './delete-tm-dialog/delete-tm-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    SearchResultComponent,
    CreateTrafficModelComponent,
    TrafficModelFormComponent,
    EditTrafficModelComponent,
    AcceptTmOwnershipComponent,
    ViewTrafficModelComponent,
    CommentsComponent,
    DropZoneComponent,
    OverwriteFileDialogComponent,
    FileSizePipe,
    EllipsisPipe,
    DeleteTmDialogComponent
  ],
  exports: [
    CommentsComponent
  ],
  imports: [
    CommonModule,
    TrafficModelRoutingModule,
    SharedModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTooltipModule,
  ]
})
export class TrafficModelModule { }

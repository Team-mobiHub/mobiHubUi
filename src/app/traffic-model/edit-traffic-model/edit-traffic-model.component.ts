import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrafficModelService } from '../../shared/services/traffic-model.service';
import { ChangeTrafficModelDTO } from '../../shared/dtos/ChangeTrafficModelDTO';
import { map, Observable, switchMap } from 'rxjs';
import { TrafficModelDto } from '../../shared/dtos/traffic-model-dto';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTmDialogComponent } from '../delete-tm-dialog/delete-tm-dialog.component';

/**
 * Component responsible for editing a traffic model.
 */
@Component({
  selector: 'mh-edit-traffic-model',
  standalone: false,

  templateUrl: './edit-traffic-model.component.html',
  styleUrl: './edit-traffic-model.component.scss'
})
export class EditTrafficModelComponent {
  /**
   * An observable containing the traffic model to be edited.
   */
  trafficModel$: Observable<TrafficModelDto>;

  /**
   * Indicates whether a fatal error occurred during the registration process.
   */
  fatalSavingError = false;

  /**
   * Indicates whether the upload process is running.
   */
  isUploadProcessRunning = false;

  /**
   * A dialog service used to open and manage the delete traffic model dialog.
   */
  readonly deleteTrafficModelDialog = inject(MatDialog);

  constructor(private trafficModelService: TrafficModelService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.trafficModel$ = this.route.paramMap.pipe(
      map(paramy => paramy.get('id')!),
      switchMap(id => this.trafficModelService.getById(Number(id)))
    );
  }

  /**
   * Opens the delete traffic model dialog.
   * This dialog asks the user to confirm if they want to delete a traffic model.
   * 
   * @param trafficModelId The ID of the traffic model to be deleted.
   */
  openDeleteDialog(trafficModelId: number) {
    const dialogRef = this.deleteTrafficModelDialog.open(DeleteTmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // This is executed if the user confirms the deletion
        this.delete(trafficModelId);
      }
    });
  }

  /**
   * Delets a traffic model.
   * 
   * @param trafficModelid The ID of the traffic model to be deleted.
   */
  private delete(trafficModelid: number) {
    this.trafficModelService.delete(trafficModelid).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.fatalSavingError = true;
      }
    });
  }

  /**
   * Updates a traffic model using the provided event.
   * 
   * After the traffic model is edited, the user is navigated to the traffic model page.
   * 
   * @param event - The event required to edit a traffic model.
   * @param event.createTmDTO - The DTO containing the data to be updated.
   * @param event.zipFile - The ZIP file containing the traffic model data.
   * @param event.images - The images to be uploaded.
   * @param event.formSubmissionCompleted - A callback function to be called after the form submission is completed.
   * 
   * @returns void
   */
  update(event: {
    createTmDTO: ChangeTrafficModelDTO,
    zipFile: File,
    images: File[],
    formSubmissionCompleted: () => void
  }) {
    this.isUploadProcessRunning = true;

    this.trafficModelService.update(event.createTmDTO, event.zipFile, event.images).subscribe({
      next: editedTrafficModel => {
        this.isUploadProcessRunning = false;
        this.router.navigate(['/trafficmodel', editedTrafficModel.id]);
      },
      error: () => {
        // Show an error message to the user if there was an error registering the user and it is not clear, why
        this.isUploadProcessRunning = false;
        this.fatalSavingError = true;

        event.formSubmissionCompleted();
      }
    });
  }
}

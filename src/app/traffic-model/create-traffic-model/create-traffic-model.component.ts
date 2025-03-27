import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeTrafficModelDTO } from '../../shared/dtos/ChangeTrafficModelDTO';
import { TrafficModelService } from '../../shared/services/traffic-model.service';

/**
 * Component responsible for creating a traffic model.
 */
@Component({
  selector: 'mh-create-traffic-model',
  standalone: false,

  templateUrl: './create-traffic-model.component.html',
  styleUrl: './create-traffic-model.component.scss'
})
export class CreateTrafficModelComponent {
  /**
   * Indicates whether a fatal error occurred during the registration process.
   */
  fatalRegistrationError = false;

  /**
   * Indicates whether the upload process is running.
   */
  isUploadProcessRunning = false;

  /**
   * Constructor for CreateTrafficModelComponent.
   * @param trafficModelService - Service to handle traffic model creation.
   * @param router - Router to navigate to the traffic model page after creation.
   */
  constructor(private trafficModelService: TrafficModelService,
    private router: Router
  ) { }


  /**
   * Creates a new traffic model using the provided event.
   * 
   * After the traffic model is created, the user is navigated to the traffic model page.
   * 
   * @param event - The event required to create a traffic model.
   * @param event.createTmDTO - The DTO containing the traffic model details.
   * @param event.zipFile - The zip file associated with the traffic model.
   * @param event.images - An array of image files related to the traffic model.
   * @param event.formSubmissionCompleted - Callback function to be called after the form submission is completed.
   * 
   * @returns void
   */
  create(event: {
    createTmDTO: ChangeTrafficModelDTO,
    zipFile: File,
    images: File[],
    formSubmissionCompleted: () => void
  }) {
    this.isUploadProcessRunning = true;

    this.trafficModelService.create(event.createTmDTO, event.zipFile, event.images).subscribe({
      next: createdTrafficModel => {
        console.info('Traffic model created:', createdTrafficModel.id);
        this.isUploadProcessRunning = false;
        this.router.navigate(['/trafficmodel', createdTrafficModel.id]);
      },
      error: () => {
        // Show an error message to the user if there was an error registering the user and it is not clear, why
        this.isUploadProcessRunning = false;
        this.fatalRegistrationError = true;

        event.formSubmissionCompleted();
      }
    });
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrafficModelDto } from '../../shared/dtos/traffic-model-dto';
import { Framework, FRAMEWORK_PRETTY_STRINGS } from '../../shared/enums/framework';
import { MODEL_LEVEL_PRETTY_STRINGS, ModelLevel } from '../../shared/enums/model-level';
import { MODEL_METHOD_PRETTY_STRINGS, ModelMethod } from '../../shared/enums/model-method';
import { TrafficModelService } from '../../shared/services/traffic-model.service';
import { UserService } from '../../shared/services/user.service';
import { TeamService } from '../../shared/services/team.service';
import { AuthService } from '../../shared/services/auth.service';
import { InteractionService } from '../shared/interaction.service';
import { HttpStatusCode } from '@angular/common/http';
import { UserDto } from '../../shared/dtos/user-dto';

/**
 * This component represents the primary view on a traffic model that's been uploaded to mobiHub.
 *
 * It retrieves the model data via an API call to the backend, initalizes the parameters for the page
 * and provides methods for downloading, favoriting and routing.
 */
@Component({
  selector: 'mh-view-traffic-model',
  standalone: false,
  templateUrl: './view-traffic-model.component.html',
  styleUrl: './view-traffic-model.component.scss'
})
export class ViewTrafficModelComponent {
  private userUrl: string = '/user/';
  private teamUrl: string = '/team/';
  
  /**
   * The URL for the search page.
   */
  searchUrl: string = '/trafficmodel/search';

  // Error messages for different scenarios
  private readonly TM_NOT_FOUND_HEADING = "Traffic Model Not Found";
  private readonly TM_NOT_FOUND_BODY = "The requested traffic model does not exist.";

  private readonly ACCESS_DENIED_HEADING = "Access Denied";
  private readonly ACCESS_DENIED_BODY = "You do not have permission to view this traffic model. Please log in or contact the owner.";

  private readonly UNKOWN_ERROR_HEADING = "Unknown Error";
  private readonly UNKOWN_ERROR_BODY = "An unknown error occurred. Please check your internet connection or try again later.";

  /**
   * Determines whether the user has access to additional functionality like editing.
   */
  isUserOwner = false; //initalized during ngOnInit()
  /**
   * Determines whether the traffic model has multiple pictures and navigation buttons are required.
   */
  hasMultiplePictures = false;
  /**
   * Depicts which image of the traffic model images should be displayed currently.
   */
  currentImageIndex: number = 0;

  /**
   * Contains all of the enum values for frameworks.
   */
  frameworks = Object.values(Framework);
  /**
   * Contains all of the pretty strings for the frameworks.
   */
  FRAMEWORK_PRETTY_STRINGS = FRAMEWORK_PRETTY_STRINGS;

  /**
   * Contains all of the enum values for model levels.
   */
  modelLevels = Object.values(ModelLevel);
  /**
   * Contains all of the pretty strings for the model levels.
   */
  MODEL_LEVEL_PRETTY_STRINGS = MODEL_LEVEL_PRETTY_STRINGS;

  /**
   * Contains all of the enum values for model methods.
   */
  modelMethods = Object.values(ModelMethod)
  /**
   * Contains all of the pretty strings for the model methods.
   */
  MODEL_METHOD_PRETTY_STRINGS = MODEL_METHOD_PRETTY_STRINGS;
  
  /**
   * The heading of the error message.
   */
  ERROR_MESSAGE_HEADING: string = this.UNKOWN_ERROR_HEADING;

  /**
   * The body of the error message.
   */
  ERROR_MESSAGE_BODY: string = this.UNKOWN_ERROR_BODY;

  /**
   * Determines if the loading spinner should be displayed.
   */
  isLoading: boolean = true;

  trafficmodelId!: number;
  trafficModelOwnerName!: string;
  trafficModelOwnerURL!: string;
  trafficModel!: TrafficModelDto;
  trafficModelFound!: boolean;

  constructor(private route: ActivatedRoute, private router: Router,
    private trafficModelService: TrafficModelService,
    private userService: UserService,
    private teamService: TeamService,
    private authService: AuthService,
    private interactionService: InteractionService) {
  }

  /**
   * Initalizes the page with the requested values.
   * Determines whether the current user can edit
   * and assignes the traffic model owner's name on the page.
   * Also checks if there are multiple images and buttons for them are required.
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.trafficmodelId = params['id'];

      // Retrieve requested model
      this.trafficModelService.getById(this.trafficmodelId).subscribe({
        next: (model: TrafficModelDto) => {
          this.trafficModelFound = true;
          this.trafficModel = model;
          this.hasMultiplePictures = this.trafficModel.imageURLs.length > 1;

          // Assign view permissions
          this.authService.getCurrentUser().subscribe(user => {
            this.setCurrentUser(user);
          });

          // Get Owner data
          if (this.trafficModel.userId) {
            this.userService.getById(this.trafficModel.userId).subscribe(user => {
              this.trafficModelOwnerName = user.name;
              this.trafficModelOwnerURL = `${this.userUrl}${user.id}`;
            });
          } else if (this.trafficModel.teamId) {
            this.teamService.getById(this.trafficModel.teamId).subscribe(team => {
              this.trafficModelOwnerName = team.name;
              this.trafficModelOwnerURL = `${this.teamUrl}${team.id}`;
            });
          }
          
          this.isLoading = false;
        },
        error: error => {
          console.error("Error fetching traffic model:", error);
          this.trafficModelFound = false;

          if (error.status === HttpStatusCode.Unauthorized) {
            this.ERROR_MESSAGE_HEADING = this.ACCESS_DENIED_HEADING;
            this.ERROR_MESSAGE_BODY = this.ACCESS_DENIED_BODY;
          } else if (error.status === HttpStatusCode.NotFound) {
            this.ERROR_MESSAGE_HEADING = this.TM_NOT_FOUND_HEADING;
            this.ERROR_MESSAGE_BODY = this.TM_NOT_FOUND_BODY;
          } else {
            this.ERROR_MESSAGE_HEADING = this.UNKOWN_ERROR_HEADING;
            this.ERROR_MESSAGE_BODY = this.UNKOWN_ERROR_BODY;
          }
          this.isLoading = false;
        }
      });
    })
  }


  /**
   * Sets the current user and determines if the user is the owner of the traffic model.
   * 
   * @param user - The user object of type UserDto or null.
   * 
   * This method updates the `isUserOwner` property to true if the user is not null and either:
   * - The user's ID matches the traffic model's user ID, or
   * - The user is part of a team whose ID matches the traffic model's team ID.
   */
  private setCurrentUser(user: UserDto | null) {
    this.isUserOwner = user != null
      && ((user.id === this.trafficModel.userId)
        || user.teams.some(team => this.trafficModel.teamId === team.id));
  }

  /**
   * Switches the image in the image box to the next one.
   */
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.trafficModel.imageURLs.length;
  }

  /**
   * Switches the image in the image box to the previous one.
   */
  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.trafficModel.imageURLs.length) % this.trafficModel.imageURLs.length;
  }

  /**
   * Sets the favorite status of traffic model to the opposite of what the current user has it as.
   * Requires that the user is logged-in and redirects him to that page if he isn't.
   */
  favouriteModel() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user == null) {
        this.router.navigate([`/user/login`])
        return
      }
      if (this.trafficModel.isFavorite) {
        this.interactionService.removeFavorite(this.trafficModel.id).subscribe({
          next: _response => {
            this.trafficModel.isFavorite = !this.trafficModel.isFavorite;
          }
        });
      } else {
        this.interactionService.addFavorite(this.trafficModel.id).subscribe({
          next: _response => {
            this.trafficModel.isFavorite = !this.trafficModel.isFavorite;
          }
        });
      }

    });
  }

  /**
   * Navigates to the corresponding edit model page.
   */
  editModel() {
    this.router.navigate([`/trafficmodel/edit/${this.trafficmodelId}`,])
  }

  /**
   * Retrieves a download link for the traffic model and opens it, initating the download.
   */
  downloadModel() {
    this.trafficModelService.downloadTrafficModelData(this.trafficmodelId).subscribe(url => {
      window.open(url, '_blank');
    });
  }
}

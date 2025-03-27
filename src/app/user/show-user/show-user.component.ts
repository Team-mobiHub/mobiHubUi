import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { OwnerType } from '../../shared/enums/owner-type';
import { Location } from '@angular/common';
import { TeamDto } from '../../shared/dtos/team-dto';
import { TrafficModelDto } from '../../shared/dtos/traffic-model-dto';
import { UserDto } from '../../shared/dtos/user-dto';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { TrafficModelService } from '../../shared/services/traffic-model.service';
import { InteractionService } from '../../traffic-model/shared/interaction.service';
import { SearchResultItemDto } from '../../shared/dtos/search-result-item-dto';

enum TrafficModelFilterType {
  Private,
  Public,
  Favorite
}

@Component({
  selector: 'mh-show-user',
  standalone: false,

  templateUrl: './show-user.component.html',
  styleUrl: './show-user.component.scss'
})


/**
 * ShowUserComponent displays the profile of a user.
 * and gives him access to his teams and traffic models
 * and the Option to edit his profile
 */
export class ShowUserComponent implements OnInit {

  /**
   * The URL of the default profile picture file.
   */
  readonly DEFAULT_PICTURE = "/images/default_profile_picture.png"
  /**
   * Route to the edit user page.
   */
  readonly editUserRoute = '/user/edit';
  /**
   * Route to the team page.
   */
  readonly teamRoute = '/team';
  /**
   * Route to the create team page.
   */
  readonly createTeamRoute = '/team/create-team';
  /**
   * The Url used to display the ProfilePicture
   */
  profilePictureURL = '';
  /**
   * Id of the user that will be displayed.
   */
  userId: number = 0;
  /**
   * Name of the user that will be displayed.
   */
  userName: string = 'Unknown User';
  /**
   * is referring to the current user, NOT the viewed user
   */
  hasEditRights: boolean = false;
  /**
   * the Filter that will be applied to the traffic models List
   */
  currentFilter: TrafficModelFilterType = TrafficModelFilterType.Public;
  /**
   * Boolean to Toggle the display of more teams.
   */
  showMoreTeamsToggle: boolean = false;
  /**
   * string that holds the Error Code that will be displayed to the User, in case the user was not found
   */
  userFindingError: string = '';
  /**
   * string that holds the Error Code that will be displayed to the User, in case the teams were not found
   */
  teamsFindingError: string = '';
  /**
   * Boolean that indicates if the user was found.
   * an Error will be displayed in that case
   */
  userFound: boolean = true;

  private userPublicTrafficModels: SearchResultItemDto[] = [];
  private userPrivateTrafficModels: SearchResultItemDto[] = [];
  private userFavoriteTrafficModels: SearchResultItemDto[] = [];
  /**
   * Observable that holds the traffic models that should be displayed based on the Filter
   */
  trafficModelsToShow: SearchResultItemDto[] | undefined;

  /**
   * Determines if the loading spinner should be displayed.
   */
  isLoading: boolean = true;
  /**
   * Observable that holds the teams of the user
   */
  teamDTOs: Observable<TeamDto[]> = new Observable<TeamDto[]>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly trafficModelService: TrafficModelService,
    private readonly interactionService: InteractionService,
    private readonly authService: AuthService,
    private readonly location: Location) {
    this.assignDefaultValues()
  }

  private assignDefaultValues() {
    this.profilePictureURL = '';
    this.userId = 0;
    this.userName = 'Unknown User';
    this.hasEditRights = false;
    this.currentFilter = TrafficModelFilterType.Public;
    this.showMoreTeamsToggle = false;
    this.userFindingError = '';
    this.teamsFindingError = '';
    this.userFound = true;

    this.userPublicTrafficModels = [];
    this.userPrivateTrafficModels = [];
    this.userFavoriteTrafficModels = [];

    this.isLoading = true;
    this.teamDTOs = new Observable<TeamDto[]>();
  }

  /**
   * Method is called when the component is initialized.
   * it manages the whole setup of the component.
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.assignDefaultValues();
      this.userId = +params['id'];
      this.assignUserAttributes(this.userId);

      this.authService.getCurrentUser().subscribe({
        next: user => {
          if (user !== null && (this.userId === user?.id || user?.isAdmin)) {
            this.hasEditRights = true
          }

          this.setFilteredLists()
        },
        error: _error => {
          this.hasEditRights = false
        }
      })
    });

    this.applyTrafficModelFilter(TrafficModelFilterType.Public);
  }

  private assignUserAttributes(userId: number) {
    this.userService.getById(userId).subscribe({
      next: (userDto: UserDto) => {
        this.userName = userDto.name;
        if (userDto.profilePictureLink.length > 0) {
          this.profilePictureURL = userDto.profilePictureLink;
        } else {
          this.profilePictureURL = ""
        }
        this.teamDTOs = of(userDto.teams);
      },
      error: error => {
        this.userFound = false;
        this.userFindingError = error.status;
      }
    });
  }

  /**
   * Sets the filtered lists of traffic models.
   */
  private setFilteredLists() {
    forkJoin({
      allTrafficModels: this.trafficModelService.getByOwner(this.userId, OwnerType.USER),
      favoriteTrafficModels: this.authService.isAuthenticated() ? this.interactionService.getFavoritesOfUser() : of([])
    }).subscribe({
      next: ({allTrafficModels, favoriteTrafficModels}) => {
        // public models
        this.userPublicTrafficModels = allTrafficModels
          .filter(trafficModel => trafficModel.isVisibilityPublic)
          .map(trafficModel => this.mapToSearchResultItemDto(trafficModel));

        // private models
        this.userPrivateTrafficModels = allTrafficModels
          .filter(trafficModel => !trafficModel.isVisibilityPublic)
          .map(trafficModel => this.mapToSearchResultItemDto(trafficModel));

        // favored models
        if (this.authService.isAuthenticated()) {
          this.userFavoriteTrafficModels = favoriteTrafficModels.map(trafficModel =>
            this.mapToSearchResultItemDto(trafficModel)
          );
        }

        this.applyTrafficModelFilter(this.currentFilter);
        this.isLoading = false;
      },
      error: _error => {
        this.trafficModelsToShow = [];
        this.isLoading = false;
      }
    })
  }

  /**
   * Maps a TrafficModelDto to a SearchResultItemDto.
   *
   * @param trafficModel The TrafficModelDto to map.
   */
  private mapToSearchResultItemDto(trafficModel: TrafficModelDto): SearchResultItemDto {
    return {
      trafficModelId: trafficModel.id,
      name: trafficModel.name,
      description: trafficModel.description,
      averageRating: trafficModel.rating.averageRating,
      imageURL: trafficModel.imageURLs[0]
    };
  }

  /**
   * Toggles to show more or less teams on the page.
   */
  onShowMoreTeamsToggleButtonClick() {
    this.showMoreTeamsToggle = !this.showMoreTeamsToggle;
  }

  /**
   * Filters the traffic models to show only private ones.
   */
  onShowPrivateButtonClick() {
    this.applyTrafficModelFilter(TrafficModelFilterType.Private)
  }

  /**
   * Filters the traffic models to show only public ones.
   */
  onShowPublicButtonClick() {
    this.applyTrafficModelFilter(TrafficModelFilterType.Public)
  }

  /**
   * Filters the traffic models to show only ones marked as Favourite.
   */
  onShowFavouriteButtonClick() {
    this.applyTrafficModelFilter(TrafficModelFilterType.Favorite)
  }

  /**
   * Navigates back to the previous page.
   */
  onBackButtonClick() {
    this.location.back();
  }

  /**
   * Applies the filter type
   *
   * @param trafficModelFilterType The filter type to apply
   */
  private applyTrafficModelFilter(trafficModelFilterType: TrafficModelFilterType) {
    this.currentFilter = trafficModelFilterType
    switch (trafficModelFilterType) {
      case TrafficModelFilterType.Private:
        this.trafficModelsToShow = this.userPrivateTrafficModels;
        break;
      case TrafficModelFilterType.Public:
        this.trafficModelsToShow = this.userPublicTrafficModels;
        break;
      case TrafficModelFilterType.Favorite:
        this.trafficModelsToShow = this.userFavoriteTrafficModels;
        break;
    }
  }

  protected readonly TrafficModelFilterType = TrafficModelFilterType;
}

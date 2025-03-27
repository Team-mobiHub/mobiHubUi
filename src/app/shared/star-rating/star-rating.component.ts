import { Component, Input } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { RatingDto } from '../../shared/dtos/rating-dto';
import { InteractionService } from '../../traffic-model/shared/interaction.service';

/**
 * Represents the rating of a traffic model in the 1-5 Star rating model.
 */
@Component({
  selector: 'mh-star-rating',
  standalone: false,
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  /** symbolises a full star */
  STAR_RATING_FULL = 'full';
  /** symoblises a half full star */
  STAR_RATING_HALF = 'half';
  /** symbolises an empty star */
  STAR_RATING_NONE = 'empty';

  /**
   * The userId from the authenticated user. If it dosen't exist, the user can' rate.
   */
  userId?: number | null;

  /**
   * True, if this component is used as a searchResultRating.
   */
  @Input() searchResultRating: boolean = false;
  @Input() rating!: RatingDto;

  constructor(
    private readonly interactionService: InteractionService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  /**
   * Calculates the types of stars that need to be displayed based on the given rating.
   *
   * @param rating The rating given
   * @returns Returns an array of strings representing the stars to be displayed.
   */
  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill(this.STAR_RATING_FULL),
      ...(hasHalfStar ? [this.STAR_RATING_HALF] : []),
      ...Array(emptyStars).fill(this.STAR_RATING_NONE),
    ];
  }

  /**
   * Handles the user rating depending on if it's a new rating or an update of one.
   *
   * @param rating The given rating
   */
  rateModel(rating: number) {
    if (!this.userId) {
      this.router.navigate([`/user/login`]);
      return;
    }
    if (this.rating.usersRating === 0) {
      this.interactionService
        .addRating(this.rating.trafficModelId, rating)
        .subscribe({
          next: (rating: RatingDto) => {
            this.rating = rating;
          },
        });
    } else {
      this.interactionService
        .updateRating(this.rating.trafficModelId, rating)
        .subscribe({
          next: (rating: RatingDto) => {
            this.rating = rating;
          },
        });
    }
  }

  /**
   * Removes the user's rating of a traffic model.
   */
  deleteRating() {
    if (!this.userId) {
      this.router.navigate([`/user/login`]);
      return;
    }
    this.interactionService
      .deleteRating(this.rating.trafficModelId, this.userId)
      .subscribe({
        next: (averageRating: number) => {
          this.rating.usersRating = 0
          this.rating.averageRating = averageRating
        }
      });
  }

  /**
   * Fires on initialisation of the component
   */
  ngOnInit() {
    this.authService
      .getCurrentUser()
      .subscribe(user => this.userId = user?.id);
  }
}

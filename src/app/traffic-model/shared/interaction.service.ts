import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TrafficModelDto } from '../../shared/dtos/traffic-model-dto';
import { ApiService } from '../../shared/services/api.service';
import { CreateCommentDto } from './create-comment-dto';
import { CommentDto } from '../../shared/dtos/comment-dto';
import { RatingDto } from '../../shared/dtos/rating-dto';


@Injectable({
  providedIn: 'root'
})
/**
 * this Service Handles Requests that are related to Comments, Favorites, or Ratings
 */
export class InteractionService extends ApiService {

  private readonly commentURL = this.backendBaseUrl + '/comment';

  /**
   * Url endpoint for any Request that is related to Favorites
   */
  favoriteUrl = this.backendBaseUrl + '/favorite';

  /**
   * Url endpoint for any Request that is related to Ratings
   */
  ratingUrl: string = this.backendBaseUrl + '/rating';

  /**
   * Url endpoint for any Request that is related to Comments
   */
  commentUrl: string = this.backendBaseUrl + '/comment'

  /**
 * Creates an instance of InteractionService.
 *
 * @param http - An instance of HttpClient used to make HTTP requests.
 */
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Adds the given model to the given user's favorite models
   * 
   * @param trafficModelId 
   * @param userId 
   * 
   * @returns An observable of the backend response.
   */
  addFavorite(trafficModelId: number): Observable<any> {
    return this.http.post(`${this.favoriteUrl}/${trafficModelId}`, null);
  }

  /**
   * Removes a given model from a given user's favorite models.
   * 
   * @param trafficModelId 
   * @param userId 
   * @returns An observable of the backend response.
   */
  removeFavorite(trafficModelId: number): Observable<any> {
    return this.http.delete(`${this.favoriteUrl}/${trafficModelId}`)
  }

  /**
   * Adds a rating to the traffic model ratings
   * 
   * @param trafficModelId The id of the model to be rated
   * @param rating The rating to be given
   * @returns An observable of a RatingDTO
   */
  addRating(trafficModelId: number, rating: number): Observable<RatingDto> {
    return this.http.post<RatingDto>(`${this.ratingUrl}/${trafficModelId}/${rating}`, null)
  }

  /**
   * Updates a user's rating of a specific traffic model.
   * 
   * @param trafficModelId The id of the model whose rating is to be updated
   * @param userId The id of the user who's rating the model
   * @param rating The rating to be given
   * @returns An observable of a RatingDTO
   */
  updateRating(trafficModelId: number, rating: number): Observable<RatingDto> {
    return this.http.put<RatingDto>(`${this.ratingUrl}/${trafficModelId}/${rating}`, null)
  }

  /**
   * Deletes the user's rating of a specific traffic model.
   * 
   * @param trafficModelId The id of the model whose rating is to be deleted
   * @param userId The id of the user whose rating will be deleted
   * @returns An observable that contains the new model average rating.
   */
  deleteRating(trafficModelId: number, userId: number): Observable<number> {
    return this.http.delete<number>(`${this.ratingUrl}/${userId}/${trafficModelId}`)
  }

  /**
   * retrieves all trafficModels that are marked as favorite of the logged in User
   */
  getFavoritesOfUser(): Observable<TrafficModelDto[]> {
    return this.http.get<TrafficModelDto[]>(this.favoriteUrl);
  }

  /**
   * Add a comment to a TrafficModel
   *
   * @param commentRequest the [CreateCommentDto]{@link CreateCommentDto} object used to create a comment
   * @returns the [CommentDto]{@link CommentDto} of the Comment created
   */
  addComment(commentRequest: CreateCommentDto): Observable<CommentDto> {
    return this.http.post<CommentDto>(this.commentURL, commentRequest);
  }

  /**
   * update a comment
   *
   * @param commentRequest the [CreateCommentDto]{@link CreateCommentDto} holds the infos used to update the comment
   * @returns the [CommentDto]{@link CommentDto} of the updated comment
   */
  updateComment(commentRequest: CreateCommentDto): Observable<CommentDto> {
    return this.http.put<CommentDto>(this.commentURL + '/' + commentRequest.id, commentRequest);
  }

  /**
   * deletes the Comment
   *
   * @param commentId the id of the comment to delete
   */
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(this.commentURL + '/' + commentId);
  }
}

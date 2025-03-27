import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { TeamDto } from '../dtos/team-dto';
import {Observable, of} from 'rxjs';
import { TeamInvitationRequestDto } from '../dtos/team-invitation-request-dto';

/**
 * The `TeamService` class provides methods for team management.
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService extends ApiService {

  /**
   * Creates an instance of TeamService.
   *
   * @param http - An instance of HttpClient used to make HTTP requests.
   */
  constructor(private http: HttpClient) {
    super();
  }

  create(team: TeamDto): Observable<TeamDto> {
    throw new Error('Method not implemented.');
  }

  update(team: TeamDto): Observable<TeamDto> {
    throw new Error('Method not implemented.');
  }

  getById(id: number): Observable<TeamDto> {
    throw new Error('Method not implemented.');
  }

  delete(teamId: number): Observable<any> {
    throw new Error('Method not implemented.');
  }

  transferOwnershipWithEmail(teamId: number, emailAddress: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  useTransferOwnershipLink(token: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getTeamInvitationLink(teamId: number): Observable<string> {
    throw new Error('Method not implemented.');
  }

  sendTeamInvitationByEmail(request: TeamInvitationRequestDto): Observable<any> {
    throw new Error('Method not implemented.');
  }

  useTeamInvitationLink(token: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
}

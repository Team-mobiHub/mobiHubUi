import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SearchResultItemDto } from '../shared/dtos/search-result-item-dto';
import { TrafficModelService } from '../shared/services/traffic-model.service';

/**
 * Component responsible for the home page of the application.
 */
@Component({
  selector: 'mh-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  /**
   * Observable that contains the traffic models to be displayed on the home page.
   */
  trafficModels$: Observable<SearchResultItemDto[]>;

  constructor(private readonly tmService: TrafficModelService) {
    this.trafficModels$ = this.tmService.search(
      {
        page: 0,
        pageSize: 20,
        name: null,
        authorName: null,
        region: null,
        modelLevels: [],
        modelMethods: [],
        frameworks: []
      }
    ).pipe(map((result: { searchResult: SearchResultItemDto[]; }) => result.searchResult));
  }
}

import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { SearchResultItemDto } from '../../shared/dtos/search-result-item-dto';
import { SearchRequestDto } from '../../shared/dtos/search-request-dto';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TrafficModelService } from '../../shared/services/traffic-model.service';
import { ModelLevel } from '../../shared/enums/model-level';
import { ModelMethod } from '../../shared/enums/model-method';
import { Framework } from '../../shared/enums/framework';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'mh-search-result',
  standalone: false,
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})

/**
 * The component that represents the search result.
 */
export class SearchResultComponent implements OnInit {
  /**
   * The traffic models, which are the search results.
   */
  trafficModels: SearchResultItemDto[] | undefined;
  /**
   * The total amount of search results, matching the search criteria.
   */
  searchResultsCount: number | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tmService: TrafficModelService
  ) {}

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(map(params => this.createSearchRequestDto(params, 10, 0)))
      .subscribe(searchRequest => {
        this.search(searchRequest);
      });
  }

  /**
   * Creates a search request DTO from the query parameters.
   *
   * @param params The query parameters.
   * @param pageSize The page size.
   * @param page The page.
   */
  private createSearchRequestDto(params: ParamMap, pageSize: number, page: number): SearchRequestDto {
    return {
      page: page,
      pageSize: pageSize,
      name: params.get('identifier') ?? null,
      authorName: params.get('author') ?? null,
      region: params.get('region') ?? null,
      modelLevels: (params.getAll('modelLevel') || []).map(
        level => level as ModelLevel
      ),
      modelMethods: (params.getAll('modelMethod') || []).map(
        method => method as ModelMethod
      ),
      frameworks: (params.getAll('framework') || []).map(
        framework => framework as Framework
      ),
    };
  }

  /**
   * Searches for traffic models.
   *
   * @param searchRequest The search request.
   */
  private search(searchRequest: SearchRequestDto): void {
    this.tmService.search(searchRequest).subscribe(result => {
      this.trafficModels = result.searchResult;
      this.searchResultsCount = result.totalCount;
    });
  }

  /**
   * Handles the page change event.
   *
   * @param event The page event.
   */
  onPageChange(event: PageEvent): void {
    const params = this.route.snapshot.queryParamMap;
    const searchRequest = this.createSearchRequestDto(params, event.pageSize, event.pageIndex);
    this.search(searchRequest);
  }
}

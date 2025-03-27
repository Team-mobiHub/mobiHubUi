import { SearchResultItemDto } from "./search-result-item-dto"

/**
 * The search result data transfer object.
 *
 * @property searchResult The search result.
 * @property totalCount The total count of the search result.
 */
export interface SearchResultDto {
  /**
   * The search result.
   */
  searchResult : SearchResultItemDto[];
  /**
   * The total count of the search result.
   */
  totalCount : number;
}

import { Component, Input } from '@angular/core';
import { SearchResultItemDto } from '../dtos/search-result-item-dto';

/**
 * This component displays a single traffic model.
 * It is used in the TrafficModelListComponent.
 * 
 * @param trafficModel The traffic model to display.
 */
@Component({
  standalone: false,
  selector: 'mh-traffic-model-list-item',
  templateUrl: './traffic-model-list-item.component.html',
  styleUrl: './traffic-model-list-item.component.scss'
})
export class TrafficModelListItemComponent {
  /**
   * The traffic model to display.
   */
  @Input() trafficModel?: SearchResultItemDto;
}

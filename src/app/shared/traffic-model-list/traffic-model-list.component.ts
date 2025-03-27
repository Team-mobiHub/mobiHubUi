import { Component, Input } from '@angular/core';

/**
 * This component shows a list of traffic models.
 * 
 * @param trafficModels The traffic models to show.
 */
@Component({
  standalone: false,
  selector: 'mh-traffic-model-list',
  templateUrl: './traffic-model-list.component.html',
  styleUrl: './traffic-model-list.component.scss'
})
export class TrafficModelListComponent {
  /**
   * The traffic models to show.
   */
  @Input() trafficModels?: any;
}

import { Component } from '@angular/core';
import { environment } from '../environments/environment';

const IS_PRODUCTION_MESSAGE = 'Is environment prod: '

@Component({
  selector: 'mh-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mobiHub-Ui';

  constructor() {
    console.info(IS_PRODUCTION_MESSAGE + environment.production); // Logs false for development environment
  }
}

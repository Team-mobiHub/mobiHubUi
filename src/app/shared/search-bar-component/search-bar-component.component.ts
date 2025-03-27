import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MODEL_METHOD_PRETTY_STRINGS, ModelMethod } from '../enums/model-method';
import { Framework, FRAMEWORK_PRETTY_STRINGS } from '../enums/framework';
import { MODEL_LEVEL_PRETTY_STRINGS, ModelLevel } from '../enums/model-level';
import { map } from 'rxjs';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'mh-search-bar-component',
  standalone: false,

  templateUrl: './search-bar-component.component.html',
  styleUrl: './search-bar-component.component.scss'
})

/**
 * The component that represents the search bar.
 */
export class SearchBarComponentComponent {
  form: FormGroup;

  /**
   * The available frameworks.
   */
  frameworks = Object.values(Framework);
  /**
   * The pretty strings for the frameworks.
   */
  FRAMEWORK_PRETTY_STRINGS = FRAMEWORK_PRETTY_STRINGS;

  /**
   * The available model levels.
   */
  modelLevels = Object.values(ModelLevel);
  /**
   * The pretty strings for the model levels.
   */
  MODEL_LEVEL_PRETTY_STRINGS = MODEL_LEVEL_PRETTY_STRINGS

  /**
   * The available model methods.
   */
  modelMethods = Object.values(ModelMethod);
  /**
   * The pretty strings for the model methods.
   */
  MODEL_METHOD_PRETTY_STRINGS = MODEL_METHOD_PRETTY_STRINGS;

  @ViewChild(MatExpansionPanel)
  expansionPanel!: MatExpansionPanel;

  /**
   * Creates a new instance of the SearchBarComponentComponent.
   * @param formBuilder Used to create the form.
   * @param route Used to get the query parameters.
   * @param router Used to navigate to the search page.
   */
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
    this.form = this.formBuilder.group({
      identifier: new FormControl('', {
        nonNullable: true
      }),
      author: new FormControl('', {
        nonNullable: true
      }),
      region: new FormControl('', {
        nonNullable: true
      }),
      modelLevel: new FormControl([], {
        nonNullable: true
      }),
      modelMethod: new FormControl([], {
        nonNullable: true
      }),
      framework: new FormControl([], {
        nonNullable: true
      }),
    });
  }

  /**
   * Initializes the component.
   * Subscribes to the query parameters and initializes the form with the query parameters.
   */
  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map(params => this.initializeForm(params))
    ).subscribe();
  }

  /**
   * Initializes the form with the given query parameters.
   *
   * @param params The parameters to initialize the form with.
   */
  private initializeForm(params: ParamMap): void {
    this.form.get('identifier')?.setValue(params.get('identifier'));
    this.form.get('author')?.setValue(params.get('author'));
    this.form.get('region')?.setValue(params.get('region'));
    this.form.get('modelLevel')?.setValue(params.getAll('modelLevel'));
    this.form.get('modelMethod')?.setValue(params.getAll('modelMethod'));
    this.form.get('framework')?.setValue(params.getAll('framework'));
  }

  /**
   * Gets the search parameters from the form.
   */
  get searchParameters() {
    let parameters: string[] = [];

    const identifierValue = this.form.get('identifier')?.value;
    if (identifierValue) {
      parameters.push(identifierValue);
    }

    const authorValue = this.form.get('author')?.value;
    if (authorValue) {
      parameters.push(authorValue)
    }

    const regionValue = this.form.get('region')?.value;
    if (regionValue) {
      parameters.push(regionValue)
    }

    const modelLevelValues = this.form.get('modelLevel')?.value as ModelLevel[];
    for (const modelLevelValue of modelLevelValues) {
      parameters.push(MODEL_LEVEL_PRETTY_STRINGS[modelLevelValue])
    }

    const modelMethodValues = this.form.get('modelMethod')?.value as ModelMethod[];
    for (const modelMethodValue of modelMethodValues) {
      parameters.push(MODEL_METHOD_PRETTY_STRINGS[modelMethodValue])
    }

    const frameworkValues = this.form.get('framework')?.value as Framework[];
    for (const frameworkValue of frameworkValues) {
      parameters.push(FRAMEWORK_PRETTY_STRINGS[frameworkValue])
    }

    return parameters;
  }

  /**
   * Submits the form.
   * Navigates to the search page with the search parameters.
   */
  submitForm() {
    const formValues = {
      identifier: this.form.get('identifier')?.value,
      author: this.form.get('author')?.value,
      region: this.form.get('region')?.value,
      modelLevel: this.form.get('modelLevel')?.value,
      modelMethod: this.form.get('modelMethod')?.value,
      framework: this.form.get('framework')?.value
    };

    const queryParams = Object.fromEntries(
      Object.entries(formValues).filter(([_, value]) => value !== null && value !== '')
    );

    this.router.navigate(['/trafficmodel/search'], {
      queryParams
    })

    this.expansionPanel.close();
  }

  /**
   * Clears the form.
   */
  clearForm() {
    this.form.reset();
  }
}

describe('search spec', () => {

  before(() => {
    cy.task('connectDB').then(res => {
      console.log(res);
    })
    cy.log('Resetted Database')
  })

  beforeEach(() => {
    cy.visit('/home')
  })

  it('Basic search', () => {
    // Expand the search bar to show the search filters
    cy.getBySel('search-header').click()

    // Search for the model with identifier "Stau Wars"
    cy.getBySel('search-identifier').type('Stau Wars')
    submitSearchForm()

    // Check if the model is found
    cy.getBySel('traffic-model-card-1')
  })

  it('Search with invalid identifier', () => {
    cy.getBySel('search-header').click()

    // Search for an identifier that does not exist
    cy.getBySel('search-identifier').type('Invalid Identifier')
    submitSearchForm()

    // Check if the message that no traffic models were found is displayed
    cy.getBySel('no-traffic-models-card')
  })

  it('Search for multiple models', () => {
    cy.getBySel('search-header').click()

    // Search for all models with the framework SUMO
    cy.selectMatSelectOption('search-framework', 'SUMO')
    submitSearchForm()
    
    // Check if all models with the framework SUMO are found
    cy.getBySel('traffic-model-card-1')
    cy.getBySel('traffic-model-card-6')
  })

  // This test implements T19 from the "Pflichtenheft"
  it('Search for a model with all parameters', () => {
    cy.getBySel('search-header').click()

    // Search for a model with all parameters
    cy.getBySel('search-identifier').type('Stau Wars')
    cy.getBySel('search-author').type('captain_crunch')
    cy.getBySel('search-region').type('Death Star City')
    cy.selectMatSelectOption('search-model-level', 'Target Selection')
    cy.selectMatSelectOption('search-model-level', 'Vehicle Following Distance')
    cy.selectMatSelectOption('search-model-method', 'Cross Nested Logit')
    cy.selectMatSelectOption('search-model-method', 'Matrix Matching')
    cy.selectMatSelectOption('search-framework', 'SUMO')
    submitSearchForm()

    // Check if the model is found
    cy.getBySel('traffic-model-card-1')
  })

  // This test implements T21 from the "Pflichtenheft"
  it('Search results page: Check paging', () => {
    // Start a search with no filters to get all models
    cy.getBySel('search-header').click()
    submitSearchForm()

    // Reduce the number of models per page to 5 to test paging
    cy.getBySel('models-per-page').find('.mat-mdc-paginator-touch-target').click().get('mat-option').contains('5').click()

    // Check that the page does not load anymore
    cy.getBySel('loading-container').should('not.exist')

    // Wait until the changes have rendered (Wait until a model from the second page is not found anymore)
    cy.getBySel('traffic-model-card-11').should('not.exist')

    // Test if models on the first page are found
    // (Test for all models that must be on the first page because of their rating)
    cy.getBySel('traffic-model-card-1')
    cy.getBySel('traffic-model-card-6')
    cy.getBySel('traffic-model-card-8')
    cy.getBySel('traffic-model-card-4')

    // Navigate to the second page
    cy.getBySel('models-per-page').find('button.mat-mdc-paginator-navigation-next').click();

    // Test if models on the second page are found
    // (Test for all models that must be on the second page because of their rating)
    cy.getBySel('traffic-model-card-5')
    cy.getBySel('traffic-model-card-11')
  })


  /*
    The following tests test each search filter individually.
    They only test with the first model in the database.

    They are structured as follows:
    1. Search with valid input
    2. Check if the model is found
    3. Optional: Reset the search
    4. Search with invalid input
    5. Check if the model is not found

    This way, the tests also cover Test T20 from the "Pflichtenheft"
  */

  it('Search author', () => {
    // Search with valid author
    enterModelOneIdentifier()
    cy.getBySel('search-author').clear().type('captain_crunch')
    submitSearchForm()
    
    // Check if the model is found
    cy.getBySel('traffic-model-card-1')

    // Search with invalid author
    cy.getBySel('search-header').click()
    cy.getBySel('search-author').clear().type('User 2')
    submitSearchForm()

    // Check if no models are found
    cy.getBySel('no-traffic-models-card')
  })

  it('Search region', () => {
    // Search with valid region
    enterModelOneIdentifier()
    cy.getBySel('search-region').clear().type('Death Star City')
    submitSearchForm()
    
    // Check if the model is found
    cy.getBySel('traffic-model-card-1')

    // Search with invalid region
    cy.getBySel('search-header').click()
    cy.getBySel('search-region').clear().type('Karlsruhe')
    submitSearchForm()
    
    // Check if no models are found
    cy.getBySel('no-traffic-models-card')
  })

  it('Search model level', () => {
    // Search with valid model level
    enterModelOneIdentifier()
    cy.selectMatSelectOption('search-model-level', 'Target Selection')
    submitSearchForm()

    // Check if the model is found
    cy.getBySel('traffic-model-card-1')

    // Reset search
    cy.visit('/home')

    // Search with invalid model level
    enterModelOneIdentifier()
    cy.selectMatSelectOption('search-model-level', 'Choice of Workplace')
    submitSearchForm()

    // Check if no models are found
    cy.getBySel('no-traffic-models-card')
  })

  it('Search model method', () => {
    // Search with valid model method
    enterModelOneIdentifier()
    cy.selectMatSelectOption('search-model-method', 'Cross Nested Logit')
    submitSearchForm()

    // Check if the model is found
    cy.getBySel('traffic-model-card-1')

    // Reset search
    cy.visit('/home')

    // Search with invalid model method
    enterModelOneIdentifier()
    cy.selectMatSelectOption('search-model-method', 'Multinomial Logit')
    submitSearchForm()

    // Check if no models are found
    cy.getBySel('no-traffic-models-card')
  })

  it('Search framework', () => {
    // Search with valid framework
    enterModelOneIdentifier()
    cy.selectMatSelectOption('search-framework', 'SUMO')
    submitSearchForm()

    // Check if the model is found
    cy.getBySel('traffic-model-card-1')

    // Reset search
    cy.visit('/home')

    // Search with invalid framework
    enterModelOneIdentifier()
    cy.selectMatSelectOption('search-framework', 'PTV Vissim')
    submitSearchForm()

    // Check if no models are found
    cy.getBySel('no-traffic-models-card')
  })
})

/**
 * Helper function to expand the search bar and enter the identifier for the model with id 1
 */
function enterModelOneIdentifier() {
  cy.getBySel('search-header').click()
  cy.getBySel('search-identifier').clear().type('Stau Wars')
}

/**
 * Helper function to submit the search form
 */
function submitSearchForm() {
  cy.getBySel('search-submit-button').click()
  cy.url().should('include', 'trafficmodel/search')
}

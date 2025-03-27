describe('Interaction spec', () => {

  before(() => {
    cy.task('connectDB').then(res => {
      console.log(res);
    })
    cy.log('Resetted Database')
  })

  beforeEach(() => {
    cy.login('user1@example.com', 'Password?')
    cy.visit('/home')
  })

  // Checks if A User can mark a TM as his Favorite (T8 from the "Pflichtenheft")
  it('should favorite a traffic model', () => {
    // Model with ID = 8 ( is not created by the user and is not marked as favorite by the user)
    cy.getBySel('traffic-model-card-8').click()
    cy.getBySel('model-is-favorite').should('not.exist')
    cy.getBySel('favorite-button').click()
    cy.getBySel('model-is-favorite').should('exist')

    // Check the Profile Page
    cy.getBySel('profileButton').click()

    cy.url().should('include', 'user')
    cy.getBySel('show-favorite-tm-button').click()
    cy.getBySel('traffic-model-card-8', {timeout: 3000}).click()

    cy.url().should('include', 'trafficmodel/8')
  })

  it('should rate a TM', () => {
    cy.getBySel('traffic-model-card-8').click()
    cy.getBySel('user-rating').should('contain', '-')

    cy.getBySel('user-star-4').click()
    // star 4 => 5 stars (stars counted from 0)
    cy.getBySel('user-rating').should('contain', '5')
    cy.getBySel('average-rating').should('contain', '4.5')

    cy.getBySel('user-star-0').click()
    cy.getBySel('user-rating').should('contain', '1')
    cy.getBySel('average-rating').should('contain', '2.5')
  })
})

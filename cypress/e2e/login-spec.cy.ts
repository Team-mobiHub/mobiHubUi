describe('login spec', () => {

  before(() => {
    cy.task('connectDB').then(res => {
      console.log(res);
    })
    cy.log('Resetted Database')
  })

  beforeEach(() => {
    cy.visit('/home')

    // Navigate to the login
    cy.getBySel('loginButton').click()
  })

  // This test implements T3 from the "Pflichtenheft"
  it('Simple login', () => {
    // Fill in the login form
    enterLoginInformationAndSubmit('user1@example.com', 'Password?')

    // Check if the user is redirected to the home page (this happens if the login was successful)
    cy.url().should('include', 'home')
  })

  it('Login with not-existing email', () => {
    // Fill in the login form with an invalid email
    enterLoginInformationAndSubmit('invalid-email@example.com', 'Password?')

    // Check if the error message is displayed
    cy.getBySel('login-invalid-credentials-error')
  })

  it('Login with wrong password', () => {
    // Fill in the login form with a valid email and an invalid password
    enterLoginInformationAndSubmit('user1@example.com', 'aaaaAaaa#')

    // Check if the error message is displayed
    cy.getBySel('login-invalid-credentials-error')
  })

  it('Login with empty email and password', () => {
    // Submit the form without filling in the fields
    cy.getBySel('login-submit-button').click()

    // Check if the error messages are displayed
    cy.getBySel('login-email-required-error')
    cy.getBySel('login-password-required-error')
  })

  it('Login with invalid email', () => {
    // Fill in the email field with an invalid email
    enterLoginInformationAndSubmit('invalid-email@a.a', 'Password?')

    // Check if the error message is displayed
    cy.getBySel('login-email-pattern-error')
  })
})

/**
 * Helper function to fill in the login form and submit it.
 * @param email The email to fill in the email field
 * @param password The password to fill in the password field
 */
function enterLoginInformationAndSubmit(email: string, password: string) {    
  cy.getBySel('login-email-field').type(email)
  cy.getBySel('login-password-field').type(password)
  cy.getBySel('login-submit-button').click()
}

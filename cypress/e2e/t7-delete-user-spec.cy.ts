describe('delete user spec', () => {
  
  before(() => {
    cy.task('connectDB').then(res => {
      console.log(res);
    })
    cy.log('Resetted Database')
  })

  // This test implements T7 from the "Pflichtenheft"
  it('Delete User', () => {
    // Login with the first user and navigate to edit user
    cy.login('user1@example.com', 'Password?')
    cy.getBySel('profileButton').click()
    cy.getBySel('edit-profile-button').click()

    // Delete the user
    cy.getBySel('start-user-deletion-button').click()
    cy.getBySel('confirm-user-deletion-button').click()

    // Check if the user is redirected to the home page
    cy.url({ timeout: 10000 }).should('include', 'home')

    // Check that the user can't log in anymore
    cy.getBySel('loginButton').click()
    cy.getBySel('login-email-field').type('user1@example.com')
    cy.getBySel('login-password-field').type('Password?')
    cy.getBySel('login-submit-button').click()
    cy.getBySel('login-invalid-credentials-error')
  })
})

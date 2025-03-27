describe('edit user spec', () => {

  before(() => {
    cy.task('connectDB').then(res => {
      console.log(res);
    })
    cy.log('Resetted Database')
  })

  // This test implements T5 from the "Pflichtenheft"
  it('Basic edit', () => {
    // Login with the first user and navigate to edit user
    loginAndNavigateToEditUser('user1@example.com')

    // Fill in the edit form
    cy.getBySel('edit-username-field').clear().type('test_username')
    cy.getBySel('edit-email-field').clear().type('test-email@example.com')

    // Submit the form
    cy.getBySel('edit-submit-button').click()

    // Check if the user is redirected to the profile page
    cy.url({ timeout: 10000 }).should('not.include', 'edit')

    // Check that the user's username was updated
    cy.getBySel('username').contains('test_username')

    // Check that the user's email was updated by logging in with the new email
    cy.logout()
    cy.login('test-email@example.com', 'Password?')
  })

  it('Edit with empty fields', () => {
    // Login with the second user and navigate to edit user
    loginAndNavigateToEditUser('user2@example.com')

    // Clear the form fields and submit the form
    cy.getBySel('edit-username-field').clear()
    cy.getBySel('edit-email-field').clear()
    cy.getBySel('edit-submit-button').click()

    // Check if the error messages are displayed
    cy.getBySel('username-required-error')
    cy.getBySel('email-required-error')
  })

  it('Edit with invalid usernames', () => {
    // Login with the second user and navigate to edit user
    loginAndNavigateToEditUser('user2@example.com')

    // Check too short username
    cy.getBySel('edit-username-field').clear().type('aa')
    cy.getBySel('edit-submit-button').click()
    cy.getBySel('username-min-length-error')

    // Check too long username
    cy.getBySel('edit-username-field').clear().type('a'.repeat(61))
    cy.getBySel('edit-submit-button').click()
    cy.getBySel('username-max-length-error')
  })

  it('Edit with invalid email', () => {
    // Login with the second user and navigate to edit user
    loginAndNavigateToEditUser('user2@example.com')

    // Check invalid email
    cy.getBySel('edit-email-field').clear().type('invalid-email@a.a')
    cy.getBySel('edit-submit-button').click()
    cy.getBySel('email-pattern-error')

    // Check too long email
    cy.getBySel('edit-email-field').clear().type('a'.repeat(256) + '@example.com')
    cy.getBySel('edit-submit-button').click()
    cy.getBySel('email-max-length-error')
  })

  it('Edit with taken username', () => {
    // Login with the second user and navigate to edit user
    loginAndNavigateToEditUser('user2@example.com')

    // Check taken username
    cy.getBySel('edit-username-field').clear().type('admin_mcadminface')
    cy.getBySel('edit-submit-button').click()
    cy.getBySel('username-in-use-error')
  })

  it('Edit with taken email', () => {
    // Login with the second user and navigate to edit user
    loginAndNavigateToEditUser('user2@example.com')

    // Check taken email
    cy.getBySel('edit-email-field').clear().type('user3@example.com')
    cy.getBySel('edit-submit-button').click()
    cy.getBySel('email-in-use-error')
  })

  it('Change Profile Picture', () => {
    // Login with the third user and navigate to show user
    loginAndNavigateToEditUser('user3@example.com')

    // Change the profile picture
    cy.getBySel('edit-profile-picture-input').selectFile('cypress/fixtures/test-files/profile-picture.png', {force: true})
    cy.getBySel('edit-submit-button').click()

    // Check if the user is redirected to the profile page
    cy.url({ timeout: 10000 }).should('not.include', 'edit')

    // Check that the user's profile picture was updated
    // (The src attribute should not include the default profile picture,
    // but should include 'http' to indicate that the image is loaded from the server)
    cy.getBySel('profile-picture').should('have.attr', 'src').and('not.include', '/images/default_profile_picture.png')
    cy.getBySel('profile-picture').should('have.attr', 'src').and('include', 'http')
  })
})

/**
 * Helper function to login and navigate to the edit user page.
 * The password is always 'Password?'.
 * 
 * @param email The email of the user to login with.
 */
function loginAndNavigateToEditUser(email: string) {
  cy.login(email, 'Password?')
  cy.getBySel('profileButton').click()
  cy.getBySel('edit-profile-button').click()
}

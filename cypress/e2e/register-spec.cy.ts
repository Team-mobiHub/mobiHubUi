describe('register spec', () => {

  before(() => {
    cy.task('connectDB').then((res) => {
      console.log(res);
    })
    cy.log('Resetted Database')
  })

  beforeEach(() => {
    cy.visit("/user/register")
  })

  it('should register valid user', () => {
    cy.get('#mat-input-0').click().type("test@gmail.con")
    cy.get('#mat-input-1').click().type("TestUser")
    cy.get('#mat-input-2').click().type("Password1?")
    cy.get('#confirmPassword').click().type("Password1?")

    cy.get('#auth-form-submit-button').should("be.enabled")
    cy.get('#auth-form-submit-button').click()
    cy.get('#mail-sent-image').should("be.visible")
  })

  it('should detect wrong username', () => {
    cy.get('#mat-input-1').click().type("Aa")
    cy.get('#mat-input-2').click()
    cy.get('#mat-mdc-error-4').should("be.visible")

  })

  it('should detect wrong email', () => {
    cy.get('#mat-input-0').click().type("test")
    cy.get('#mat-input-1').click()
    cy.get('#mat-mdc-error-4').should("be.visible")
  })


  it('should detect wrong password', () => {
    cy.get('#mat-input-2').click().type("password")
    cy.get('#mat-input-1').click()

    cy.get('#mat-mdc-error-5').should("be.visible")
    cy.get('#mat-mdc-error-6').should("be.visible")
  })

  it('should detect short password', () => {
    cy.get('#mat-input-2').click().type("passwo")
    cy.get('#mat-input-1').click()

    cy.get('#mat-mdc-error-4').should("be.visible")
  })

  it('should detect password with uppercase letters', () => {
    cy.get('#mat-input-2').click().type("Password")
    cy.get('#mat-input-1').click()

    cy.get('body').find('#mat-mdc-error-5').should('not.exist');
  })

  it('should detect passwort with special character', () => {
    cy.get('#mat-input-2').click().type("password?")
    cy.get('#mat-input-1').click()

    cy.get('body').find('#mat-mdc-error-6').should('not.exist');
  })

  it('should detect unequal passwords', () => {
    cy.get('#mat-input-2').click().type("Password1?")
    cy.get('#confirmPassword').click().type("Password1")
    cy.get('#mat-input-1').click()

    cy.get('#mat-mdc-error-7').should("be.visible")
  })
})
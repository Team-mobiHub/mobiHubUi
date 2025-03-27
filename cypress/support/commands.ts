/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

const TEST_URL = 'http://localhost:8080'


Cypress.Commands.add("getBySel", (selector, ...args) => {
    return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add('login', (email: string, password: string) => {

    cy.visit('/user/login')
    cy.get('input[formControlName="email"]').clear().type(email);
    cy.get('input[formControlName="password"]').clear().type(password);
    cy.get('#auth-form-submit-button').click()

    // Check if the user is redirected to the home page (this happens if the login was successful)
    cy.url({ timeout: 10000 }).should('include', 'home')
});

Cypress.Commands.add('logout', () => {
    cy.getBySel('logoutButton').click();
});


Cypress.Commands.add('seedDatabase', () => {
    cy.task('connectDB').then((res) => {
        console.log(res);
    });
});

Cypress.Commands.add('selectMatSelectOption', (selector: string, selectOption: string) => {
    cy.getBySel(selector).click({ force: true }).get('mat-option').contains(selectOption).click()
    cy.get('body').type('{esc}')
});

/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to get an element by data-cy attribute set in the element.
         * @param dataCy - The `data-cy` attribute to select an element
         * @param args - Additional arguments (optional)
         */
        getBySel(dataCyAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;

        /**
         * Seeds the database using a fixture
         * @param fixtureName - Name of the fixture file (e.g., 'users.json')
         * @param args - Additional arguments (optional)
         */
        seedDatabase(fixtureName: string, args?: any): Chainable<void>;

        /**
         * Logs in a user via API, stores JWT token, and attaches it to all future requests
         * @param email - User's email address
         * @param password - User's password
         */
        login(email: string, password: string): Chainable<void>;

        /**
        * Logs out a user by clearing authentication tokens and redirecting to the login page.
        */
        logout(): Chainable<void>;

        /**
         * Custom command to select a single value in a mat-select dropdown
         * @param selector - The selector of the mat-select dropdown
         * @param option - The option to select
         */
        selectMatSelectOption(selector: string, option: string): Chainable<void>;
    }
}

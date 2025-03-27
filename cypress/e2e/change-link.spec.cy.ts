describe("change link", () => {

    before(() => {
        cy.task('connectDB').then((res) => {
            console.log(res);
        })
        cy.log('Resetted Database')
    })

    it("should change the link", () => {
        cy.login("user1@example.com", "Password?")
        cy.get('[data-cy="profileButton"] > .mdc-button__label').click()
        cy.get(':nth-child(1) > .mat-mdc-card > .traffic-model-card-container').click()
        cy.get('.model-edit > button').click()
        cy.getBySel("data-source-url-input").click().type("new")
    cy.getBySel("save-button").click()
        cy.getBySel("source-url").invoke('text').then((text) => {
            expect(text).to.match(/new$/)
        })
    });

    it("should detect false link", () => {
        cy.login("user1@example.com", "Password?")
        cy.get('[data-cy="profileButton"] > .mdc-button__label').click()
        cy.get(':nth-child(1) > .mat-mdc-card > .traffic-model-card-container').click()
        cy.get('.model-edit > button').click()
        cy.getBySel("data-source-url-input").click().clear().type("new")
        cy.getBySel("model-name-input").click()
        cy.getBySel("source-url-error").should("be.visible")
    });
})
describe("Comment on Trafficmodels", () => {

    before(() => {
        cy.task('connectDB').then((res) => {
            console.log(res);
        })
        cy.log('Resetted Database')
    })

    it("should comment on a trafficmodel and be visible to at least one other user", () => {
        const comment = "This is a comment"
        const username1 = "captain_crunch";
        cy.login("user1@example.com", "Password?")
        cy.get(':nth-child(1) > .mat-mdc-card > .traffic-model-card-container').click()
        cy.get('#mat-input-8').click().type(comment)
        cy.get('.comment-box-footer > .mdc-button > .mdc-button__label').click()
        cy.wait(1000)
        cy.get('[ng-reflect-name="0"] > .comment-container > .comment-box > .comment-box-display-content > p').invoke('text').then((text) => {
            expect(text).to.eq(comment)
        })
        cy.get('.ng-untouched > .comment-container > .comment-box > .comment-box-footer > :nth-child(1)').invoke('text').then((text) => {
            expect(text).to.match(new RegExp(`^${username1}`));
        })

        // login as another user

        cy.logout()
        cy.login("user2@example.com", "Password?")
        cy.get(':nth-child(1) > .mat-mdc-card > .traffic-model-card-container').click()
        cy.wait(1000)
        cy.get('[ng-reflect-name="0"] > .comment-container > .comment-box > .comment-box-display-content > p').invoke('text').then((text) => {
            expect(text).to.eq(comment)
        })
        cy.get('.ng-untouched > .comment-container > .comment-box > .comment-box-footer > :nth-child(1)').invoke('text').then((text) => {
            expect(text).to.match(new RegExp(`^${username1}`));
        })
    })

    it("should detect empty comment", () => {
        const comment = "  "
        cy.login("user1@example.com", "Password?")
        cy.get(':nth-child(1) > .mat-mdc-card > .traffic-model-card-container').click()
        cy.get('#mat-input-8').click().type(comment)
        cy.get('.comment-box-footer > .mdc-button').should("be.disabled")
    })
})
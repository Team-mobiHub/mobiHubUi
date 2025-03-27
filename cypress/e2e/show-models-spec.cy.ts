import { Framework, FRAMEWORK_PRETTY_STRINGS } from '../../src/app/shared/enums/framework';
import { ModelLevel, MODEL_LEVEL_PRETTY_STRINGS } from '../../src/app/shared/enums/model-level';
import { ModelMethod, MODEL_METHOD_PRETTY_STRINGS } from '../../src/app/shared/enums/model-method';

describe('view-traffic-models', () => {

    beforeEach(() => {
        cy.task('connectDB')
        cy.log('Resetted Database')
    })

    it('should display the model data correctly', () => {
        cy.visit('/home');
        cy.getBySel('traffic-model-card-1').click();

        cy.getBySel('model-visibility-public').should('exist')
        cy.getBySel('model-name').should('contain', "Stau Wars")


        cy.getBySel('model-region').should('contain', "Death Star City")
        cy.getBySel('model-coordinates').should('contain', "51.1657,10.4515")
        cy.getBySel('model-framework').should('contain', FRAMEWORK_PRETTY_STRINGS[Framework.SUMO])

        cy.getBySel('model-details-expansion-button').click()

        cy.getBySel('model-level-0').should('contain', MODEL_LEVEL_PRETTY_STRINGS[ModelLevel.TARGET_SELECTION])
        cy.getBySel('model-method-0').should('contain', MODEL_METHOD_PRETTY_STRINGS[ModelMethod.MULTINOMIAL_LOGIT])

        cy.getBySel('model-level-1').should('contain', MODEL_LEVEL_PRETTY_STRINGS[ModelLevel.VEHICLE_FOLLOWING_DISTANCE])
        cy.getBySel('model-method-1').should('contain', MODEL_METHOD_PRETTY_STRINGS[ModelMethod.WIEDEMANN_74])

        cy.getBySel('model-description').should('be.visible')
        cy.getBySel('model-data-source-url').should('exist')
    })

    it('should not display private models to unautherized users', () => {
        cy.visit('/trafficmodel/2');

        cy.getBySel('error_heading').should('contain', 'Access Denied')
        cy.getBySel('error_message').should('contain', 'You do not have permission to view this traffic model. Please log in or contact the owner.')
    })

    it('should not display nonexistent models', () => {
        cy.visit('/trafficmodel/20');

        cy.getBySel('error_heading').should('contain', 'Traffic Model Not Found')
        cy.getBySel('error_message').should('contain', 'The requested traffic model does not exist.')
    })
});
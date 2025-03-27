import {Framework, FRAMEWORK_PRETTY_STRINGS} from '../../src/app/shared/enums/framework';
import {ModelLevel, MODEL_LEVEL_PRETTY_STRINGS} from '../../src/app/shared/enums/model-level';
import {ModelMethod, MODEL_METHOD_PRETTY_STRINGS} from '../../src/app/shared/enums/model-method';

const USER_NAME_1: string = 'captain_crunch'
const USER_NAME_2: string = 'banana_joe'
/** Paths to the JSON files containing the data for creating a valid TM */
const CREATE_TM_JSON_PATH = 'create-traffic-model.json'
/** Paths to the JSON files containing the data for editing a TM */
const EDIT_TM_JSON_PATH = 'edit-traffic-model.json'
/** Paths to the JSON files containing the data for adding images to a TM , remaining data is for checking valid editing*/
const ADD_IMAGES_TM_JSON_PATH = 'add-images-traffic-model.json'

describe('Traffic Model spec', () => {

  before(() => {
    cy.task('connectDB').then(res => {
      console.log(res);
    })
    cy.log('Resetted Database')
  })

  beforeEach(() => {
    cy.login('user1@example.com', 'Password?');
  })



  // Test the creation of a traffic model (T9 in the "Pflichtenheft")
  it('should create a Valid TM', () => {
    cy.visit('/trafficmodel/create')

    fillOutTrafficModelForm(CREATE_TM_JSON_PATH)

    cy.url({timeout: 10000}).should('include', '/trafficmodel/12');

    // Check if the traffic model was created correctly
    checkViewTrafficModelPage(CREATE_TM_JSON_PATH, USER_NAME_1)
  })

  // tests the deletion of a traffic model (T14 in the "Pflichtenheft")
  it('should delete a TM', () => {
    // TM with ID 1 is owned by the user
    cy.getBySel('traffic-model-card-1').click()
    cy.getBySel('model-edit-button').click()
    cy.getBySel('model-delete-button').click()

    cy.getBySel('delete-confirmation-button').click()
    cy.url().should('include', '/home', {timeout: 3000});

    cy.getBySel('profileButton').click()
    cy.getBySel('traffic-model-card-1').should('not.exist')
  })

  //  Test the editing of a traffic model incluing editing Pictures (T16 in the "Pflichtenheft")
  it('should edit a TM', () => {
    // TM with ID 6 is owned by the user
    cy.getBySel('traffic-model-card-6').click()
    cy.getBySel('model-edit-button').click()
    cy.url().should('include', '/trafficmodel/edit/6')

    fillOutTrafficModelForm(EDIT_TM_JSON_PATH)

    cy.url({timeout: 10000}).should('include', '/trafficmodel/6');

    // Check if the traffic model was edited correctly
    checkViewTrafficModelPage(EDIT_TM_JSON_PATH, USER_NAME_1)
  })

  // Test the editing of a TM only adding the images (T13 in the "Pflichtenheft")
  it('should add images to a TM', () => {
    cy.logout()
    cy.login('user2@example.com', 'Password?');

    cy.getBySel('traffic-model-card-8').click()
    cy.getBySel('model-edit-button').click()
    cy.url().should('include', '/trafficmodel/edit/8')

    cy.fixture(ADD_IMAGES_TM_JSON_PATH).then( trafficModel => {
      addImagesToTrafficModel(trafficModel)
    })
    cy.getBySel('save-button').click()
    cy.url({timeout: 10000}).should('include', '/trafficmodel/8');

    checkViewTrafficModelPage(ADD_IMAGES_TM_JSON_PATH,USER_NAME_2)
  })
})

/**
 * Fills out the traffic model form with the data from the given JSON file. also proceeds to save the form.
 * Data already filled out in the form will be overwritten.
 * Fields not specified will be set to the defaults/Clear.
 *
 * @param jsonPath
 */
function fillOutTrafficModelForm(jsonPath: string) {
  cy.fixture(jsonPath).then( trafficModel => {

    cy.get('[formControlName="isVisibilityPublic"]').click()
    if (trafficModel.hasOwnProperty('isVisibilityPublic') && trafficModel.isVisibilityPublic) {
      cy.getBySel('option-public').click()
    } else {
      cy.getBySel('option-private').click()
    }

    cy.get('[formControlName="name"]').clear().type(trafficModel.name)
    cy.get('[formControlName="description"]').clear().type(trafficModel.description)
    cy.get('[formControlName="region"]').clear().type(trafficModel.region)
    cy.selectMatSelectOption('framework-selector', FRAMEWORK_PRETTY_STRINGS[Framework[trafficModel.framework as keyof typeof Framework]])

    cy.get('[formControlName="coordinates"]').clear().type(trafficModel.coordinates)
    cy.get('[formControlName="dataSourceUrl"]').clear().type(trafficModel.dataSourceUrl)

    //Image Clear
    cy.getBySel('drop-zone-images').then($zone => {
      if ($zone.find('.remove-file-btn').length > 0) {
        $zone.find('.remove-file-btn').click()
      }
    })

    //Image Upload
    addImagesToTrafficModel(trafficModel)

    //Characteristics Clear
    cy.getBySel('characteristics-table').then($table => {
      while ($table.find('.remove-characteristic-btn').length > 0) {
        $table.find('.remove-characteristic-btn').click()
      }
    })

    //characteristics
    for (let i = 0; i < trafficModel.characteristics.length; i++) {
      cy.selectMatSelectOption('model-level-selector-' + i, MODEL_LEVEL_PRETTY_STRINGS[ModelLevel[trafficModel.characteristics[i][0] as keyof typeof ModelLevel]])
      cy.selectMatSelectOption('model-method-selector-' + i, MODEL_METHOD_PRETTY_STRINGS[ModelMethod[trafficModel.characteristics[i][1] as keyof typeof ModelMethod]])
      if (i < trafficModel.characteristics.length - 1) {
        cy.getBySel('button-add-characteristic').click()
      }
    }

    //ZIP Clear
    cy.getBySel('drop-zone-zip').then($zone => {
      if ($zone.find('.remove-file-btn').length > 0) {
        $zone.find('.remove-file-btn').click()
      }
    })
    //ZIP FILE UPLOAD
    cy.getBySel('drop-zone-zip').find('.upload-btn').selectFile(trafficModel.zipPath, {
      action: 'drag-drop'
    })

    cy.getBySel('save-button').click()
  });
}

function addImagesToTrafficModel(trafficModel: any) {
  if (trafficModel.hasOwnProperty('imagePaths')) {
    for (const imagePath of trafficModel.imagePaths) {
      cy.getBySel('drop-zone-images').find('.upload-btn').selectFile(imagePath, {
        action: 'drag-drop'
      })
    }
  }
}

/**
 * Checks if the data from the traffic model page matches the data from the given JSON file.
 *
 * @param jsonPath
 */
function checkViewTrafficModelPage(jsonPath: string, author: string) {
  cy.fixture(jsonPath).then(trafficModel => {
    if (trafficModel.isVisibilityPublic) {
      cy.getBySel('model-visibility-public')
    } else {
      cy.getBySel('model-visibility-private')
    }
    cy.getBySel('model-name').should('contain', trafficModel.name)

    cy.getBySel('model-author').should('contain', author)

    cy.getBySel('model-region').should('contain', trafficModel.region)
    cy.getBySel('model-coordinates').should('contain', trafficModel.coordinates)
    cy.getBySel('model-framework').should('contain', FRAMEWORK_PRETTY_STRINGS[Framework[trafficModel.framework as keyof typeof Framework]])

    cy.getBySel('model-details-expansion-button').click()
    for (let i = 0; i < trafficModel.characteristics.length; i++) {
      cy.getBySel('model-level-' + i).should('contain', MODEL_LEVEL_PRETTY_STRINGS[ModelLevel[trafficModel.characteristics[i][0] as keyof typeof ModelLevel]])
      cy.getBySel('model-method-' + i).should('contain', MODEL_METHOD_PRETTY_STRINGS[ModelMethod[trafficModel.characteristics[i][1] as keyof typeof ModelMethod]])
    }
    cy.getBySel('model-description').should('contain', trafficModel.description)
    cy.getBySel('model-data-source-url').should('contain', trafficModel.dataSourceUrl)

    checkImagesDisplay(trafficModel)
  })
}

function checkImagesDisplay(trafficModel: any){
  for (let i = 0; i < trafficModel.imagePaths.length; i++) {

    cy.getBySel('model-image-' + i).should('have.prop', 'naturalHeight').and('equal', trafficModel.imageDimensions[i][1]);
    cy.getBySel('model-image-' + i).should('have.prop', 'naturalWidth').and('equal', trafficModel.imageDimensions[i][0]);

    if (i < trafficModel.imagePaths.length - 1) {
      cy.getBySel('next-picture-button').click()
    }
  }
}

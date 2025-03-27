import { ModelMethod } from './model-method';

/**
 * Enum representing different levels of a model in mobiHub.
 */
export enum ModelLevel {
    CHOICE_OF_WORKPLACE = 'CHOICE_OF_WORKPLACE',
    CAR_OWNER = 'CAR_OWNER',
    TARGET_SELECTION = 'TARGET_SELECTION',
    CHOICE_OF_TRANSPORTATION = 'CHOICE_OF_TRANSPORTATION',
    CHOICE_OF_ROUTE = 'CHOICE_OF_ROUTE',
    VEHICLE_FOLLOWING_DISTANCE = 'VEHICLE_FOLLOWING_DISTANCE'
}

/**
 * An object that provides details for different model levels.
 * Each model level is associated with an array of accepted model methods and an ID.
 */
export const MODEL_LEVEL_DETAILS = {
    [ModelLevel.CHOICE_OF_WORKPLACE]: {
        acceptedMethods: [
            ModelMethod.GRAVITATION_MODEL,
            ModelMethod.MATRIX_MATCHING,
            ModelMethod.ILP
        ],
        id: 0
    },
    [ModelLevel.CAR_OWNER]: {
        acceptedMethods: [
            ModelMethod.MULTINOMIAL_LOGIT,
            ModelMethod.NESTED_LOGIT,
            ModelMethod.POISSON_REGRESSION
        ],
        id: 1
    },
    [ModelLevel.TARGET_SELECTION]: {
        acceptedMethods: [
            ModelMethod.MULTINOMIAL_LOGIT,
            ModelMethod.MIXED_LOGIT
        ],
        id: 2
    },
    [ModelLevel.CHOICE_OF_TRANSPORTATION]: {
        acceptedMethods: [
            ModelMethod.MULTINOMIAL_LOGIT,
            ModelMethod.NESTED_LOGIT,
            ModelMethod.CROSS_NESTED_LOGIT,
            ModelMethod.MIXED_LOGIT
        ],
        id: 3
    },
    [ModelLevel.CHOICE_OF_ROUTE]: {
        acceptedMethods: [
            ModelMethod.SHORT_PATH_REALLOCATION,
            ModelMethod.SUCCESSIVE_REALLOCATION,
            ModelMethod.DYNAMIC_REALLOCATION
        ],
        id: 4
    },
    [ModelLevel.VEHICLE_FOLLOWING_DISTANCE]: {
        acceptedMethods: [
            ModelMethod.WIEDEMANN_74,
            ModelMethod.WIEDEMANN_99,
            ModelMethod.GIBBS
        ],
        id: 5
    }
};

/**
 * An object that provides pretty strings for different model levels.
 */
export const MODEL_LEVEL_PRETTY_STRINGS = {
    [ModelLevel.CHOICE_OF_WORKPLACE]: 'Choice of Workplace',
    [ModelLevel.CAR_OWNER]: 'Car Owner',
    [ModelLevel.TARGET_SELECTION]: 'Target Selection',
    [ModelLevel.CHOICE_OF_TRANSPORTATION]: 'Choice of Transportation',
    [ModelLevel.CHOICE_OF_ROUTE]: 'Choice of Route',
    [ModelLevel.VEHICLE_FOLLOWING_DISTANCE]: 'Vehicle Following Distance'
};

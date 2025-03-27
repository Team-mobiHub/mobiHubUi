/**
 * Enum representing various model methods used in mobiHub.
 */
export enum ModelMethod {
    GRAVITATION_MODEL = 'GRAVITATION_MODEL',
    MULTINOMIAL_LOGIT = 'MULTINOMIAL_LOGIT',
    NESTED_LOGIT = 'NESTED_LOGIT',
    CROSS_NESTED_LOGIT = 'CROSS_NESTED_LOGIT',
    MIXED_LOGIT = 'MIXED_LOGIT',
    ILP = 'ILP',
    MATRIX_MATCHING = 'MATRIX_MATCHING',
    POISSON_REGRESSION = 'POISSON_REGRESSION',
    SHORT_PATH_REALLOCATION = 'SHORT_PATH_REALLOCATION',
    SUCCESSIVE_REALLOCATION = 'SUCCESSIVE_REALLOCATION',
    DYNAMIC_REALLOCATION = 'DYNAMIC_REALLOCATION',
    WIEDEMANN_74 = 'WIEDEMANN_74',
    WIEDEMANN_99 = 'WIEDEMANN_99',
    GIBBS = 'GIBBS'
}

/**
 * An object that provides pretty strings for different model methods.
 */
export const MODEL_METHOD_PRETTY_STRINGS = {
    [ModelMethod.GRAVITATION_MODEL]: 'Gravitation Model',
    [ModelMethod.MULTINOMIAL_LOGIT]: 'Multinomial Logit',
    [ModelMethod.NESTED_LOGIT]: 'Nested Logit',
    [ModelMethod.CROSS_NESTED_LOGIT]: 'Cross Nested Logit',
    [ModelMethod.MIXED_LOGIT]: 'Mixed Logit',
    [ModelMethod.ILP]: 'ILP',
    [ModelMethod.MATRIX_MATCHING]: 'Matrix Matching',
    [ModelMethod.POISSON_REGRESSION]: 'Poisson Regression',
    [ModelMethod.SHORT_PATH_REALLOCATION]: 'Short Path Reallocation',
    [ModelMethod.SUCCESSIVE_REALLOCATION]: 'Successive Reallocation',
    [ModelMethod.DYNAMIC_REALLOCATION]: 'Dynamic Reallocation',
    [ModelMethod.WIEDEMANN_74]: 'Wiedemann 74',
    [ModelMethod.WIEDEMANN_99]: 'Wiedemann 99',
    [ModelMethod.GIBBS]: 'Gibbs'
};

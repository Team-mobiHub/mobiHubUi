import { ModelLevel } from "../enums/model-level";
import { ModelMethod } from "../enums/model-method";

/**
 * Interface representing the data transfer object for a characteristic.
 */
export interface CharacteristicDTO {
    /**
     * The model level of the characteristic.
     */
    modelLevel: ModelLevel;

    /**
     * The model method of the characteristic.
     */
    modelMethod: ModelMethod;
}

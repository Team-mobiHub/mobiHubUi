/**
 * Enum representing various traffic simulation frameworks.
 */
export enum Framework {
    PTV_VISSIM = 'PTV_VISSIM',
    PTV_VISUM = 'PTV_VISUM',
    SUMO = 'SUMO',
    CUBE = 'CUBE',
    VISUM_VISSIM_HYBRID = 'VISUM_VISSIM_HYBRID',
    OPEN_TRAFFIC_SIM = 'OPEN_TRAFFIC_SIM',
    MAT_SIM = 'MAT_SIM',
    OTS = 'OTS',
    DYNUS_T = 'DYNUS_T',
    TRANS_MODELER = 'TRANS_MODELER',
    AIMSUN_NEXT = 'AIMSUN_NEXT',
    SATURN = 'SATURN',
    LEGION = 'LEGION',
    PARAMICS = 'PARAMICS',
    MOBITOPP = 'MOBITOPP',
    OTHER = 'OTHER',
}

/**
 * An object that provides pretty strings for different frameworks.
 */
export const FRAMEWORK_PRETTY_STRINGS = {
    [Framework.PTV_VISSIM]: 'PTV Vissim',
    [Framework.PTV_VISUM]: 'PTV Visum',
    [Framework.SUMO]: 'SUMO',
    [Framework.CUBE]: 'Cube',
    [Framework.VISUM_VISSIM_HYBRID]: 'Visum Vissim Hybrid',
    [Framework.OPEN_TRAFFIC_SIM]: 'Open Traffic Sim',
    [Framework.MAT_SIM]: 'MATSim',
    [Framework.OTS]: 'OTS',
    [Framework.DYNUS_T]: 'DynusT',
    [Framework.TRANS_MODELER]: 'TransModeler',
    [Framework.AIMSUN_NEXT]: 'Aimsun Next',
    [Framework.SATURN]: 'Saturn',
    [Framework.LEGION]: 'Legion',
    [Framework.PARAMICS]: 'Paramics',
    [Framework.MOBITOPP]: 'MobiTopp',
    [Framework.OTHER]: 'Other'
};

import { FileChangeType } from "../enums/file-change-type";

/**
 * FileStatusDTO is a data transfer object that represents the status of a file.
 */
export interface FileStatusDTO {
    /**
     * The name of the file.
     */
    fileName: string;
    
    /**
     * The status of the file.
     */
    status: FileChangeType;
}

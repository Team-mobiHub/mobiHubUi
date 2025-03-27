/**
 * Interface representing the data transfer object for a comment.
 */
export interface CommentDto {
    /**
     * The id of the comment.
     */
    id: number;

    /**
     * The id of the traffic model that the comment belongs to.
     */
    trafficModelId: number;

    /**
     * The id of the user that created the comment.
     */
    userId: number;

    /**
     * The name of the user that created the comment.
     */
    userName: string;

    /**
     * The content of the comment.
     */
    content: string;

    /**
     * The creation date of the comment.
     */
    creationDate: Date;
}

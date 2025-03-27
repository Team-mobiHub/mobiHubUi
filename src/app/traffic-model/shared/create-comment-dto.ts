/**
 * Interface representing the data transfer object for creating a comment.
 */
export interface CreateCommentDto {
    /**
     * The id of the comment.
     */
    id: number | null;

    /**
     * The id of the traffic model the comment is associated with.
     */
    trafficModelId: number;

    /**
     * The id of the user who created the comment.
     */
    userId: number;

    /**
     * The content of the comment.
     */
    content: string;
}

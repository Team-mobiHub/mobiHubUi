/**
 * Interface representing the data transfer object for a team invitation request.
 */
export interface TeamInvitationRequestDto {
    /**
     * The ID of the team to which the users should be invited.
     */
    teamId: number;

    /**
     * The email addresses of the users to whom the invitation is being sent.
     */
    emailAddresses: string[];
}

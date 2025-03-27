import { Component, Input } from '@angular/core';
import { CommentDto } from '../../shared/dtos/comment-dto';
import {
  AbstractControl, FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { UserDto } from '../../shared/dtos/user-dto';
import { CreateCommentDto } from '../shared/create-comment-dto';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { DATA_CONSTANTS } from '../../shared/validators/data-constants';
import { InteractionService } from '../shared/interaction.service';


@Component({
  selector: 'mh-comments',
  standalone: false,

  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
/**
 * Component for displaying and managing comments.
 * The user can add, edit and delete as many comments as he wants.
 *
 * @param comments the comments to display
 * @param trafficModelId the id of the traffic model the comments belong to
 */
export class CommentsComponent {
  /**
   * The comments this component will display.
   */
  @Input() comments?: CommentDto[];
  /**
   * The id of the traffic model the comments belong to.
   */
  @Input({ required: true }) trafficModelId!: number;

  /**
   * the base for the route to the user profiles
   */
  readonly userRoute = '/user/';
  /**
   * the Default profile picture for users
   */
  readonly defaultProfilePicture = '/images/default_profile_picture.png';

  /**
   * Indicates whether the user is logged in. Relevant to display that login is required for commenting.
   */
  isLoggedIn = false;
  /**
   * The current user. Relevant to display the user name in the comment form.
   */
  currentUser: UserDto | null = null;

  /**
   * Form for adding a comment.
   * The content field is required and must not exceed the maximum comment length.
   * The user must be logged in to add a comment.
   */
  addCommentForm = new FormGroup({
    content: new FormControl(
      '',
      [Validators.maxLength(DATA_CONSTANTS.MAXIMUM_COMMENT_LENGTH), loggedInValidator(this.isLoggedIn)]
    )
  });

  /**
   * Form for displaying and editing comments.
   */
  commentsListForm: FormGroup;

  constructor(private authService: AuthService,
    private interactionService: InteractionService,
    private userService: UserService,
    private fb: FormBuilder) {
    this.authService.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.isLoggedIn = this.currentUser !== null;
        this.updateValidators();
      },
      error => {
        console.error('Error while getting current user', error);
        // currentUser is null by default
        this.isLoggedIn = false;
        this.updateValidators();
      }
    )
    this.commentsListForm = this.fb.group({
      commentsArray: this.fb.array([])
    });
  }

  /**
   * is called when the component is initialized
   * it populates the commentsListForm with the comments
   */
  ngOnInit() {
    this.populateCommentsListFormArray();
  }

  /**
   * Getter for the commentsArray FormArray.
   */
  get commentsArray() {
    return this.commentsListForm.get('commentsArray') as FormArray;
  }

  /**
   * Populates the commentsArray FormArray with the comments adn defines their attributes
   * their are some attributes added to make editing possible
   */
  populateCommentsListFormArray() {
    if (!this.comments) {
      return;
    }
    this.commentsArray.clear();
    this.comments.forEach(comment => {
      this.commentsArray.push(this.createCommentFormGroup(comment));
    });
    //sorts the comments by date, newest first
    this.commentsArray.controls.sort((a, b) => {
      const dateA = new Date(a.get('date')?.value).getTime();
      const dateB = new Date(b.get('date')?.value).getTime();
      return dateB - dateA;
    });
  }

  private createCommentFormGroup(comment: CommentDto): FormGroup {
    const commentGroup = this.fb.group({
      id: [comment.id],
      content: [comment.content, [Validators.maxLength(DATA_CONSTANTS.MAXIMUM_COMMENT_LENGTH)]],
      date: [comment.creationDate],
      userId: [comment.userId],
      //used to toggle between edit and view mode
      editMode: [false],
      //used to store the original content when editing
      originalContent: [''],
      userName: [comment.userName || 'Unknown'],
      profilePicture: [this.defaultProfilePicture]
    });
    this.userService.getById(comment.userId).subscribe(user => {
      commentGroup.get('userName')?.setValue(user.name);
      commentGroup.get('profilePicture')?.setValue(user.profilePictureLink);
    });
    return commentGroup;
  }

  /**
   * has to be Called whenever the user Login state changes
   * @private
   */
  private updateValidators() {
    this.addCommentForm.get('content')?.setValidators([
      Validators.maxLength(DATA_CONSTANTS.MAXIMUM_COMMENT_LENGTH),
      loggedInValidator(this.isLoggedIn)
    ]);
  }


  /**
   * this methode creates a CommentDto by using the InteractionService
   */
  onCreateComment(): void {
    const commentContent = this.addCommentForm.get('content')?.value?.trim();

    // errors should never be called cause the button is disabled in these cases(compiler requires check)
    if (!commentContent) {
      throw new Error('Comment content is empty');
    }
    if (!this.currentUser || !this.currentUser.id) {
      throw new Error('Something went wrong with the user Account');
    }

    let comment: CreateCommentDto = {
      id: null,
      trafficModelId: this.trafficModelId,
      userId: this.currentUser?.id || 0,
      content: commentContent
    }
    this.interactionService.addComment(comment).subscribe(
      newComment => {
        this.comments?.push(newComment);
        // will immediately update the view
        this.commentsArray.insert(0, this.createCommentFormGroup(newComment));
      },
      error => {
        //no comment will be created
        console.error('Error while creating comment', error);
      }
    );
    this.addCommentForm.get('content')?.setValue('');
  }

  /**
   * this methode toggles the edit mode of a comment
   * @param commentIndex the index of the comment in the commentsArray
   */
  onToggleEditMode(commentIndex: number) {
    const commentGroup = this.commentsArray.at(commentIndex);
    const editMode = commentGroup.get('editMode')?.value;

    if (!editMode) {
      commentGroup.get('originalContent')?.setValue(commentGroup.get('content')?.value);
    } else {
      commentGroup.get('content')?.setValue(commentGroup.get('originalContent')?.value);
    }

    commentGroup.get('editMode')?.setValue(!editMode);
  }

  /**
   * this methode updates a CommentDto.
   * @param commentIndex
   */
  onUpdateComment(commentIndex: number) {
    event?.preventDefault();
    const commentGroup = this.commentsArray.at(commentIndex);
    const commentId = commentGroup.get('id')?.value;
    const newContent = commentGroup.get('content')?.value?.trim();

    //should never be called cause the button is disabled in these cases
    if (!newContent) {
      //there should never be an empty comment
      this.onDeleteComment(commentId);
      return;
    }
    if (!this.currentUser || !this.currentUser.id) {
      throw new Error('Something went wrong with the user Account');
    }

    let updateCommentDto: CreateCommentDto = {
      id: commentId,
      trafficModelId: this.trafficModelId,
      userId: this.currentUser?.id || 0,
      content: newContent
    }

    this.interactionService.updateComment(updateCommentDto).subscribe(
      updatedComment => {
        this.comments = this.comments?.map(comment => comment.id === updatedComment.id ? updatedComment : comment);
        // will immediately update the view
        let commentGroup = this.commentsArray.at(commentIndex);
        commentGroup.get('editMode')?.setValue(false);
        // these are the only values that can change on Update
        commentGroup.get('content')?.setValue(updatedComment.content);
        commentGroup.get('date')?.setValue(updatedComment.creationDate);
      },
      error => {
        //Comment will stay the same
        console.error('Error while updating comment', error);
      }
    );
  }

  /**
   * this methode deletes a CommentDto
   * @param commentIndex
   */
  onDeleteComment(commentIndex: number) {
    event?.preventDefault();
    const commentId = this.commentsArray.at(commentIndex).get('id')?.value;
    this.interactionService.deleteComment(commentId).subscribe(
      () => {
        if (!this.comments) {
          //should never be called cause there is no delete button in this case
          return;
        }
        this.comments = this.comments?.filter(comment => comment.id !== commentId);

        // will immediately update the view
        this.commentsArray.removeAt(commentIndex);
      },
      error => {
        //Nothing will change
        console.error('Error while deleting comment', error);
      }
    );
  }
}

/**
 * Validator function that checks if the user is logged in.
 * @param isLoggedIn
 */
export function loggedInValidator(isLoggedIn: boolean): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    return isLoggedIn ? null : { notLoggedIn: true };
  };
}

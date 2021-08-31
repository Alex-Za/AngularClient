import { ImageUploadService } from './../../service/image-upload.service';
import { CommentService } from './../../service/comment.service';
import { UserService } from './../../service/user.service';
import { PostService } from './../../service/post.service';
import { User } from './../../models/user';
import { Post } from './../../models/post';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { BehaviorSubject, pipe, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  private $unsubscribe = new ReplaySubject(1);

  public isPostsLoaded: boolean = false;
  public posts: Post[];
  public isUserDataLoaded: boolean = false;
  public user: User;

  constructor(private postService: PostService,
    private userService: UserService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private imageService: ImageUploadService) { }

  ngOnInit(): void {
    this.postService.getAllPosts().pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      this.posts = data;
      console.log(data);
      this.getCommentToPosts(this.posts);
      this.getImagesToPosts(this.posts);
      this.isPostsLoaded = true;
    });

    this.userService.getCurrentUser().pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      this.user = data;
      this.isUserDataLoaded = true;
    });
  }

  public getImagesToPosts(posts: Post[]): void {
    posts.forEach((p: Post) => {
      this.imageService.getImageToPost(p.id).pipe(takeUntil(this.$unsubscribe)).subscribe((data: any) => {
        p.image = data.imageBytes;
      });
    });
  }

  public getCommentToPosts(posts: Post[]): void {
    posts.forEach((p: Post) => {
      this.commentService.getCommentsToPost(p.id).pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
        p.comments = data;
      });
    });
  }

  public likePost(postId: number, postIndex: number): void {
    const post = this.posts[postIndex];

    if (!post.usersLiked.includes(this.user.username)) {
      this.postService.likePost(postId, this.user.username).pipe(takeUntil(this.$unsubscribe)).subscribe(() => {
        post.usersLiked.push(this.user.username);
        this.notificationService.showSnackBar('Liked!');
      });
    } else {
      this.postService.likePost(postId, this.user.username).pipe(takeUntil(this.$unsubscribe)).subscribe(() => {
        const index: number = post.usersLiked.indexOf(this.user.username, 0);
        if (index > -1) {
          post.usersLiked?.splice(index, 1);
        }
      });
    }
  }

  public postComment(event: Event, postId: number, postIndex: number): void {
    const message: string = (event.target as HTMLInputElement).value;
    const post: Post = this.posts[postIndex];

    this.commentService.addCommentToPost(postId, message).pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      post.comments.push(data);
    });
  }

  public formatImage(img: any): any {
    if (img === null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

}

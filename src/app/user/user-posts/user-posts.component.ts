import { takeUntil } from 'rxjs/operators';
import { NotificationService } from './../../service/notification.service';
import { CommentService } from './../../service/comment.service';
import { ImageUploadService } from './../../service/image-upload.service';
import { PostService } from './../../service/post.service';
import { Post } from './../../models/post';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent implements OnInit, OnDestroy {
  private $unsubscribe = new ReplaySubject(1);

  public isUserPostsLoaded: boolean = false;
  public posts: Post[];

  constructor(private postService: PostService,
    private imageService: ImageUploadService,
    private commentService: CommentService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.postService.getPostForCurrentUser().pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      this.posts = data;
      this.getImagesToPosts(this.posts);
      this.getCommentsToPosts(this.posts);
      this.isUserPostsLoaded = true;
    });
  }

  private getImagesToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.imageService.getImageToPost(p.id).pipe(takeUntil(this.$unsubscribe)).subscribe((data: any) => {
        p.image = data.imageBytes;
      });
    });
  }

  private getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.commentService.getCommentsToPost(p.id).pipe(takeUntil(this.$unsubscribe)).subscribe((data: any) => {
        p.comments = data;
      });
    });
  }

  public removePost(post: Post, index: number): void {
    const result = confirm('Do you really want to delete this post?');
    if (result) {
      this.postService.delete(post.id).pipe(takeUntil(this.$unsubscribe)).subscribe(() => {
        this.posts.splice(index, 1);
        this.notificationService.showSnackBar('Post deleted');
      });
    }
  }

  public formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  public deleteComment(commentId: number, postIndex: number, commentIndex: number): void {
    const post = this.posts[postIndex];

    this.commentService.delete(commentId).pipe(takeUntil(this.$unsubscribe)).subscribe((data : any) => {
      this.notificationService.showSnackBar('Comment removed');
      post.comments.splice(commentIndex, 1);
    });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

}

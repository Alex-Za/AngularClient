import { NotificationService } from './../../service/notification.service';
import { CommentService } from './../../service/comment.service';
import { ImageUploadService } from './../../service/image-upload.service';
import { PostService } from './../../service/post.service';
import { Post } from './../../models/post';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent implements OnInit {

  public isUserPostsLoaded: boolean = false;
  public posts: Post[];

  constructor(private postService: PostService,
    private imageService: ImageUploadService,
    private commentService: CommentService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.postService.getPostForCurrentUser().subscribe(data => {
      this.posts = data;
      this.getImagesToPosts(this.posts);
      this.getCommentsToPosts(this.posts);
      this.isUserPostsLoaded = true;
    });
  }

  private getImagesToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.imageService.getImageToPost(p.id).subscribe((data: any) => {
        p.image = data.imageBytes;
      });
    });
  }

  private getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.commentService.getCommentsToPost(p.id).subscribe((data: any) => {
        p.comments = data;
      });
    });
  }

  public removePost(post: Post, index: number): void {
    const result = confirm('Do you really want to delete this post?');
    if (result) {
      this.postService.delete(post.id).subscribe(() => {
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

    this.commentService.delete(commentId).subscribe((data : any) => {
      this.notificationService.showSnackBar('Comment removed');
      post.comments.splice(commentIndex, 1);
    });
  }

}

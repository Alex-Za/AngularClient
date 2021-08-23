import { ImageUploadService } from './../../service/image-upload.service';
import { CommentService } from './../../service/comment.service';
import { UserService } from './../../service/user.service';
import { PostService } from './../../service/post.service';
import { User } from './../../models/user';
import { Post } from './../../models/post';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

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
    this.postService.getAllPosts().subscribe(data => {
      this.posts = data;
      this.getCommentToPosts(this.posts);
      this.getImagesToPosts(this.posts);
      this.isPostsLoaded = true;
    });

    this.userService.getCurrentUser().subscribe(data => {
      this.user = data;
      this.isUserDataLoaded = true;
    });
  }

  public getImagesToPosts(posts: Post[]): void {
    posts.forEach((p: Post) => {
      this.imageService.getImageToPost(p.id).subscribe((data: any) => {
        p.image = data.imageBytes;
      });
    });
  }

  public getCommentToPosts(posts: Post[]): void {
    posts.forEach((p: Post) => {
      this.commentService.getCommentsToPost(p.id).subscribe(data => {
        p.comments = data;
      });
    });
  }

  public likePost(postId: number, postIndex: number): void {
    const post = this.posts[postIndex];

    if (!post.userLiked.includes(this.user.username)) {
      this.postService.likePost(postId, this.user.username).subscribe(() => {
        post.userLiked.push(this.user.username);
        this.notificationService.showSnackBar('Liked!');
      });
    } else {
      this.postService.likePost(postId, this.user.username).subscribe(() => {
        const index: number = post.userLiked.indexOf(this.user.username, 0);
        if (index > -1) {
          post.userLiked?.splice(index, 1);
        }
      });
    }
  }

  public postComment(message: string, postId: number, postIndex: number): void {
    const post: Post = this.posts[postIndex];

    this.commentService.addCommentToPost(postId, message).subscribe(data => {
      post.comments.push(data);
    });
  }

  public formatImage(img: any): any {
    if (img === null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

}

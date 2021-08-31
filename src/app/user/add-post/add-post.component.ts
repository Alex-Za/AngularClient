import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from './../../service/notification.service';
import { ImageUploadService } from './../../service/image-upload.service';
import { PostService } from './../../service/post.service';
import { Post } from './../../models/post';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit, OnDestroy {
  private $unsubscribe = new ReplaySubject(1);

  public postForm: FormGroup;
  public selectedFile: File;
  public isPostCreated: boolean = false;
  public createdPost: Post;
  public previewImgURL: any;

  constructor(private postService: PostService,
    private imageUploadService: ImageUploadService,
    private notificationService: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.postForm = this.createPostForm();
  }

  private createPostForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      caption: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])]
    });
  }

  public submit(): void {
    this.postService.createPost({
      title: this.postForm.value.title,
      caption: this.postForm.value.caption,
      location: this.postForm.value.location
    }).pipe(takeUntil(this.$unsubscribe)).subscribe((data: any) => {
      this.createdPost = data;

      if (this.createdPost.id != null) {
        this.imageUploadService.uploadImageToPost(this.selectedFile, this.createdPost.id).pipe(takeUntil(this.$unsubscribe)).subscribe(() => {
          this.notificationService.showSnackBar('Post create successfully');
          this.isPostCreated = true;
          this.router.navigate(['/profile']);
        });
      }
    });
  }

  public onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.previewImgURL = reader.result;
    };
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }


}

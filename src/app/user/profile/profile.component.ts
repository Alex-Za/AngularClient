import { takeUntil } from 'rxjs/operators';
import { EditUserComponent } from './../edit-user/edit-user.component';
import { ImageUploadService } from './../../service/image-upload.service';
import { UserService } from './../../service/user.service';
import { PostService } from './../../service/post.service';
import { TokenStorageService } from './../../service/token-storage.service';
import { User } from './../../models/user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private $unsubscribe = new ReplaySubject(1);

  public isUserDataLoaded: boolean = false;
  public user: User;
  public selectedFile: File;
  public userProfileImage: File;
  public previewImgURL: any;

  constructor(private tokenStorage: TokenStorageService,
    private postService: PostService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private imageService: ImageUploadService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      this.user = data;
      this.isUserDataLoaded = true;
    });

    this.imageService.getProfileImage().pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      if (data !== null) {
        this.userProfileImage = data.imageBytes;
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

  public openEditDialog(): void {
    const dialogUserEditConfig = new MatDialogConfig();
    dialogUserEditConfig.width = '400px';
    dialogUserEditConfig.data = {
      user: this.user
    };
    this.dialog.open(EditUserComponent, dialogUserEditConfig);
  }

  public onUpload(): void {
    if (this.selectedFile != null) {
      this.imageService.uploadImageToUser(this.selectedFile).pipe(takeUntil(this.$unsubscribe)).subscribe(() => {
        this.notificationService.showSnackBar('Profile Image uploaded successfully');
      });
    }
  }

  public formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

}

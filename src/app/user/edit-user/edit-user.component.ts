import { takeUntil } from 'rxjs/operators';
import { User } from './../../models/user';
import { UserService } from './../../service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  private $unsubscribe = new ReplaySubject(1);

  public profileEditForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<EditUserComponent>,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService) { }

  ngOnInit(): void {
    this.profileEditForm = this.createProfileForm();
  }

  private createProfileForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [
        this.data.user.firstname,
        Validators.compose([Validators.required])
      ],
      lastName: [
        this.data.user.lastname,
        Validators.compose([Validators.required])
      ],
      bio: [
        this.data.user.bio,
        Validators.compose([Validators.required])
      ]
    });
  }

  public submit(): void {
    this.userService.updateUser(this.updateUser()).pipe(takeUntil(this.$unsubscribe)).subscribe(() => {
      this.notificationService.showSnackBar('User updated successfully');
      this.dialogRef.close();
    });
  }

  private updateUser(): User {
    this.data.user.firstname = this.profileEditForm.value.firstName;
    this.data.user.lastname = this.profileEditForm.value.lastName;
    this.data.user.bio = this.profileEditForm.value.bio;
    return this.data.user;
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

}

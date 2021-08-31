import { Router } from '@angular/router';
import { NotificationService } from './../../service/notification.service';
import { TokenStorageService } from './../../service/token-storage.service';
import { AuthService } from './../../service/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private $unsubscribe = new ReplaySubject(1);

  public loginForm: FormGroup;

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private notificationService: NotificationService,
              private router: Router,
              private fb: FormBuilder) {
    if (this.tokenStorage.getUser()) {
      console.log('user exists')
      this.router.navigate(['main']);
    }

  }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  public submit(): void {
    this.authService.login({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      this.tokenStorage.saveToken(data.token);
      this.tokenStorage.saveUser(data);

      this.notificationService.showSnackBar('Succesfully logged in');
      this.router.navigate(['/']);
      window.location.reload();
    }, error => {
      this.notificationService.showSnackBar(error.message);
    });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

}

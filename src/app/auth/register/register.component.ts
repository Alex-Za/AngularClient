import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.registerForm = this.createRegisterForm();
  }

  private createRegisterForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])]
    })
  }

  public submit(): void {
    this.authService.register({
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      firstname: this.registerForm.value.firstname,
      lastname: this.registerForm.value.lastname,
      confirmPassword: this.registerForm.value.confirmPassword
    }).subscribe(data => {
      this.notificationService.showSnackBar('Succesfully registered');
    }, error => {
      this.notificationService.showSnackBar('Something goes wrong');
    });
  }

}

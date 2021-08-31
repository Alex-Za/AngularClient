import { Router } from '@angular/router';
import { UserService } from './../../service/user.service';
import { TokenStorageService } from './../../service/token-storage.service';
import { User } from './../../models/user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  private $unsubscribe = new ReplaySubject(1);

  public isLoggedIn = false;
  public isDataLoaded = false;
  user: User;

  constructor(private router: Router,
    private tokenService: TokenStorageService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenService.getToken();

    if (this.isLoggedIn) {
      this.userService.getCurrentUser().subscribe(data => {
        this.user = data;
        this.isDataLoaded = true;
      });
    }
  }

  public logout(): void {
    this.tokenService.logOut();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

}

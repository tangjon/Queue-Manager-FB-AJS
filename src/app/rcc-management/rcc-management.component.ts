import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import { parse } from 'url';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-rcc-management',
  templateUrl: './rcc-management.component.html',
  styleUrls: ['./rcc-management.component.css']
})
export class RccManagementComponent {
  selectedUser: User;
  users: Observable<any[]>;
  showSpinner: boolean = true;
  _userList: Array<User>;
  errorMessage: string;
  constructor(public db: AngularFireDatabase, public userSerivice: UserService) {
    this.userSerivice.getUsers({}).subscribe(r => {
      this.showSpinner = false;
      this._userList = r.sort(function (a, b) {
        if (a.name < b.name)
          return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      });
    }, error => {
      this.errorMessage = error;
    })
  }

  selectUser(user) {
    this.selectedUser = user;
  }

  // Increment by one
  addQueueDay(val) {
    if (val) {
      let amount = parseInt(val);

      if (this.selectedUser) {
        let prompt = window.confirm(this.selectedUser.name + " will have " + this.selectedUser.currentQDays + " increased by " + val + " to " +  (this.selectedUser.currentQDays + amount) + ". \nClick okay to confirm.");
        this.selectedUser.currentQDays += amount;
        this.userSerivice.updateUser(this.selectedUser).subscribe(r => {
        })}}
  }

  updateQueueDays(val) {
    if (val) {
      let amount = parseInt(val);
      if (this.selectedUser) {
        let prompt = window.confirm(this.selectedUser.name + " will have " + this.selectedUser.currentQDays + " changed to " + val +  ". \nClick okay to confirm.");
        this.selectedUser.currentQDays = amount;
        this.userSerivice.updateUser(this.selectedUser).subscribe(r => {})
      }
    }
  }

  clearSelectedUser() {
  }

}

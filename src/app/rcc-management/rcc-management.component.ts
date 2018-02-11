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

  _userList: Array<User>;
  constructor(public db: AngularFireDatabase, public userSerivice: UserService) {
    this.userSerivice.getUsers({}).subscribe(r => {
      this._userList = r;
    })
  }

  selectUser(user) {
    this.selectedUser = user;
  }

  // Increment by one
  addQueueDay(val) {
    let amount = parseInt(val);
    if (this.selectedUser) {
      this.selectedUser.currentQDays += amount;
      this.userSerivice.updateUser(this.selectedUser).subscribe(r => {

      })
    }
  }

  updateQueueDays(val) {
    let amount = parseInt(val);
    if (this.selectedUser) {
      this.selectedUser.currentQDays = amount;
      this.userSerivice.updateUser(this.selectedUser).subscribe(r => {

      })
    }
  }

  clearSelectedUser() {
  }

}

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
export class RccManagementComponent implements OnInit {

  selectedUser: User;
  users: Observable<any[]>;
  showSpinner: boolean = true;
  _userList: Array<User>;
  errorMessage: string;

  currentDate: Date;
  nextResetDate: Date;
  lastResetDate: Date;
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

  ngOnInit(): void {
    this.currentDate = new Date();
  }

  selectUser(user) {
    this.selectedUser = user;
  }

  // Increment by one
  addQueueDay(val) {
    if (val) {
      let amount = parseInt(val);
      if (this.selectedUser) {
        let prompt = window.confirm(this.selectedUser.name + " will have " + this.selectedUser.currentQDays + " increased by " + val + " to " + (this.selectedUser.currentQDays + amount) + ". \nClick okay to confirm.");
        let newAmount = this.selectedUser.currentQDays + amount;
        this.userSerivice.updateQueueDays(this.selectedUser,newAmount).subscribe(r => {
          this.selectedUser.currentQDays += amount;
        })
      }
    }
  }

  updateQueueDays(val) {
    if (val) {
      let amount = parseInt(val);
      if (this.selectedUser && this.selectedUser.currentQDays != amount) {
        let prompt = window.confirm(this.selectedUser.name + " will have " + this.selectedUser.currentQDays + " changed to " + val + ". \nClick okay to confirm.");
        this.userSerivice.updateQueueDays(this.selectedUser, amount).subscribe(r => {
          this.selectedUser.currentQDays = amount;
        })
      }
    }
  }

  clearSelectedUser() {

  }

  // Oct-Dec = 1
  // Jan-Mar = 2
  // Apr-Jun = 3
  // Jul-Sep = 4
  getQuarter(d) {
    d = d || new Date(); // If no date supplied, use today
    var q = [2, 3, 4, 1];
    return q[Math.floor(d.getMonth() / 3)];
  }
  daysLeftInQuarter(d) {
    d = d || new Date();
    // d.setDate(d.getDate() + 43)
    var qEnd: any = new Date(d);
    qEnd.setMonth(qEnd.getMonth() + 3 - qEnd.getMonth() % 3, 0);
    return Math.floor((qEnd - d) / 8.64e7);
  }

  getResetDays() {
    let daysLeft = this.daysLeftInQuarter(new Date());
    return daysLeft
  }

  resetDays() {
    let prompt = window.confirm("Are you sure you want to reset queue days?\nPlease double check!\nIt may already be done!");
    if (prompt) {
      this._userList.forEach((el: User) => {
        if (el.currentQDays != 0) {
          this.userSerivice.resetRCC(el).subscribe(r => {
            el.currentQDays = 0;
          })
        }
      });
    }
  }
}

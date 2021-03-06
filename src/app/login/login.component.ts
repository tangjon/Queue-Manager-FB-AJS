import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authFlag = true;
  authMessage = "";

  constructor(public afAuth: AngularFireAuth) {
  }
  login(username: string, password: string) {
    // Todo this is work around
    username += "@scout33.org"
    this.afAuth.auth.signInWithEmailAndPassword(username, password)
      .catch(err => this.handleError(err));

  }
  logout() {
    this.afAuth.auth.signOut();
  }

  handleError(err) {
    this.authFlag = false;
    this.authMessage = err.code;
  }

}
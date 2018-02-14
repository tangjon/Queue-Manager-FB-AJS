import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { QueueControlComponent } from './queue-control/queue-control.component';
import { TeamManagerComponent } from './team-manager/team-manager.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RccManagementComponent } from './rcc-management/rcc-management.component';
import { ClipboardModule } from 'ngx-clipboard'
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ClipboardComponent } from './shared/clipboard/clipboard.component';
import { ComponentBarComponent } from './shared/component-bar/component-bar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { SettingsComponent } from './shared/settings/settings.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'qm/NW',
    pathMatch: 'full'
  },
  { path: 'home', redirectTo: 'qm/NW' },
  { path: 'manage', component: TeamManagerComponent },
  { path: 'rcc', component: RccManagementComponent },
  { path: 'qm/:id', component: QueueControlComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    QueueControlComponent,
    TeamManagerComponent,
    RccManagementComponent,
    LoadingSpinnerComponent,
    ClipboardComponent,
    ComponentBarComponent,
    SidebarComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    ClipboardModule,
    RouterModule.forRoot(
      appRoutes),
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

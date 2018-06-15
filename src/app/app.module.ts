import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { environment } from "../environments/environment";

// services
import { AuthService, AuthguardService, FirebaseService } from "./services";

// 3rd party
import { SortablejsModule } from "angular-sortablejs";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { Ng2PageScrollModule } from "ng2-page-scroll";
import { NguiAutoCompleteModule } from '@ngui/auto-complete'

// components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { CallbackComponent } from './callback/callback.component';
import { ListsComponent } from './lists/lists.component';
import { ListComponent } from './list/list.component';
import { SortComponent } from './sort/sort.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { MasterListComponent } from './master-list/master-list.component';
import { AddComponent } from './add/add.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    CallbackComponent,
    ListsComponent,
    ListComponent,
    SortComponent,
    AutoCompleteComponent,
    MasterListComponent,
    AddComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NguiAutoCompleteModule,
    AngularFirestoreModule,
    Ng2PageScrollModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    SortablejsModule.forRoot({
      animation: 200,
      handle: ".my-handle",
      scrollSensitivity: 50
    }),
    RouterModule.forRoot([
      { path: 'callback', component: CallbackComponent },
      { path: 'home', component: HomeComponent },
      { path: 'lists', component: ListsComponent, canActivate: [AuthguardService] },
      { path: 'sort/:id', component: SortComponent, canActivate: [AuthguardService] },
      { path: 'lists/:id', component: ListComponent, canActivate: [AuthguardService] },
      { path: 'master-list', component: MasterListComponent, canActivate: [AuthguardService] },
      { path: 'add/:id', component: AddComponent, canActivate: [AuthguardService] },
      { path: '', pathMatch: 'full', redirectTo: 'home' }
    ])
  ],
  providers: [
    AuthService,
    FirebaseService,
    AuthguardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

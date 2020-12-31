import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PipesModule } from './pipes/pipes.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { QuestionListComponent } from './question-list/question-list.component';
import { GameComponent } from './game/game.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { AddComponent } from './add/add.component';
import { FormsModule } from '@angular/forms';

const firebaseConfig = {
  apiKey: 'AIzaSyDDWXQTMlS7eN5WSHyk5dYhIr8cjy4kWl8',
  authDomain: 'marioplan-8d013.firebaseapp.com',
  databaseURL: 'https://marioplan-8d013.firebaseio.com',
  projectId: 'marioplan-8d013',
  storageBucket: 'marioplan-8d013.appspot.com',
  messagingSenderId: '739690477518',
  appId: '1:739690477518:web:a0be8b3a5122787880dd9f',
};

@NgModule({
  declarations: [
    AppComponent,
    QuestionListComponent,
    GameComponent,
    QuestionDetailComponent,
    AddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PipesModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [PipesModule],
})
export class AppModule {}

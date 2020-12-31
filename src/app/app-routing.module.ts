import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { GameComponent } from './game/game.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { QuestionListComponent } from './question-list/question-list.component';

const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'list', component: QuestionListComponent },
  { path: 'question', component: QuestionDetailComponent },
  { path: 'add', component: AddComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

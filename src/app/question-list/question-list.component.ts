import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Questions } from 'src/interfaces/questions.interface';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit, OnDestroy {
  questions$: Subscription;
  gameConfig$: Subscription;
  questions: Array<Questions> = [];
  configFile = {
    id: null,
    currentPlayer: null,
    activeQuestion: null,
  };
  constructor(private db: AngularFirestore, private router: Router) {}

  ngOnInit() {
    const questions = this.db
      .collection<Array<Questions>>('questions')
      .snapshotChanges();
    const gameConfig = this.db.collection('game-config').snapshotChanges();
    this.gameConfig$ = gameConfig
      .pipe(
        map((changes) =>
          changes.map(({ payload: { doc } }) => {
            const id = doc.id;
            const data: any = doc.data();
            return { id, ...data };
          })
        )
      )
      .subscribe(
        (
          config: Array<{
            activeQuestion: string;
            id: string;
            currentPlayer: number;
          }>
        ) => {
          this.configFile.activeQuestion = config[0]?.activeQuestion.trim();
          this.configFile.id = config[0]?.id.trim();
          this.configFile.currentPlayer = config[0]?.currentPlayer;
        }
      );
    this.questions$ = questions
      .pipe(
        map((changes) =>
          changes.map(({ payload: { doc } }) => {
            const id = doc.id;
            const data = doc.data();
            return { id, ...data };
          })
        )
      )
      .subscribe((questions) => {
        this.questions = questions;
      });
  }

  ngOnDestroy() {
    this.questions$?.unsubscribe();
    this.gameConfig$?.unsubscribe();
  }

  goTo(question: Questions) {
    question.answers.forEach((ans) => {
      ans.status = false;
    });
    this.db
      .collection('questions')
      .doc(`/${question.id}`)
      .set({ ...question })
      .then(async () => {
        await this.db
          .collection('game-config')
          .doc(`/${this.configFile.id}`)
          .set({
            currentPlayer: this.configFile.currentPlayer,
            activeQuestion: question.id,
          });
      });
    const extras: NavigationExtras = {
      queryParams: { question: JSON.stringify(question) },
    };
    this.router.navigate(['question'], extras);
  }
}

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Answer, Questions } from '../../interfaces/questions.interface';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
})
export class QuestionDetailComponent implements OnInit {
  configFile = {
    id: null,
    currentPlayer: null,
    activeQuestion: null,
  };
  gameConfig$: Subscription;
  constructor(private router: ActivatedRoute, private db: AngularFirestore) {}
  question: Questions = null;

  ngOnInit(): void {
    this.router.queryParams.subscribe((params: Params) => {
      this.question = JSON.parse(params['question']);
    });
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
  }

  getAnswerScore(rank: number) {
    switch (rank) {
      case 1:
        return 21;
      case 2:
        return 16;
      case 3:
        return 13;
      case 4:
        return 11;
      case 5:
        return 7;
    }
  }

  updateAnswerStatus(answer: Answer) {
    if (answer.status) {
      return;
    }
    answer.status = true;
    this.db
      .collection('questions')
      .doc(`/${this.question.id}`)
      .set({ ...this.question })
      .then(() => {});
  }

  async setPlayer(player: number) {
    await this.db.collection('game-config').doc(`/${this.configFile.id}`).set({
      currentPlayer: player,
      activeQuestion: this.configFile.activeQuestion,
    });
  }

  async activateError() {
    await this.db
      .collection('game-error')
      .doc(`TkxFnh9AKYm12OqV417r`)
      .set({
        error: parseInt(Math.random().toFixed(4).split('.')[1]) * -1,
      });
  }

  async updateScore() {
    await this.db
      .collection('game-score')
      .doc(`DkKeGw82syPVhq5iQYl5`)
      .set({
        score: parseInt(Math.random().toFixed(4).split('.')[1]),
      });
  }

  async win() {
    await this.db
      .collection('game-score')
      .doc(`DkKeGw82syPVhq5iQYl5`)
      .set({
        score: parseInt(Math.random().toFixed(4).split('.')[1]) * -1,
      });
  }
}

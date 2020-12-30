import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Questions } from '../../interfaces/questions.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  constructor(private db: AngularFirestore) {}
  gameConfig$: Subscription = null;
  question$: Subscription = null;
  error$: Subscription = null;
  score$: Subscription = null;
  gameConfig: {
    activeQuestion: string;
    currentPlayer: number;
  } = {
    activeQuestion: null,
    currentPlayer: null,
  };
  question: Questions = null;
  currentScore = 0;
  playerOne = 0;
  playerTwo = 0;
  errorCotuner = 0;
  errorVisible = false;
  currentQuestion = null;
  ngOnInit() {
    this.error$ = this.db
      .collection('game-error')
      .doc('TkxFnh9AKYm12OqV417r')
      .valueChanges()
      .subscribe((sub: any) => {
        if (sub.error < 0) {
          if (this.errorCotuner >= 3) {
            this.errorCotuner = 0;
          }
          this.errorCotuner++;
          this.onErrorActivation();
        }
      });
    this.score$ = this.db
      .collection('game-score')
      .doc('DkKeGw82syPVhq5iQYl5')
      .valueChanges()
      .subscribe(async (val: any) => {
        console.log('score', val);
        if (val.score < 0) {
          await this.playAudio(2);
          await this.db
            .collection('game-score')
            .doc(`DkKeGw82syPVhq5iQYl5`)
            .set({
              score: parseInt(Math.random().toFixed(4).split('.')[1]),
            });
        } else {
          this.updateScore();
        }
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
        (config: Array<{ activeQuestion: string; currentPlayer: number }>) => {
          this.gameConfig.activeQuestion = config[0]?.activeQuestion.trim();
          this.gameConfig.currentPlayer = config[0]?.currentPlayer;

          this.question$ = this.db
            .collection<Array<Questions>>('questions')
            .snapshotChanges()
            .pipe(
              map((changes) =>
                changes.map(({ payload: { doc } }) => {
                  const id = doc.id;
                  if (id.trim() === this.gameConfig.activeQuestion) {
                    const data = doc.data();
                    return { id, ...data };
                  }
                })
              )
            )
            .subscribe(async (question) => {
              const tmp = question.filter((q) => q);
              if (question) {
                this.question = tmp[0];
              }
              if (
                this.currentQuestion !== null &&
                this.currentQuestion === this.question.id &&
                this.gameConfig.currentPlayer !== config[0].currentPlayer
              ) {
                await this.playAudio(1);
              }
              this.currentQuestion = this.question.id;
            });
        }
      );
  }

  ngOnDestroy() {
    this.gameConfig$?.unsubscribe();
    this.question$?.unsubscribe();
    this.error$?.unsubscribe();
  }

  getCurrentScore() {
    let score = 0;
    this.question?.answers
      .filter((q) => q.status)
      .forEach((q) => {
        score += this.getAnswerScore(q.rank);
      });
    return score;
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

  getError() {
    switch (this.errorCotuner) {
      case 1:
        return 'X';
      case 2:
        return 'XX';
      case 3:
        return 'XXX';
    }
  }

  async onErrorActivation() {
    await this.playAudio(3);
    // this.errorVisible = true;
    // this.errorVisible = false;
    // // setTimeout(() => {
    // // }, 300);

    await this.db.collection('game-error').doc(`TkxFnh9AKYm12OqV417r`).set({
      error: 400,
    });
  }

  updateScore() {
    if (this.getCurrentScore() > 0) {
      if (this.gameConfig.currentPlayer === 1) {
        this.playerOne += this.getCurrentScore();
      } else {
        this.playerTwo += this.getCurrentScore();
      }
    }
  }

  async playAudio(opt) {
    const audio = new Audio();
    if (opt === 1) {
      audio.src = `../../assets/reveal.ogg`;
    } else if (opt === 2) {
      audio.src = `../../assets/correct.ogg`;
    } else {
      audio.src = `../../assets/wrong.ogg`;
    }

    audio.load();
    await audio.play();
  }
}

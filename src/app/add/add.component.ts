import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Answer, Questions } from 'src/interfaces/questions.interface';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  question = '';
  answers: Array<Answer> = [
    {
      answer: '',
      rank: 1,
      status: false,
    },
    {
      answer: '',
      rank: 2,
      status: false,
    },
    {
      answer: '',
      rank: 3,
      status: false,
    },
    {
      answer: '',
      rank: 4,
      status: false,
    },
    {
      answer: '',
      rank: 5,
      status: false,
    },
  ];
  error = false;

  constructor(private db: AngularFirestore) {}

  ngOnInit(): void {}

  async add() {
    if (this.question.length === 0) {
      this.error = true;
      return;
    }
    for (const ans of this.answers) {
      if (ans.answer.length === 0) {
        this.error = true;
        return;
      }
    }
    this.error = false;
    const ref = await this.db.collection('questions').add({
      question: this.question,
      answers: this.answers,
    });
    if (ref) {
      this.question = '';
      this.answers.forEach((a) => (a.answer = ''));
    }
  }
}

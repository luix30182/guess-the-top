import { Pipe, PipeTransform } from '@angular/core';
import { Answer } from 'src/interfaces/questions.interface';

@Pipe({
  name: 'byScore'
})
export class ByScorePipe implements PipeTransform {

  transform(answers: Array<Answer>, args: number): Array<Answer> {
    return answers.sort((a, b) => {
      return a.rank > b.rank ? 1 : -1
    });
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byScore'
})
export class ByScorePipe implements PipeTransform {

  transform(answers: Array<{ ans: string, score: number }>, args: number): Array<{ ans: string, score: number }> {
    return answers.sort((a, b) => {
      return a.score > b.score ? -1 : 1
    });
  }

}

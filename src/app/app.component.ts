import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  answers = [
    {
      ans: 'manzana',
      score: 7
    }
    , {
      ans: 'pera',
      score: 21
    },
    {
      ans: 'mango',
      score: 16
    }
    , {
      ans: 'fresa',
      score: 11
    }, {
      ans: 'sandia',
      score: 14
    }

  ]
}

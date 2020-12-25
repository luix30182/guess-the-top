import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ByScorePipe } from './by-score.pipe';



@NgModule({
  declarations: [ByScorePipe],
  imports: [
    CommonModule,
  ],
  exports: [ByScorePipe]
})
export class PipesModule { }

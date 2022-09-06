import { FilterStatusPipe } from '../filter-status.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterUserPipe } from 'src/app/components/pipe/filter-user.pipe';
import { FilterDatePipe } from 'src/app/components/pipe/filter-date.pipe';
import { PaginationPipe } from '../pagination.pipe';
import { FilterDataMesPipe } from '../filter-data-mes.pipe';

@NgModule({
  declarations: [
    FilterUserPipe,
    FilterDatePipe,
    PaginationPipe,
    FilterDataMesPipe,
    FilterStatusPipe,
  ],
  imports: [CommonModule],
  exports: [
    FilterUserPipe,
    FilterDatePipe,
    PaginationPipe,
    FilterDataMesPipe,
    FilterStatusPipe,
  ],
})
export class PipesModuleModule {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'st-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {

}

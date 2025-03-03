import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryEditComponent } from '../inventory-edit/inventory-edit.component';

@Component({
  selector: 'app-inventory-add',
  standalone: true,
  imports: [RouterModule, InventoryEditComponent],
  template: `<app-inventory-edit></app-inventory-edit>`
})
export class InventoryAddComponent {}
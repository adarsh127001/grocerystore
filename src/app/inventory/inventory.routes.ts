import { Routes } from '@angular/router';
import { StockOverviewComponent } from './stock-overview/stock-overview.component';
import { InventoryEditComponent } from './inventory-edit/inventory-edit.component';
import { InventoryAddComponent } from './inventory-add/inventory-add.component';

export const INVENTORY_ROUTES: Routes = [
  { 
    path: '', 
    component: StockOverviewComponent 
  },
  {
    path: 'add',
    component: InventoryAddComponent
  },
  {
    path: 'edit/:id',
    component: InventoryEditComponent
  }
];
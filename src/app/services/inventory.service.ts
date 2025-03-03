import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: Date;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: 'Organic Apples',
      category: 'Fruits',
      quantity: 200,
      price: 1.99,
      expiryDate: new Date('2025-03-15'),
      supplier: 'Fresh Farms Inc.',
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Whole Milk',
      category: 'Dairy',
      quantity: 50,
      price: 3.49,
      expiryDate: new Date('2025-03-10'),
      supplier: 'Dairy Fresh Co.',
      status: 'In Stock'
    },
    {
      id: 3,
      name: 'Whole Wheat Bread',
      category: 'Bakery',
      quantity: 30,
      price: 2.99,
      expiryDate: new Date('2025-03-07'),
      supplier: 'Golden Grain Bakery',
      status: 'In Stock'
    },
    {
      id: 4,
      name: 'Tomatoes',
      category: 'Vegetables',
      quantity: 10,
      price: 1.49,
      expiryDate: new Date('2025-03-08'),
      supplier: 'Veggie Market Co.',
      status: 'Low Stock'
    },
    {
      id: 5,
      name: 'Chicken Breast',
      category: 'Meat',
      quantity: 0,
      price: 5.99,
      expiryDate: new Date('2025-03-12'),
      supplier: 'Premium Meats LLC',
      status: 'Out of Stock'
    }
  ];

  constructor() {}

  getInventoryItems(): Observable<InventoryItem[]> {
    return of(this.inventoryItems);
  }

  getInventoryItem(id: number): Observable<InventoryItem | undefined> {
    const item = this.inventoryItems.find(item => item.id === id);
    return of(item);
  }

  addInventoryItem(item: Omit<InventoryItem, 'id'>): Observable<InventoryItem> {
    // Generate a new ID (in a real app this would be handled by the backend)
    const newId = Math.max(...this.inventoryItems.map(item => item.id)) + 1;
    
    const newItem = {
      id: newId,
      ...item
    };
    
    this.inventoryItems.push(newItem);
    return of(newItem);
  }

  updateInventoryItem(updatedItem: InventoryItem): Observable<InventoryItem> {
    const index = this.inventoryItems.findIndex(item => item.id === updatedItem.id);
    
    if (index !== -1) {
      this.inventoryItems[index] = updatedItem;
    }
    
    return of(updatedItem);
  }

  deleteInventoryItem(id: number): Observable<boolean> {
    const initialLength = this.inventoryItems.length;
    this.inventoryItems = this.inventoryItems.filter(item => item.id !== id);
    
    return of(initialLength > this.inventoryItems.length);
  }
}
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { InventoryService, InventoryItem } from '../../services/inventory.service';
import { SidenavComponent } from '../../shared/components/sidenav/sidenav.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-inventory-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SidenavComponent,
    HeaderComponent
  ],
  templateUrl: './inventory-edit.component.html',
  styleUrl: './inventory-edit.component.css'
})
export class InventoryEditComponent implements OnInit {
  inventoryForm: FormGroup;
  isLoading = false;
  isNewItem = true;
  itemId: number | null = null;
  formError: string | null = null;

  categories: string[] = [
    'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Seafood', 
    'Frozen Foods', 'Beverages', 'Snacks', 'Canned Foods'
  ];

  suppliers: string[] = [
    'Fresh Farms Inc.', 'Dairy Fresh Co.', 'Golden Grain Bakery', 
    'Veggie Market Co.', 'Premium Meats LLC', 'Ocean Harvest Inc.',
    'Frozen Delights', 'Beverage World', 'Snack Kingdom', 'Canned Goods LLC'
  ];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.inventoryForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      expiryDate: [new Date(), [Validators.required]],
      supplier: ['', [Validators.required]],
      status: ['In Stock', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Get item ID from route if it exists
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.itemId = +id;
        this.isNewItem = false;
        this.loadItem(this.itemId);
      }
    });
  }

  loadItem(id: number): void {
    this.isLoading = true;
    
    this.inventoryService.getInventoryItem(id).subscribe({
      next: (item) => {
        if (item) {
          // Convert date string to Date object if needed
          let expiryDate = item.expiryDate;
          if (typeof expiryDate === 'string') {
            expiryDate = new Date(expiryDate);
          }
          
          this.inventoryForm.patchValue({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
            expiryDate: expiryDate,
            supplier: item.supplier,
            status: item.status
          });
        } else {
          this.snackBar.open('Item not found', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/inventory']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading inventory item:', error);
        this.isLoading = false;
        this.snackBar.open('Error loading item', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/inventory']);
      }
    });
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      this.isLoading = true;
      
      const formData = this.inventoryForm.value;
      
      // Determine the status based on quantity
      let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
      if (formData.quantity <= 0) {
        status = 'Out of Stock';
      } else if (formData.quantity <= 20) {
        status = 'Low Stock';
      }
      
      formData.status = status;
      
      if (this.isNewItem) {
        // Add new item
        this.inventoryService.addInventoryItem(formData).subscribe({
          next: (item) => {
            this.isLoading = false;
            this.snackBar.open('Item added successfully', 'Close', {
              duration: 3000
            });
            this.router.navigate(['/inventory']);
          },
          error: (error) => {
            console.error('Error adding inventory item:', error);
            this.isLoading = false;
            this.formError = 'Error adding item. Please try again.';
            this.snackBar.open('Error adding item', 'Close', {
              duration: 3000
            });
          }
        });
      } else if (this.itemId) {
        // Update existing item
        const updatedItem: InventoryItem = {
          id: this.itemId,
          ...formData
        };
        
        this.inventoryService.updateInventoryItem(updatedItem).subscribe({
          next: (item) => {
            this.isLoading = false;
            this.snackBar.open('Item updated successfully', 'Close', {
              duration: 3000
            });
            this.router.navigate(['/inventory']);
          },
          error: (error) => {
            console.error('Error updating inventory item:', error);
            this.isLoading = false;
            this.formError = 'Error updating item. Please try again.';
            this.snackBar.open('Error updating item', 'Close', {
              duration: 3000
            });
          }
        });
      }
    }
  }
}
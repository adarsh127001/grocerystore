import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';

export interface TaskData {
  id?: string;
  taskType?: string;
  assignee?: string;
  priorityLevel?: 'Critical' | 'Severe' | 'Normal';
  dueDate?: Date;
  location?: string;
  productType?: string;
  supplier?: string;
  quantity?: number;
  price?: number;
  sellingPrice?: string;
  isEdit?: boolean;
}

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatTabsModule,
    MatSliderModule
  ],
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css']
})
export class TaskModalComponent implements OnInit {
  taskForm!: FormGroup;
  stockForm!: FormGroup;
  activeTabIndex = 0;
  
  taskTypes = [
    'Cash Management',
    'Financial Reporting',
    'Vendors & Contracts',
    'Advertising'
  ];
  
  assignees = [
    'Brian O\'Conner',
    'Dominic Toretto',
    'Roman Pearce',
    'Letty Ortiz',
    'Mia Toretto'
  ];
  
  productTypes = [
    'Dairy',
    'Bakery',
    'Produce',
    'Meat',
    'Beverages',
    'Snacks'
  ];
  
  suppliers = [
    'Kellogs',
    'Dairyland',
    'Wonder',
    'Farm Fresh',
    'Amul',
    'Kraft'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskData
  ) {}

  ngOnInit(): void {
    this.initTaskForm();
    this.initStockForm();
    
    if (this.data && this.data.isEdit) {
      this.patchFormValues();
    }
  }

  initTaskForm(): void {
    this.taskForm = this.fb.group({
      taskType: ['', Validators.required],
      assignee: ['', Validators.required],
      priorityLevel: ['Normal', Validators.required],
      dueDate: [null, Validators.required],
      location: ['']
    });
  }

  initStockForm(): void {
    this.stockForm = this.fb.group({
      productType: ['', Validators.required],
      supplier: ['', Validators.required],
      quantity: [50, [Validators.required, Validators.min(1)]],
      price: [50, [Validators.required, Validators.min(1)]],
      sellingPrice: ['', Validators.required]
    });
  }

  patchFormValues(): void {
    if (this.data) {
      this.taskForm.patchValue({
        taskType: this.data.taskType || '',
        assignee: this.data.assignee || '',
        priorityLevel: this.data.priorityLevel || 'Normal',
        dueDate: this.data.dueDate || null,
        location: this.data.location || ''
      });
      
      this.stockForm.patchValue({
        productType: this.data.productType || '',
        supplier: this.data.supplier || '',
        quantity: this.data.quantity || 50,
        price: this.data.price || 50,
        sellingPrice: this.data.sellingPrice || ''
      });
    }
  }

  formatLabel(value: number): string {
    return value.toString();
  }

  onTabChange(index: number): void {
    this.activeTabIndex = index;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log('Submit button clicked');
    console.log('Active tab index:', this.activeTabIndex);
    
    if (this.activeTabIndex === 0) {
      console.log('Task form valid:', this.taskForm.valid);
      console.log('Task form values:', this.taskForm.value);
      console.log('Task form controls:', this.taskForm.controls);
      
      if (this.taskForm.valid) {
        const result = {
          ...this.taskForm.value,
          isTaskAssignment: true,
          isEdit: this.data.isEdit
        };
        console.log('Submitting task data:', result);
        this.dialogRef.close(result);
      } else {
        console.log('Task form is invalid');
        // Mark all fields as touched to show validation errors
        Object.keys(this.taskForm.controls).forEach(key => {
          const control = this.taskForm.get(key);
          control?.markAsTouched();
          console.log(`Control ${key} valid:`, control?.valid, 'errors:', control?.errors);
        });
      }
    } else if (this.activeTabIndex === 1) {
      console.log('Stock form valid:', this.stockForm.valid);
      console.log('Stock form values:', this.stockForm.value);
      console.log('Stock form controls:', this.stockForm.controls);
      
      if (this.stockForm.valid) {
        const result = {
          ...this.stockForm.value,
          isNewStock: true,
          isEdit: this.data.isEdit
        };
        console.log('Submitting stock data:', result);
        this.dialogRef.close(result);
      } else {
        console.log('Stock form is invalid');
        // Mark all fields as touched to show validation errors
        Object.keys(this.stockForm.controls).forEach(key => {
          const control = this.stockForm.get(key);
          control?.markAsTouched();
          console.log(`Control ${key} valid:`, control?.valid, 'errors:', control?.errors);
        });
      }
    }
  }
}

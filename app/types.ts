// Define the Supplier interface
export interface Supplier {
  id: string;
  name: string;
  userId: string;
}

// Define the Category interface
export interface Category {
  id: string;
  name: string;
  userId: string;
}

// Define the Product interface
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  status?: string;
  createdAt: Date;
  userId: string;
  categoryId: string;
  supplierId: string;
  // CORRECTED: The category is an object of type Category
  category?: Category;
  // CORRECTED: The supplier is an object of type Supplier
  supplier?: Supplier;
}
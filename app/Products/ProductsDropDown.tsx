"use client";

import { Product } from "@/app/types";
import { useProductStore } from "@/app/useProductStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductsDropDownProps {
  row: {
    original: Product;
  };
}

export default function ProductsDropDown({ row }: ProductsDropDownProps) {
  const {
    addProduct,
    deleteProduct,
    setSelectedProduct,
    setOpenProductDialog,
    loadProducts,
  } = useProductStore();
  const router = useRouter();
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyProduct = async () => {
    setIsCopying(true);

    try {
      const uniqueSku = `${row.original.sku}-${Date.now()}`;

      const productToCopy: Product = {
        ...row.original,
        id: Date.now().toString(),
        name: `${row.original.name} (copy)`,
        sku: uniqueSku,
        createdAt: new Date(),
        // CORRECTED: Remove the string fallback to match the 'Product' type.
        // If the category/supplier doesn't exist, it will correctly remain 'undefined'.
        category: row.original.category,
        supplier: row.original.supplier,
      };

      const result = await addProduct(productToCopy);
      if (result.success) {
        toast({
          title: "Product Copied Successfully!",
          description: `"${row.original.name}" has been copied with a new SKU.`,
        });
        await loadProducts();
        router.refresh();
      } else {
        toast({
          title: "Copy Failed",
          description: "Failed to copy the product. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "An unexpected error occurred while copying the product.",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleEditProduct = () => {
    try {
      setSelectedProduct(row.original);
      setOpenProductDialog(true);
    } catch (error) {
      console.error("Error opening edit dialog:", error);
    }
  };

  const handleDeleteProduct = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteProduct(row.original.id);
      if (result.success) {
        toast({
          title: "Product Deleted Successfully!",
          description: `"${row.original.name}" has been permanently deleted.`,
        });
        router.refresh();
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete the product. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "An unexpected error occurred while deleting the product.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyProduct} disabled={isCopying}>
          {isCopying ? "Copying..." : "Copy"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditProduct}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteProduct} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
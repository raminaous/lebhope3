"use client"; // Add this if using client components

import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore"; // Firestore functions
import { db } from "../Database/Config"; // Adjust path as needed
import ProductForm from "../components/ProductForm"; // Adjust path as needed
import ProductList from "../components/ProductList"; // Adjust path as needed
import Link from "next/link"; // Next.js Link
import { useRouter } from "next/navigation"; // useRouter hook
import {
  addProduct,
  deleteProduct,
  editProduct,
  uploadImage,
} from "../Database/firebaseProduct"; // Adjust import based on your structure

// Hook to handle adding a product
const useAddProduct = () => {
  const [uploading, setUploading] = useState(false);

  const handleAddProduct = async (product, files) => {
    setUploading(true);
    try {
      // Upload each file and get its URL
      const imageUrls = await Promise.all(
        files.map((file) => uploadImage(file))
      );

      // Add the product to Firestore with an array of image URLs
      await addProduct({
        ...product,
        sizes: product.sizes.split(",").map((size) => size.trim()), // Convert sizes to an array
        imageUrls, // Store all uploaded image URLs in an array
      });

      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    } finally {
      setUploading(false);
    }
  };

  return { handleAddProduct, uploading };
};

// Hook to handle editing a product
const useEditProduct = () => {
  const [uploading, setUploading] = useState(false);

  const handleEditProduct = async (id, updatedProduct, files) => {
    setUploading(true);
    try {
      // If there are new files, upload each one and get URLs
      if (files && files.length > 0) {
        const imageUrls = await Promise.all(
          files.map((file) => uploadImage(file))
        );
        updatedProduct.imageUrls = imageUrls; // Update the product's imageUrls array
      }

      // Convert sizes to array if it's not already
      const sizesArray = Array.isArray(updatedProduct.sizes)
        ? updatedProduct.sizes
        : updatedProduct.sizes.split(",").map((size) => size.trim());

      await editProduct(id, {
        ...updatedProduct,
        sizes: sizesArray,
      });

      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error editing product:", error);
      alert("Failed to update product.");
    } finally {
      setUploading(false);
    }
  };

  return { handleEditProduct, uploading };
};

// Hook to handle deleting a product
const useDeleteProduct = () => {
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id); // Call the delete function
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return { handleDeleteProduct };
};

// Admin component
export default function Admin() {
  const [products, setProducts] = useState([]); // State for holding products
  const [editingProduct, setEditingProduct] = useState(null); // State for tracking product being edited
  const { handleAddProduct, uploading } = useAddProduct(); // Use add product hook
  const { handleEditProduct } = useEditProduct(); // Use edit product hook
  const { handleDeleteProduct } = useDeleteProduct(); // Use delete product hook
  const router = useRouter(); // Initialize the router

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsData); // Update state with fetched products
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission for adding or editing a product
  const handleSubmit = async (product, files) => {
    if (editingProduct) {
      await handleEditProduct(editingProduct.id, product, files);
      setEditingProduct(null); // Reset editing state
    } else {
      await handleAddProduct(product, files);
    }
    fetchProducts(); // Refresh product list after submission
  };

  // Handle clicking edit button to set the product for editing
  const handleEdit = (product) => {
    setEditingProduct(product); // Set product to be edited
  };

  return (
    <div>
      <h1>Product Management</h1>
      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/")} // Adjust the path as needed
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
      <Link href="/orderlist">
        <button
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          View Order List
        </button>
      </Link>
      <ProductForm onSubmit={handleSubmit} initialData={editingProduct} />
      {uploading && <p>Uploading product...</p>} {/* Display upload message */}
      <h1>Products</h1>
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}

"use client"; // Add this if using client components

import { useState, useEffect } from "react";
import "../styles/ProductForm.css";

export default function ProductForm({ onSubmit, initialData }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    sizes: "",
    price: "",
    imageUrls: [],
  });
  const [files, setFiles] = useState([]); // To handle multiple files
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]); // Get all selected files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    await onSubmit(product, files); // Pass array of files to onSubmit

    setUploading(false);
    setProduct({
      name: "",
      description: "",
      sizes: "",
      price: "",
      imageUrls: [],
    });
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        className="input-field"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
        className="textarea-field"
        required
      />
      <input
        type="text"
        name="sizes"
        placeholder="Sizes (comma separated)"
        value={product.sizes}
        onChange={handleChange}
        className="input-field"
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        className="input-field"
        required
      />
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="file-input"
      />
      <button type="submit" className="submit-button" disabled={uploading}>
        {initialData ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}

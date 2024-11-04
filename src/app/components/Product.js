import { useState, useEffect } from "react";
import "../styles/Product.css";
import Image from "next/image";

const Product = ({ products, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState({});

  const handleSizeChange = (productId, size) => {
    setSelectedSize((prev) => ({ ...prev, [productId]: size }));
  };

  useEffect(() => {
    // Automatically switch images every 3 seconds for each product
    const intervalId = setInterval(() => {
      setActiveImageIndex((prev) =>
        products.reduce((newState, product) => {
          // Toggle between index 0 and 1 if there are two images, otherwise stay at 0
          const hasTwoImages = product.imageUrls.length > 1; // Check for multiple images
          newState[product.id] = hasTwoImages
            ? (prev[product.id] || 0) === 0
              ? 1
              : 0
            : 0; // Stay on the first image if only one image
          return newState;
        }, {})
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [products]);

  return (
    <div className="product-section">
      <h2 className="product-title">Products</h2>
      <div className="product-row">
        {products.map((product) => {
          const currentImage =
            activeImageIndex[product.id] === 1 && product.imageUrls[1]
              ? product.imageUrls[1]
              : product.imageUrls[0]; // Get the correct image URL

          return (
            <div key={product.id} className="product-card">
              {currentImage && (
                <Image
                  src={currentImage}
                  alt={product.name}
                  className="product-image"
                  width={500}
                  height={500}
                />
              )}
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">{`Price: $${product.price}`}</div>

              <select
                value={selectedSize[product.id] || ""}
                onChange={(e) => handleSizeChange(product.id, e.target.value)}
                className="size-select"
                required
              >
                <option value="">Select a size</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              <button
                onClick={() => onAddToCart(product, selectedSize[product.id])}
                className="add-button"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Product;

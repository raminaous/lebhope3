import { useDeleteProduct } from "../hooks/useDeleteProduct";
import "../styles/ProductItem.css";
import Image from "next/image";

export default function ProductItem({ product, onEdit }) {
  const { handleDeleteProduct } = useDeleteProduct();

  const handleEdit = () => {
    onEdit(product);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      await handleDeleteProduct(product.id);
    }
  };

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Sizes</th>
          <th>Images</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{product.name}</td>
          <td>{product.description}</td>
          <td>${product.price}</td>
          <td>{product.sizes.join(", ")}</td>
          <td>
            <div className="product-images-container">
              {product.imageUrls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={product.name}
                  className="product-image"
                  width={80}
                  height={80}
                />
              ))}
            </div>
          </td>
          <td>
            <button onClick={handleEdit} className="button-edit">
              Edit
            </button>
            <button onClick={handleDelete} className="button-delete">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

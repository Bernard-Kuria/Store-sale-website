import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./AddItemForm.css";

export default function AddItemForm({ setRefresh }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  // Add setRefresh prop
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    stock: "",
    image: null, // Change to store the file object
  });

  const [buttonState, setButtonState] = useState(true);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: files ? files[0] : value, // If input is file, store the first file object
      };
      return updatedFormData;
    });

    if (name === "image" && files.length > 0) {
      console.log("Selected Image:", files[0]); // Debugging check
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      console.error("No image selected before submission!");
      alert("Please select an image before submitting.");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("productName", formData.productName);
    formDataObj.append("price", formData.price);
    formDataObj.append("stock", formData.stock);
    formDataObj.append("image", formData.image);

    console.log("Image Data (Before Upload):", formData.image);

    try {
      const response = await axios.post(`${apiUrl}/store`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Item added:", response.data);
      alert("Item added successfully!");

      setFormData({ productName: "", price: "", stock: "", image: null });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  const handleRemoveItem = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(
        `${apiUrl}/store/${formData.productName}` // Use dynamic API URL
      );
      console.log("Shoe removed:", response.data);
      alert("Shoe removed successfully!");
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error removing shoe:", error);
      alert("Failed to remove shoe. Please try again.");
    }
  };

  return (
    <>
      <Link to="/">
        <button className="back-button">BACK TO ITEMS PAGE</button>
      </Link>
      <div className="form">
        <div className="buttons">
          <button className="add-item" onClick={() => setButtonState(true)}>
            Add
          </button>
          <button className="remove-item" onClick={() => setButtonState(false)}>
            Remove
          </button>
        </div>
        {buttonState ? (
          <AddItem
            formData={formData}
            handleChange={handleChange}
            handleAddItem={handleAddItem}
          />
        ) : (
          <RemoveItem
            formData={formData}
            handleChange={handleChange}
            handleRemoveItem={handleRemoveItem}
          />
        )}
      </div>
    </>
  );
}

// AddItemForm.propTypes = {
//   setRefresh: PropTypes.func.isRequired,
// };

function AddItem({ formData, handleChange, handleAddItem }) {
  return (
    <form onSubmit={handleAddItem}>
      <label className="item-name">
        Item Name:
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />
      </label>
      <label className="item-price">
        Price:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </label>
      <label className="item-stock">
        Stock:
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />
      </label>
      <label className="item-image">
        Image URL:
        <label className="item-image">
          Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </label>
      </label>
      <button className="submit-button" type="submit">
        Add Item
      </button>
    </form>
  );
}

AddItem.propTypes = {
  formData: PropTypes.shape({
    productName: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    stock: PropTypes.string.isRequired,
    image: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.string]), // Allow File or string
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
};

function RemoveItem({ formData, handleChange, handleRemoveItem }) {
  return (
    <form onSubmit={handleRemoveItem}>
      <label className="item-name">
        Item Name:
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Remove Item</button>
    </form>
  );
}

RemoveItem.propTypes = {
  formData: PropTypes.shape({
    productName: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemoveItem: PropTypes.func.isRequired,
};

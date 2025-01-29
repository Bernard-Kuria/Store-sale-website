import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./styling/AddItemForm.css";

export default function AddItemForm({ setRefresh }) {
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
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value, // Store file object for image
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();
      formDataObj.append("productName", formData.productName);
      formDataObj.append("price", formData.price);
      formDataObj.append("stock", formData.stock);
      if (formData.image) formDataObj.append("image", formData.image);

      const response = await axios.post(
        "http://localhost:5000/store",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Item added:", response.data);
      alert("Item added successfully!");
      window.location.reload(); // Refresh the page
      // Delay refresh after successful item addition
      setTimeout(() => {
        setRefresh((prev) => !prev); // Toggle refresh state after a delay
      }, 500); // Wait for a moment to allow the UI to settle
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  const handleRemoveItem = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(
        `http://localhost:5000/store/${formData.productName}`
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

AddItemForm.propTypes = {
  setRefresh: PropTypes.func.isRequired,
};

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
        <input type="file" name="image" onChange={handleChange} required />
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
    image: PropTypes.object, // File object
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

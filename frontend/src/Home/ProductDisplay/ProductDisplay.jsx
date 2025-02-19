import PropTypes from "prop-types";

import "./ProductDisplay.css";

export default function ProductDisplay({
  id,
  productName,
  price,
  stock,
  image,
  showSelectedProduct,
}) {
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <div
      className={`product ${stock <= 0 ? "soldOut" : ""}`}
      onClick={() => showSelectedProduct(id)}
    >
      <div className="image-container">
        <img className="product-image" src={`${apiUrl}${image}`} alt="Image" />
      </div>
      <h3 className="shoe-name"> {productName} </h3>
      <h4 className="price"> {price + "ksh"} </h4>
      {stock <= 0 ? (
        <h6 className="stock">soldOut</h6>
      ) : (
        <h6 className="stock">{`(${stock} in stock)`}</h6>
      )}
    </div>
  );
}

ProductDisplay.propTypes = {
  id: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  stock: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  showSelectedProduct: PropTypes.func.isRequired,
};

import PropTypes from "prop-types";

export default function ProductDisplay({ productName, price, stock, image }) {
  const apiUrl = import.meta.env.VITE_API_URL; // Get the API URL

  return (
    <div className={`product ${stock <= 0 ? "soldOut" : ""}`}>
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
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  stock: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
};

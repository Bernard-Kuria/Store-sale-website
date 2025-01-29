export default function ProductDisplay({ productName, price, stock, image }) {
  return (
    <div className={`product ${stock <= 0 ? "soldOut" : ""}`}>
      <div className="image-container">
        <img
          className="product-image"
          src={`http://localhost:5000${image}`}
          alt="Image"
        />
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

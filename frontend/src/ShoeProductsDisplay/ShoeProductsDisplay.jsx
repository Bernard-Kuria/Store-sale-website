export default function ShoeProductsDisplay({
  shoeName,
  price,
  stock,
  image,
  imageSize,
  scroll,
  setScroll,
}) {
  return (
    <div
      className={`container ${stock <= 0 ? "soldOut" : ""}`}
      style={{
        width: `${imageSize}rem`,
        height: "auto",
        aspectRatio: "5 / 4",
        margin: "1%",
      }}
    >
      <div className="image-container">
        <img className="product-image" src={image} alt="Image" />
      </div>
      <h3 className="shoe-name"> {shoeName} </h3>
      <h4 className="price"> {price + "ksh"} </h4>
      {stock <= 0 ? (
        <h6 className="stock">soldOut</h6>
      ) : (
        <h6 className="stock">{`(${stock} in stock)`}</h6>
      )}
    </div>
  );
}

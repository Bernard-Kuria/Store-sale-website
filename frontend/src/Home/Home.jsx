import React, { useState, useEffect, Suspense } from "react";
import PropTypes from "prop-types";
import Header from "../Home/Header/Header.jsx";
import Footer from "../Home/Footer/Footer.jsx";

import "./Home.css";

// Lazy load ProductDisplay component
const ProductDisplay = React.lazy(() =>
  import("./ProductDisplay/ProductDisplay.jsx")
);

export default function Home({ store }) {
  const [displayScroll, setDisplayScroll] = useState(false);
  const [contactScroll, setContactScroll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function showSelectedProduct(id) {
    setSelectedProduct(id !== selectedProduct ? id : null);
  }

  useEffect(() => {
    document.title = "KICKS N SOLES";
  }, []);

  useEffect(() => {
    if (displayScroll) {
      const target = document.querySelector(".product-display");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setDisplayScroll(false);
    }
  }, [displayScroll]);

  useEffect(() => {
    if (contactScroll) {
      const target = document.querySelector("footer");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setContactScroll(false);
    }
  }, [contactScroll]);

  return (
    <div className="body">
      <Header
        setDisplayScroll={setDisplayScroll}
        scrollContact={setContactScroll}
      />
      <div className="product-display">
        <Suspense fallback={<div>Loading products...</div>}>
          {store.map((item) => (
            <ProductDisplay
              key={item.id}
              id={item.id}
              productName={item.productName}
              price={item.price}
              stock={item.stock}
              image={item.image}
              showSelectedProduct={showSelectedProduct}
            />
          ))}
        </Suspense>
        {store
          .filter((item) => item.id === selectedProduct)
          .map((item) => (
            <ProductDetailedView
              key={item.id}
              {...item}
              setSelectedProduct={setSelectedProduct}
            />
          ))}
      </div>
      <Footer />
    </div>
  );
}

function ProductDetailedView({
  productName,
  price,
  stock,
  image,
  setSelectedProduct,
}) {
  const apiUrl = import.meta.env.VITE_API_URL; // Get the API URL

  function cancelExpandedView() {
    setSelectedProduct(null);
  }

  return (
    <>
      <div className={`product-extended-view`}>
        <div className="cancel" onClick={cancelExpandedView}>
          &times;
        </div>
        <div className="image-container-expanded">
          <i className="fa-solid fa-chevron-left"></i>
          <img
            className="product-image-expanded"
            src={`${apiUrl}${image}`}
            alt="Image"
          />
          <i
            className="fa-solid fa-chevron-right"
            style={{ color: "#000000" }}
          ></i>
        </div>
        <h3 className="shoe-name-extended"> {productName} </h3>
        <h4 className="price-extended"> {price + "ksh"} </h4>
        {stock <= 0 ? (
          <h6 className="stock-extended">soldOut</h6>
        ) : (
          <h6 className="stock-extended">{`(${stock} in stock)`}</h6>
        )}
      </div>
    </>
  );
}

ProductDetailedView.propTypes = {
  id: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  stock: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  // selectedProduct: PropTypes.number.isRequired,
};

Home.propTypes = {
  store: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Assuming each product has a unique ID
      productName: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired, // Assuming image is a string URL
    })
  ).isRequired,
};

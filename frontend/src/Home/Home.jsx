import React, { useState, useEffect, Suspense } from "react";
import PropTypes from "prop-types";
import Header from "../Home/Header/Header.jsx";
import Footer from "../Home/Footer/Footer.jsx";

// Lazy load ProductDisplay component
const ProductDisplay = React.lazy(() =>
  import("./ProductDisplay/ProductDisplay.jsx")
);

export default function Home({ store }) {
  const [displayScroll, setDisplayScroll] = useState(false);
  const [contactScroll, setContactScroll] = useState(false);

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
        {/* Suspense is used here to display a fallback while ProductDisplay is loading */}
        <Suspense fallback={<div>Loading products...</div>}>
          {store.map((item) => (
            <ProductDisplay
              key={item.id}
              productName={item.productName}
              price={item.price}
              stock={item.stock}
              image={item.image}
            />
          ))}
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

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

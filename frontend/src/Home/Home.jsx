import { useState, useEffect } from "react";
import Header from "../Home/Header/Header.jsx";
import ProductDisplay from "./ProductDisplay/ProductDisplay.jsx";
import Footer from "../Home/Footer/Footer.jsx";

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
        {store.map((item) => (
          <ProductDisplay
            key={item.id}
            productName={item.productName}
            price={item.price}
            stock={item.stock}
            image={item.image}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

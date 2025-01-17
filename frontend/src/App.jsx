import { useState, useEffect } from "react";
import axios from "axios";

// Importing files
import syntheticLeather from "./assets/addi-synthetic-leather.jpg";
import addiAir from "./assets/addi-air zoom.jpg";
import frankie4 from "./assets/frankie-4-addi-super-cut.jpg";
import LVSkate from "./assets/Louis-vuitton-skate.jpg";
import NikeBlackSport from "./assets/nike-black-sport.jpg";
import PVCSneekers from "./assets/PVC-sneekers.jpg";
import UniversalSneekers from "./assets/universal-sneekers.jpg";

import "./App.css";
import ShoeProductsDisplay from "./ShoeProductsDisplay/ShoeProductsDisplay.jsx";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";

const shoes = [
  {
    id: 1,
    shoeName: "syntheticLeather",
    price: 4500,
    stock: 23,
    image: syntheticLeather,
  },
  {
    id: 2,
    shoeName: "addiAir",
    price: 3500,
    stock: 23,
    image: addiAir,
  },
  {
    id: 3,
    shoeName: "frankie4",
    price: 2000,
    stock: 23,
    image: frankie4,
  },
  {
    id: 4,
    shoeName: "Louis Vuitton Skate",
    price: 5500,
    stock: 23,
    image: LVSkate,
  },
  {
    id: 5,
    shoeName: "Mike Black Sport",
    price: 1400,
    stock: 23,
    image: NikeBlackSport,
  },
  {
    id: 6,
    shoeName: "PVC Sneekers",
    price: 1400,
    stock: 0,
    image: PVCSneekers,
  },
  {
    id: 7,
    shoeName: "Universal Sneekers",
    price: 1400,
    stock: 23,
    image: UniversalSneekers,
  },
  {
    id: 8,
    shoeName: "syntheticLeather",
    price: 4500,
    stock: 23,
    image: syntheticLeather,
  },
  {
    id: 9,
    shoeName: "addiAir",
    price: 3500,
    stock: 0,
    image: addiAir,
  },
  {
    id: 10,
    shoeName: "frankie4",
    price: 2000,
    stock: 23,
    image: frankie4,
  },
  {
    id: 11,
    shoeName: "Louis Vuitton Skate",
    price: 5500,
    stock: 0,
    image: LVSkate,
  },
  {
    id: 12,
    shoeName: "Mike Black Sport",
    price: 1400,
    stock: 23,
    image: NikeBlackSport,
  },
  {
    id: 13,
    shoeName: "PVC Sneekers",
    price: 1400,
    stock: 23,
    image: PVCSneekers,
  },
  {
    id: 14,
    shoeName: "Universal Sneekers",
    price: 1400,
    stock: 0,
    image: UniversalSneekers,
  },
  {
    id: 15,
    shoeName: "syntheticLeather",
    price: 4500,
    stock: 23,
    image: syntheticLeather,
  },
  {
    id: 16,
    shoeName: "addiAir",
    price: 3500,
    stock: 23,
    image: addiAir,
  },
  {
    id: 17,
    shoeName: "frankie4",
    price: 2000,
    stock: 0,
    image: frankie4,
  },
];

const contact = {
  phone: 708089114,
  email: "christelvinmuthomi821@gmail.com",
};

export default function App() {
  const [imageSize, setImageSize] = useState(22);
  const [scroll, setScroll] = useState(false);
  const [contactArea, setContactArea] = useState(false);

  const InitialScreenWidth = window.innerWidth;

  useEffect(() => {
    axios.get("http://localhost:5000/shoes").then((response) => {
      setShoes(response.data);
    });
  }, []);

  useEffect(() => {
    if (scroll) {
      const target = document.querySelector(".display-component");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setScroll(false);
    }

    if (contactArea) {
      const target = document.querySelector("footer");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setContactArea(false);
    }
  }, [scroll]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      // Dynamically calculate image size based on screen width
      const newSize = Math.max(
        10,
        Math.min(30, (screenWidth / InitialScreenWidth) * 22)
      );
      setImageSize(newSize);
    };

    window.addEventListener("resize", handleResize);

    // Initial trigger to set the correct size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [InitialScreenWidth]);

  return (
    <body>
      <Header setScroll={setScroll} setContactArea={setContactArea} />
      <div className="display-component">
        {shoes.map((shoe) => (
          <ShoeProductsDisplay
            key={shoe.id}
            shoeName={shoe.shoeName}
            price={shoe.price}
            stock={shoe.stock}
            image={shoe.image}
            imageSize={imageSize}
            scroll={scroll}
            setScroll={setScroll}
          />
        ))}
      </div>
      <Footer phone={contact.phone} email={contact.email} />
    </body>
  );
}

import logo from "../assets/logo.jpg";

import backgroundImage from "../assets/background-image.jpg";

export default function Header({ setScroll, setContactArea }) {
  function clicked() {
    return console.log("clicked");
  }

  return (
    <>
      <div className="sticky-header" style={{ backgroundColor: "black" }}>
        <img className="sticky-logo" src={logo} alt="logo" />
        <h2>KICKS N SOLES</h2>
        <button className="contact" onClick={() => clicked}>
          CONTACT US
        </button>
      </div>
      <header>
        {/* <img className="background-image" src={backgroundImage} alt="" /> */}

        <img className="full-view-logo" src={logo} alt="logo" />
        <h1 className="slogan"> Your haven for the finest kicks </h1>
        <h2 className="call-to-action">
          Explore our store to take your shoe-game a step higher
        </h2>
        <button className="scroll" onClick={() => setScroll(true)}>
          Click to scroll
        </button>
      </header>
    </>
  );
}

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Navbar = ({ cartItemCount }) => {
  const [color, setColor] = useState(false);

  const changeColor = () => {
    setColor(window.scrollY >= 90);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeColor);
    return () => window.removeEventListener("scroll", changeColor);
  }, []);

  return (
    <div style={headerStyle(color)}>
      <nav style={navbarStyle}>
        <div style={brandTextStyle}>The Lebanese Flame</div>
        <Link href="/cart">
          <div style={cartIconStyle}>
            <AiOutlineShoppingCart size={30} style={{ color: "#ffffff" }} />
            {cartItemCount > 0 && (
              <span style={cartCounterStyle}>{cartItemCount}</span>
            )}
          </div>
        </Link>
      </nav>
    </div>
  );
};

// Inline styles
const headerStyle = (isScrolled) => ({
  position: "fixed",
  height: "80px",
  width: "100%",
  top: 0,
  left: 0,
  zIndex: 10,
  transition: "0.3s ease-in",
  backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.9)" : "transparent",
});

const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "1240px",
  margin: "auto",
  height: "100%",
  padding: "0 1rem",
};

const brandTextStyle = {
  color: "white",
  fontSize: "20px",
  marginRight: "auto",
};

const cartIconStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  color: "white",
  fontSize: "20px",
};

const cartCounterStyle = {
  position: "absolute",
  top: "-5px",
  right: "-10px",
  backgroundColor: "red",
  color: "white",
  borderRadius: "50%",
  padding: "0.2em 0.5em",
  fontSize: "12px",
  fontWeight: "bold",
};

export default Navbar;

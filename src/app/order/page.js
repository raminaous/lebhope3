"use client"; // Ensure this is added

import { useState, useEffect, Suspense } from "react"; // Import Suspense
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../Database/Config";
import styles from "../styles/OrderPage.module.css";
import Image from "next/image";

export default function OrderPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wish"); // Default payment method

  const searchParams = useSearchParams();
  const router = useRouter();

  // Fetch cart and total from search params on mount
  useEffect(() => {
    const cartData = searchParams.get("cart");
    const totalPrice = searchParams.get("total");

    if (cartData && totalPrice) {
      setCart(JSON.parse(cartData)); // Parse the cart data
      setTotal(totalPrice); // Set total price
    } else {
      // Redirect if no cart or total is found
      router.push("/");
    }
  }, [searchParams, router]);

  // Handle order submission
  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      fullName,
      email,
      phone,
      address,
      apartment,
      city,
      total,
      items: cart,
      paymentMethod, // Include payment method in order data
      createdAt: new Date(),
    };

    try {
      // Save the order to Firestore
      await addDoc(collection(db, "orders"), orderData);
      localStorage.removeItem("cart");
      localStorage.setItem("orderDetails", JSON.stringify(orderData));
      router.push("/thank-you");
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
      {/* Add Suspense boundary */}
      <div className={styles.orderPageContainer}>
        <h1 className={styles.orderPageHeader}>Order Summary</h1>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <h3>{item.name}</h3>
              <p>Size: {item.selectedSize}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price * item.quantity}</p>
            </li>
          ))}
        </ul>
        <h2>Total: ${total}</h2>

        <form onSubmit={handleOrder} className={styles.orderForm}>
          <div className={styles.inputField}>
            <label className={styles.label}>Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.label}>Phone Number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="^\+[1-9]\d{1,14}$" // Regex pattern for +CountryCode and phone number
              placeholder="+961123456789"
              title="Please enter a valid phone number starting with a + and country code (e.g., +961123456789)"
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.label}>Address:</label>
            <textarea
              className={styles.textareaField}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.label}>Apartment:</label>
            <input
              type="text"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.label}>City:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputField}>
            <label className={styles.label}>Payment Method:</label>
            <div>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="wish"
                  checked={paymentMethod === "wish"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                />
                Wish App
                <Image
                  src="https://play-lh.googleusercontent.com/xHb69kCRdCQOi5wZoX0zuCV3CwmCxAH-qR35qNWJJ0VpRT7NNnpyakciHkivdyvLxCw=w240-h480-rw" // Adjust the path if needed
                  alt="Wish Money"
                  className={styles.paymentIcon}
                  width={500} // Add CSS styling for the image
                  height={500}
                />
              </label>

              {/* Add more payment methods as needed */}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </Suspense>
  );
}

// app/order/layout.js
import { Suspense } from "react";

const OrderLayout = ({ children }) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default OrderLayout;

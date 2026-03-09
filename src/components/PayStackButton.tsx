import { useEffect } from "react";
import { auth } from "../firebase/firebase";

interface PaystackButtonProps {
  amount: number;
  label: string;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaystackButtonComponent({
  amount,
  label,
}: PaystackButtonProps) {
  const user = auth.currentUser;
  const email = user?.email || "student@email.com";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const payWithPaystack = () => {
    const handler = window.PaystackPop.setup({
      key: "pk_test_f48308d902efa5409886503589cdc7dc12138485",
      email: email,
      amount: amount * 100, // Kobo
      currency: "NGN",
      callback: function (response: any) {
        alert("Payment successful! Ref: " + response.reference);
      },
      onClose: function () {
        console.log("Payment closed");
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={payWithPaystack}
      style={{
        background: "#0a7cff",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
};
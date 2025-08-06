import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalPaymentProps {
  amount: number;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
}

export default function PayPalPayment({ amount, onSuccess, onError }: PayPalPaymentProps) {
  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toFixed(2) } }],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const details = await actions.order.capture();
            // Validar el pago en el backend
            try {
              const res = await fetch("/api/paypal/validate-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: details.id, expectedAmount: amount })
              });
              const result = await res.json();
              if (result.success) {
                onSuccess(details);
              } else {
                onError?.(result.error || "No se pudo validar el pago en PayPal");
              }
            } catch (err) {
              onError?.("Error de red al validar pago PayPal");
            }
          }
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
}

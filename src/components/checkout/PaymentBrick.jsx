import { CardPayment } from "@mercadopago/sdk-react";

export default function PaymentBrick({ amount, payerEmail, onSubmit }) {
  return (
    <CardPayment
      initialization={{ amount, payer: { email: payerEmail } }}
      customization={{
        paymentMethods: { minInstallments: 1, maxInstallments: 12 },
        visual: { hideFormTitle: true },
      }}
      onSubmit={onSubmit}
      onError={(err) => console.error("MP error:", err)}
      onReady={() => {}}
    />
  );
}

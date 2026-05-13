import { Wallet } from "@mercadopago/sdk-react";
import { createPreference } from "../../api/payments";

export default function WalletBrick({ items, payer, onBeforeRedirect }) {
  const handleSubmit = async () => {
    const preferenceId = await createPreference({ items, payer });
    onBeforeRedirect?.(); // limpia carrito antes de salir
    return preferenceId;
  };

  return (
    <Wallet
      initialization={{ redirectMode: "blank" }}
      customization={{
        texts:       { valueProp: "smart_option" },
        visual:      { buttonBackground: "default", borderRadius: "0px" },
      }}
      onSubmit={handleSubmit}
      onError={(err) => console.error("Wallet brick error:", err)}
    />
  );
}


import PaymentGateway from "@/components/payment/payment-gateway";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F8F9] font-body selection:bg-primary/10">
      <PaymentGateway />
    </main>
  );
}

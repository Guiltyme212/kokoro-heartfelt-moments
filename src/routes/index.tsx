import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/kokoro/Header";
import { Hero } from "@/components/kokoro/Hero";
import { Modes } from "@/components/kokoro/Modes";
import { HowItWorks } from "@/components/kokoro/HowItWorks";
import { PetName } from "@/components/kokoro/PetName";
import { MeetTheBear } from "@/components/kokoro/MeetTheBear";
import { MantraStrip } from "@/components/kokoro/MantraStrip";
import { WhyKokoro } from "@/components/kokoro/WhyKokoro";
import { Waitlist } from "@/components/kokoro/Waitlist";
import { Footer } from "@/components/kokoro/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <MeetTheBear />
      <Modes />
      <HowItWorks />
      <PetName />
      <MantraStrip />
      <WhyKokoro />
      <Waitlist />
      <Footer />
    </main>
  );
}

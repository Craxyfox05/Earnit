import HomePage from "@/components/home/HomePage";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileFooter } from "@/components/layout/MobileFooter";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <MobileHeader />
      <div className="flex-1">
        <HomePage />
      </div>
      <MobileFooter />
    </main>
  );
}

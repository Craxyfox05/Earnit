import WalletPage from "@/components/dashboard/WalletPage";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileFooter } from "@/components/layout/MobileFooter";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function WalletRoute() {
  return (
    <AuthWrapper>
      <main className="flex flex-col min-h-screen">
        <MobileHeader />
        <div className="flex-1">
          <WalletPage />
        </div>
        <MobileFooter />
      </main>
    </AuthWrapper>
  );
}

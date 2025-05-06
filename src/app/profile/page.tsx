import ProfilePage from "@/components/auth/ProfilePage";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileFooter } from "@/components/layout/MobileFooter";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function ProfileRoute() {
  return (
    <AuthWrapper>
      <main className="flex flex-col min-h-screen">
        <MobileHeader />
        <div className="flex-1">
          <ProfilePage />
        </div>
        <MobileFooter />
      </main>
    </AuthWrapper>
  );
}

import DashboardWithCompletedTasks from "@/components/dashboard/DashboardWithCompletedTasks";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileFooter } from "@/components/layout/MobileFooter";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function DashboardRoute() {
  return (
    <AuthWrapper>
      <main className="flex flex-col min-h-screen">
        <MobileHeader />
        <div className="flex-1">
          <DashboardWithCompletedTasks />
        </div>
        <MobileFooter />
      </main>
    </AuthWrapper>
  );
}

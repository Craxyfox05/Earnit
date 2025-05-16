import { CompletedTasks } from "@/components/dashboard/CompletedTasks";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileFooter } from "@/components/layout/MobileFooter";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function CompletedTasksPage() {
  return (
    <AuthWrapper>
      <main className="flex flex-col min-h-screen">
        <MobileHeader />
        <div className="flex-1 px-4 py-6">
          <CompletedTasks />
        </div>
        <MobileFooter />
      </main>
    </AuthWrapper>
  );
} 
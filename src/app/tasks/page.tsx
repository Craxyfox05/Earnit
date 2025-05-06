import TasksPage from "@/components/tasks/TasksPage";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileFooter } from "@/components/layout/MobileFooter";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function TasksRoute() {
  return (
    <AuthWrapper>
      <main className="flex flex-col min-h-screen">
        <MobileHeader />
        <div className="flex-1">
          <TasksPage />
        </div>
        <MobileFooter />
      </main>
    </AuthWrapper>
  );
}

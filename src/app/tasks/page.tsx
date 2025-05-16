import { TaskGrid } from "@/components/tasks/TaskGrid";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileFooter } from "@/components/layout/MobileFooter";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function TasksPage() {
  return (
    <AuthWrapper>
      <main className="flex flex-col min-h-screen">
        <MobileHeader />
        <div className="flex-1 max-w-md mx-auto px-4 py-4 w-full">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Available Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Complete tasks to earn money instantly
            </p>
          </div>
          <TaskGrid />
        </div>
        <MobileFooter />
      </main>
    </AuthWrapper>
  );
}

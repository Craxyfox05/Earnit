import { PendingTasksList } from "@/components/admin/PendingTasksList";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminTasksPage() {
  return (
    <AdminLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Task Approval Dashboard</h1>
        <PendingTasksList />
      </div>
    </AdminLayout>
  );
} 
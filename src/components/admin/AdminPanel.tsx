"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  ListTodoIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  XCircleIcon
} from "lucide-react";
import { toast } from "sonner";

// Sample tasks data
const SAMPLE_TASKS = [
  {
    id: "1",
    platform: "youtube",
    title: "Watch and like this video",
    description: "Watch for at least 2 minutes and like the video",
    payout: 5,
    currency: "₹",
    url: "https://youtube.com/watch?v=sample1",
    status: "active",
  },
  {
    id: "2",
    platform: "instagram",
    title: "Follow this profile",
    description: "Follow the profile and like recent post",
    payout: 10,
    currency: "₹",
    url: "https://instagram.com/sample_profile",
    status: "active",
  },
  {
    id: "3",
    platform: "survey",
    title: "Complete short survey",
    description: "Answer 5 questions about shopping habits",
    payout: 15,
    currency: "₹",
    url: "https://surveylink.com/sample",
    status: "active",
  },
];

// Sample users data
const SAMPLE_USERS = [
  {
    id: "1",
    name: "User",
    phone: "+91 9876543210",
    totalEarned: 235,
    tasksCompleted: 12,
    status: "active",
  },
  {
    id: "2",
    name: "Aditya",
    phone: "+91 9876543211",
    totalEarned: 150,
    tasksCompleted: 8,
    status: "active",
  },
  {
    id: "3",
    name: "Priya",
    phone: "+91 9876543212",
    totalEarned: 120,
    tasksCompleted: 6,
    status: "active",
  },
];

// Sample submissions data
const SAMPLE_SUBMISSIONS = [
  {
    id: "1",
    taskId: "1",
    userId: "2",
    userName: "Aditya",
    taskTitle: "Watch and like this video",
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "2",
    taskId: "2",
    userId: "3",
    userName: "Priya",
    taskTitle: "Follow this profile",
    submittedAt: "1 day ago",
    status: "approved",
  },
  {
    id: "3",
    taskId: "3",
    userId: "1",
    userName: "User",
    taskTitle: "Complete short survey",
    submittedAt: "3 days ago",
    status: "approved",
  },
];

export function AdminPanel() {
  const router = useRouter();
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [users] = useState(SAMPLE_USERS);
  const [submissions, setSubmissions] = useState(SAMPLE_SUBMISSIONS);
  const [newTask, setNewTask] = useState({
    platform: "youtube",
    title: "",
    description: "",
    payout: 0,
    url: "",
  });

  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: name === "payout" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title || !newTask.description || !newTask.url || newTask.payout <= 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const taskToAdd = {
      ...newTask,
      id: `${tasks.length + 1}`,
      currency: "₹",
      status: "active",
    };

    setTasks([...tasks, taskToAdd]);
    setNewTask({
      platform: "youtube",
      title: "",
      description: "",
      payout: 0,
      url: "",
    });

    toast.success("Task added successfully!");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully!");
  };

  const handleApproveSubmission = (submissionId: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId ? { ...sub, status: "approved" } : sub
    ));
    toast.success("Submission approved!");
  };

  const handleRejectSubmission = (submissionId: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId ? { ...sub, status: "rejected" } : sub
    ));
    toast.success("Submission rejected!");
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/")}
          className="h-9 w-9"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold primary-gradient bg-clip-text text-transparent">Admin Panel</h1>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="primary-gradient text-white">
              <CardTitle>Add New Task</CardTitle>
              <CardDescription className="text-white/80">
                Create a new task for users to complete
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <select
                      id="platform"
                      name="platform"
                      value={newTask.platform}
                      onChange={(e) => setNewTask({...newTask, platform: e.target.value})}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="survey">Survey</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payout">Payout (₹)</Label>
                    <Input
                      id="payout"
                      name="payout"
                      type="number"
                      min="1"
                      value={newTask.payout || ""}
                      onChange={handleNewTaskChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleNewTaskChange}
                    placeholder="e.g., Watch and like this video"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                    placeholder="e.g., Watch for at least 2 minutes and like the video"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="url"
                    value={newTask.url}
                    onChange={handleNewTaskChange}
                    placeholder="e.g., https://youtube.com/watch?v=sample"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </form>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mt-6 mb-3">Existing Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="soft-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <Badge className="mb-2 capitalize bg-primary/10 text-primary">
                        {task.platform}
                      </Badge>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Payout: </span>
                        <span className="text-success">{task.currency}{task.payout}</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6">
          <h2 className="text-xl font-semibold mb-3">Task Submissions</h2>

          <div className="space-y-4">
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <Card key={submission.id} className="soft-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{submission.taskTitle}</h3>
                          <Badge
                            variant={
                              submission.status === "approved"
                                ? "default"
                                : submission.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                            }
                            className={
                              submission.status === "approved"
                                ? "bg-success/10 text-success"
                                : submission.status === "rejected"
                                  ? "bg-destructive/10"
                                  : "bg-secondary/20"
                            }
                          >
                            {submission.status}
                          </Badge>
                        </div>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Submitted by: </span>
                          {submission.userName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted {submission.submittedAt}
                        </p>
                      </div>

                      {submission.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveSubmission(submission.id)}
                            className="h-8 text-success hover:bg-success/10"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectSubmission(submission.id)}
                            className="h-8 text-destructive hover:bg-destructive/10"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No submissions found
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <h2 className="text-xl font-semibold mb-3">Registered Users</h2>

          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="soft-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        {user.name}
                        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                          {user.status}
                        </Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.phone}
                      </p>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Tasks</p>
                        <p className="font-medium text-primary">{user.tasksCompleted}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Earned</p>
                        <p className="font-medium text-success">₹{user.totalEarned}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

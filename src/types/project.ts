export type ProjectStatus = "Planning" | "Active" | "Completed" | "On Hold";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  category: string;
  progress: number;
  taskCount: number;
  dueDate: string;
  createdAt: string;
};

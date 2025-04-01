
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: string;
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No tasks yet. Add some to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="flex items-start space-x-2 py-2 border-b border-muted last:border-0"
        >
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
          />
          <label
            htmlFor={`task-${task.id}`}
            className={`flex-1 text-sm ${
              task.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.text}
            {task.assignedTo && (
              <span className="text-xs text-muted-foreground block mt-1">
                Assigned to: {task.assignedTo}
              </span>
            )}
          </label>
        </div>
      ))}
    </div>
  );
};

export default TaskList;

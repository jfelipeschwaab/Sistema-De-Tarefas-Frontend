"use client";

import React, { useState } from "react";
import TaskList from "@/app/components/TaskList";
import TaskForm from "@/app/components/TaskForm";
import Modal from "@/app/components/Modal";
import { Task } from "@/types/task";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (task: { nome: string; custo: number; dataLimite: string }) => {
    const newTask = {
      id: String(tasks.length + 1),
      ...task,
      ordem: tasks.length + 1,
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setEditingTask(task);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSubmitEdit = (editedTask: { nome: string; custo: number; dataLimite: string }) => {
    setTasks(
      tasks.map((task) =>
        task.id === editingTask?.id ? { ...task, ...editedTask } : task
      )
    );
    setEditingTask(null);
  };

  const handleReorder = (id: string, direction: "up" | "down") => {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tasks.length) return;

    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(index, 1);
    reorderedTasks.splice(newIndex, 0, movedTask);

    setTasks(reorderedTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto py-8 flex gap-8">
        {/* Lista de Tarefas */}
        <div className="w-1/2 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Lista de Tarefas</h2>
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onReorder={handleReorder}
          />
        </div>

        {/* Formulário de Tarefas */}
        <div className="w-1/2 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            {editingTask ? "Editar Tarefa" : "Adicionar Tarefa"}
          </h2>
          <TaskForm
            initialData={editingTask || undefined}
            onSubmit={editingTask ? handleSubmitEdit : handleAddTask}
          />
        </div>
      </div>

      {/* Modal de Edição */}
      {editingTask && (
        <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)}>
          <TaskForm initialData={editingTask} onSubmit={handleSubmitEdit} />
        </Modal>
      )}
    </div>
  );
};

export default App;

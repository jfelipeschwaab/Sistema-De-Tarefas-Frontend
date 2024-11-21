"use client";

import React, { useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task } from "@/types/task";
import { FiTrash2, FiEdit2, FiChevronUp, FiChevronDown } from "react-icons/fi";

interface TaskListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, onEdit, onDelete, onReorder }) => {
  const moveTask = (dragIndex: number, hoverIndex: number) => {
    const reorderedTasks = [...tasks];
    const [draggedItem] = reorderedTasks.splice(dragIndex, 1);
    reorderedTasks.splice(hoverIndex, 0, draggedItem);

    // Atualizar ordem
    setTasks(
      reorderedTasks.map((task, index) => ({
        ...task,
        ordem: index + 1,
      }))
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ul>
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            index={index}
            task={task}
            moveTask={moveTask}
            onEdit={onEdit}
            onDelete={onDelete}
            onReorder={onReorder}
            tasks={tasks}
          />
        ))}
      </ul>
    </DndProvider>
  );
};

interface TaskItemProps {
  index: number;
  task: Task;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  tasks: Task[];
}

const TaskItem: React.FC<TaskItemProps> = ({
  index,
  task,
  moveTask,
  onEdit,
  onDelete,
  onReorder,
  tasks,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`p-4 rounded mb-2 ${isDragging ? "opacity-50" : "opacity-100"} ${
        task.custo >= 1000 ? "bg-yellow-200" : "bg-gray-700"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold">{task.nome}</p>
          <p>Custo: R${task.custo}</p>
          <p>Data Limite: {task.dataLimite}</p>
        </div>
        <div className="flex space-x-2">
          {/* Ícone de Editar */}
          <button
            onClick={() => onEdit(task.id)}
            className="text-blue-400 hover:text-blue-400 cursor-pointer"
          >
            <FiEdit2 size={20} />
          </button>

          {/* Ícone de Excluir */}
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-400 hover:text-red-400 cursor-pointer"
          >
            <FiTrash2 size={20} />
          </button>

          {/* Ícone de Subir */}
          <button
            onClick={() => onReorder(task.id, "up")}
            disabled={index === 0}
            className={`text-gray-400 ${
              index === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <FiChevronUp size={20} />
          </button>

          {/* Ícone de Descer */}
          <button
            onClick={() => onReorder(task.id, "down")}
            disabled={index === tasks.length - 1}
            className={`text-gray-400 ${
              index === tasks.length - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <FiChevronDown size={20} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskList;

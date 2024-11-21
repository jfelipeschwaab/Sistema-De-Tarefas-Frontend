"use client";

import React, { useState } from "react";

interface TaskFormProps {
  onSubmit: (task: { nome: string; custo: number; dataLimite: string }) => void;
  initialData?: { nome: string; custo: number; dataLimite: string };
  tasks: { nome: string }[]; // Adicionado para verificar duplicidade
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, tasks }) => {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [custo, setCusto] = useState(initialData?.custo || 0);
  const [dataLimite, setDataLimite] = useState(initialData?.dataLimite || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar duplicidade
    if (
      tasks.some(
        (task) =>
          task.nome.toLowerCase() === nome.toLowerCase() &&
          task.nome !== initialData?.nome // Permitir edição sem bloquear
      )
    ) {
      alert("Já existe uma tarefa com este nome.");
      return;
    }

    onSubmit({ nome, custo, dataLimite });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded">
      <div className="mb-4">
        <label className="block text-white">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Custo</label>
        <input
          type="number"
          value={custo}
          onChange={(e) => setCusto(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Data Limite</label>
        <input
          type="date"
          value={dataLimite}
          onChange={(e) => setDataLimite(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        {initialData ? "Salvar Alterações" : "Adicionar Tarefa"}
      </button>
    </form>
  );
};

export default TaskForm;

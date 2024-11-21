"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { FiDollarSign } from "react-icons/fi"; // Ícone de preço

interface TaskFormProps {
  onSubmit: (task: { nome: string; custo: number; dataLimite: string }) => void;
  initialData?: { nome: string; custo: number; dataLimite: string };
  tasks: { nome: string }[];
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, tasks }) => {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [custo, setCusto] = useState(initialData?.custo || 0);
  const [dataLimite, setDataLimite] = useState(initialData?.dataLimite || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      tasks.some(
        (task) =>
          task.nome.toLowerCase() === nome.toLowerCase() &&
          task.nome !== initialData?.nome
      )
    ) {
      Swal.fire({
        title: "Erro",
        text: "Já existe uma tarefa com este nome.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    onSubmit({ nome, custo, dataLimite });
  };

  const formatPrice = (value: string) => {
    // Remover caracteres não numéricos e formatar como moeda
    const numericValue = value.replace(/[^0-9]/g, "");
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(numericValue) / 100);
    return formattedValue;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPrice(e.target.value);
    const numericValue = parseFloat(formattedValue.replace(/[^0-9]/g, "")) / 100;
    setCusto(numericValue);
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
      <div className="mb-4 relative">
        <label className="block text-white">Custo</label>
        <div className="relative">
          <input
            type="text"
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(custo)}
            onChange={handlePriceChange}
            className="w-full p-2 border border-gray-300 rounded text-black pr-8"
            required
          />
          <FiDollarSign className="absolute right-3 top-3 text-gray-500" />
        </div>
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

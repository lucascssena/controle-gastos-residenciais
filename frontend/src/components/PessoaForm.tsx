import { useState } from "react";
import type { FormEvent } from "react";
import { pessoasApi } from "../services/api";

interface PessoaFormProps {
  /** Callback chamado após criar a pessoa com sucesso, para o componente pai recarregar as listas. */
  aoCriar: () => void;
}

/**
 * Formulário de cadastro de uma nova Pessoa.
 * Não faz nenhuma validação de "regra de negócio" aqui (isso é responsabilidade
 * do back-end) — apenas validações simples de formulário (campos preenchidos).
 */
export function PessoaForm({ aoCriar }: PessoaFormProps) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (!nome.trim() || idade === "") {
      setErro("Preencha nome e idade.");
      return;
    }

    setCarregando(true);
    try {
      await pessoasApi.criar({ nome: nome.trim(), idade: Number(idade) });
      // Limpa o formulário após sucesso.
      setNome("");
      setIdade("");
      aoCriar(); // notifica o pai para recarregar a lista de pessoas / balanço
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao cadastrar pessoa.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={aoSubmeter} className="cartao formulario">
      <h3>Cadastrar Pessoa</h3>

      <div className="campo">
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Maria Silva"
        />
      </div>

      <div className="campo">
        <label htmlFor="idade">Idade</label>
        <input
          id="idade"
          type="number"
          min={0}
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Ex: 30"
        />
      </div>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <button type="submit" disabled={carregando}>
        {carregando ? "Salvando..." : "Cadastrar Pessoa"}
      </button>
    </form>
  );
}
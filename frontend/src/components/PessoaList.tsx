import { useState } from "react";
import type { Pessoa } from "../types";
import { pessoasApi } from "../services/api";

interface PessoaListProps {
  pessoas: Pessoa[];
  /** Callback chamado após deletar uma pessoa, para o pai recarregar pessoas/transações/balanço. */
  aoDeletar: () => void;
}

/**
 * Lista as pessoas cadastradas e permite deletá-las.
 * Ao deletar, o back-end remove em cascata todas as transações vinculadas
 * (o front-end não precisa fazer nada além de chamar o DELETE e recarregar os dados).
 */
export function PessoaList({ pessoas, aoDeletar }: PessoaListProps) {
  const [idExcluindo, setIdExcluindo] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function excluir(pessoa: Pessoa) {
    const confirmou = window.confirm(
      `Excluir "${pessoa.nome}"? Todas as transações desta pessoa também serão apagadas.`
    );
    if (!confirmou) return;

    setErro(null);
    setIdExcluindo(pessoa.id);
    try {
      await pessoasApi.deletar(pessoa.id);
      aoDeletar(); // notifica o pai para recarregar as listas
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir pessoa.");
    } finally {
      setIdExcluindo(null);
    }
  }

  return (
    <div className="cartao">
      <h3>Pessoas Cadastradas</h3>
      {erro && <p className="mensagem-erro">{erro}</p>}

      {pessoas.length === 0 ? (
        <p className="texto-vazio">Nenhuma pessoa cadastrada ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((pessoa) => (
              <tr key={pessoa.id}>
                <td>{pessoa.nome}</td>
                <td>
                  {pessoa.idade}
                  {pessoa.idade < 18 && (
                    <span className="etiqueta-menor" title="Menor de idade: só pode ter Despesas">
                      menor
                    </span>
                  )}
                </td>
                <td>
                  <button
                    className="botao-perigo"
                    onClick={() => excluir(pessoa)}
                    disabled={idExcluindo === pessoa.id}
                  >
                    {idExcluindo === pessoa.id ? "Excluindo..." : "Excluir"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
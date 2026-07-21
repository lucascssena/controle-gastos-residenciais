import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Pessoa, TipoTransacao } from "../types";
import { transacoesApi } from "../services/api";

interface TransacaoFormProps {
  pessoas: Pessoa[];
  /** Callback chamado após criar a transação com sucesso. */
  aoCriar: () => void;
}

/**
 * Formulário de cadastro de uma nova Transação.
 *
 * Observação importante sobre a Regra Crítica 2 (menor de idade não pode ter Receita):
 * A validação DEFINITIVA acontece no back-end (TransacoesController). Aqui replicamos
 * a mesma regra apenas como MELHORIA DE EXPERIÊNCIA (UX): desabilitamos a opção
 * "Receita" no <select> assim que uma pessoa menor de idade é escolhida.
 */
export function TransacaoForm({ pessoas, aoCriar }: TransacaoFormProps) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");
  const [pessoaId, setPessoaId] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Encontra a pessoa selecionada para saber se ela é menor de idade.
  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === pessoaId) ?? null,
    [pessoas, pessoaId]
  );
  const pessoaEhMenorDeIdade = pessoaSelecionada
    ? pessoaSelecionada.idade < 18
    : false;

  // Sempre que a pessoa selecionada for menor de idade, força o tipo para "Despesa".
  function selecionarPessoa(novoPessoaId: string) {
    setPessoaId(novoPessoaId);
    const pessoa = pessoas.find((p) => p.id === novoPessoaId);
    if (pessoa && pessoa.idade < 18) {
      setTipo("Despesa");
    }
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (!descricao.trim() || valor === "" || !pessoaId) {
      setErro("Preencha descrição, valor e selecione uma pessoa.");
      return;
    }

    setCarregando(true);
    try {
      // Pode ser rejeitado pelo back-end caso: (1) a PessoaId não exista mais; ou
      // (2) a pessoa seja menor de idade e o tipo escolhido seja "Receita".
      await transacoesApi.criar({
        descricao: descricao.trim(),
        valor: Number(valor),
        tipo,
        pessoaId,
      });

      // Limpa o formulário após sucesso.
      setDescricao("");
      setValor("");
      setTipo("Despesa");
      aoCriar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao cadastrar transação.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={aoSubmeter} className="cartao formulario">
      <h3>Cadastrar Transação</h3>

      <div className="campo">
        <label htmlFor="pessoa">Pessoa</label>
        <select
          id="pessoa"
          value={pessoaId}
          onChange={(e) => selecionarPessoa(e.target.value)}
        >
          <option value="">Selecione...</option>
          {pessoas.map((pessoa) => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome} ({pessoa.idade} anos)
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="descricao">Descrição</label>
        <input
          id="descricao"
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Supermercado"
        />
      </div>

      <div className="campo">
        <label htmlFor="valor">Valor (R$)</label>
        <input
          id="valor"
          type="number"
          min={0.01}
          step={0.01}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ex: 150.90"
        />
      </div>

      <div className="campo">
        <label htmlFor="tipo">Tipo</label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoTransacao)}
        >
          <option value="Despesa">Despesa</option>
          {/* Desabilitada em tempo real quando a pessoa selecionada é menor de idade. */}
          <option value="Receita" disabled={pessoaEhMenorDeIdade}>
            Receita
          </option>
        </select>
        {pessoaEhMenorDeIdade && (
          <small className="dica">
            Pessoa menor de idade: apenas "Despesa" é permitida.
          </small>
        )}
      </div>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <button type="submit" disabled={carregando}>
        {carregando ? "Salvando..." : "Cadastrar Transação"}
      </button>
    </form>
  );
}
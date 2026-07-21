import { useCallback, useEffect, useState } from "react";
import type { Pessoa, Transacao, BalancoGeral } from "./types";
import { pessoasApi, transacoesApi, balancoApi } from "./services/api";
import { PessoaForm } from "./components/PessoaForm";
import { PessoaList } from "./components/PessoaList";
import { TransacaoForm } from "./components/TransacaoForm";
import { TransacaoList } from "./components/TransacaoList";
import { Balanco } from "./components/Balanco";
import "./App.css";

/**
 * Componente raiz da aplicação.
 * Responsabilidades:
 *   - Manter o estado global de Pessoas, Transações e Balanço;
 *   - Buscar esses dados na Web API ao carregar a página;
 *   - Recarregar os três conjuntos de dados sempre que algo mudar
 *     (nova pessoa, pessoa excluída ou nova transação), já que uma
 *     mudança em qualquer um deles pode afetar o balanço geral.
 */
function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [balanco, setBalanco] = useState<BalancoGeral | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  /**
   * Recarrega os três recursos em paralelo.
   * Reutilizado por todas as ações que alteram dados (criar pessoa,
   * excluir pessoa, criar transação).
   */
  const recarregarTudo = useCallback(async () => {
    setErroCarregamento(null);
    try {
      const [pessoasResp, transacoesResp, balancoResp] = await Promise.all([
        pessoasApi.listar(),
        transacoesApi.listar(),
        balancoApi.obter(),
      ]);
      setPessoas(pessoasResp);
      setTransacoes(transacoesResp);
      setBalanco(balancoResp);
    } catch (e) {
      setErroCarregamento(
        e instanceof Error
          ? e.message
          : "Não foi possível carregar os dados da API. Verifique se o back-end está em execução."
      );
    }
  }, []);

  // Carrega os dados assim que o componente é montado (primeira renderização).
  useEffect(() => {
    recarregarTudo();
  }, [recarregarTudo]);

  return (
    <div className="app">
      <header className="cabecalho">
        <h1>🏠 Controle de Gastos Residenciais</h1>
        <p>Cadastre moradores, registre receitas/despesas e acompanhe o balanço da casa.</p>
      </header>

      {erroCarregamento && (
        <div className="cartao mensagem-erro-global">
          <strong>Erro:</strong> {erroCarregamento}
        </div>
      )}

      <main className="grade">
        <section className="coluna">
          <PessoaForm aoCriar={recarregarTudo} />
          <PessoaList pessoas={pessoas} aoDeletar={recarregarTudo} />
        </section>

        <section className="coluna">
          <TransacaoForm pessoas={pessoas} aoCriar={recarregarTudo} />
          <TransacaoList transacoes={transacoes} />
        </section>

        <section className="coluna coluna-larga">
          <Balanco balanco={balanco} />
        </section>
      </main>
    </div>
  );
}

export default App;
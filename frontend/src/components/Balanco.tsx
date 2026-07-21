
import type { BalancoGeral } from "../types";
import { formatarMoeda } from "./TransacaoList";

interface BalancoProps {
  balanco: BalancoGeral | null;
}

/**
 * Exibe a consulta de totais e balanço:
 *  - Uma linha por pessoa com Total de Receitas, Total de Despesas e Saldo Individual;
 *  - Uma linha final de "Total Geral" com os valores consolidados da casa.
 * Todo o cálculo é feito no back-end (BalancoController); aqui só exibimos os dados prontos.
 */
export function Balanco({ balanco }: BalancoProps) {
  if (!balanco) {
    return (
      <div className="cartao">
        <h3>Totais e Balanço</h3>
        <p className="texto-vazio">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="cartao">
      <h3>Totais e Balanço</h3>

      {balanco.pessoas.length === 0 ? (
        <p className="texto-vazio">Nenhuma pessoa cadastrada ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Total Receitas</th>
              <th>Total Despesas</th>
              <th>Saldo Individual</th>
            </tr>
          </thead>
          <tbody>
            {balanco.pessoas.map((p) => (
              <tr key={p.pessoaId}>
                <td>{p.nome}</td>
                <td className="valor-positivo">{formatarMoeda(p.totalReceitas)}</td>
                <td className="valor-negativo">{formatarMoeda(p.totalDespesas)}</td>
                <td className={p.saldo >= 0 ? "valor-positivo" : "valor-negativo"}>
                  {formatarMoeda(p.saldo)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="linha-total-geral">
              <td>Total Geral</td>
              <td className="valor-positivo">
                {formatarMoeda(balanco.totalGeralReceitas)}
              </td>
              <td className="valor-negativo">
                {formatarMoeda(balanco.totalGeralDespesas)}
              </td>
              <td
                className={
                  balanco.saldoLiquidoGeral >= 0 ? "valor-positivo" : "valor-negativo"
                }
              >
                {formatarMoeda(balanco.saldoLiquidoGeral)}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
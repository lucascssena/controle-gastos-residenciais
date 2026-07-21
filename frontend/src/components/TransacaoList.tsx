
import type { Transacao } from "../types";

interface TransacaoListProps {
  transacoes: Transacao[];
}

/** Formata um número como moeda brasileira (R$). */
function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Lista todas as transações cadastradas (somente leitura — não há edição/deleção).
 */
export function TransacaoList({ transacoes }: TransacaoListProps) {
  return (
    <div className="cartao">
      <h3>Transações</h3>

      {transacoes.length === 0 ? (
        <p className="texto-vazio">Nenhuma transação cadastrada ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Pessoa</th>
              <th>Tipo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t) => (
              <tr key={t.id}>
                <td>{t.descricao}</td>
                <td>{t.nomePessoa}</td>
                <td>
                  <span
                    className={
                      t.tipo === "Receita" ? "etiqueta-receita" : "etiqueta-despesa"
                    }
                  >
                    {t.tipo}
                  </span>
                </td>
                <td>{formatarMoeda(t.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export { formatarMoeda };
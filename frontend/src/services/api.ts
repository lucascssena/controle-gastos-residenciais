import type {
  Pessoa,
  CriarPessoaPayload,
  Transacao,
  CriarTransacaoPayload,
  BalancoGeral,
} from "../types";
/**
 * URL base da Web API .NET.
 * ⚠️ Ajuste a porta conforme a que aparece no terminal do back-end
 * (linha "Now listening on: http://localhost:XXXX").
 */
const API_BASE_URL = "http://localhost:5049/api";

/**
 * Função auxiliar central para chamadas HTTP.
 * Centraliza montagem da URL, serialização do corpo (JSON) e tratamento de erros.
 */
async function requisitar<TResposta>(
  caminho: string,
  opcoes?: RequestInit
): Promise<TResposta> {
  const resposta = await fetch(`${API_BASE_URL}${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  if (!resposta.ok) {
    // O back-end pode retornar texto simples (BadRequest("mensagem"))
    // ou um objeto JSON (ProblemDetails). Tentamos extrair a mensagem mais útil.
    const textoErro = await resposta.text();
    let mensagem = textoErro;
    try {
      const json = JSON.parse(textoErro);
      mensagem = json.detail || json.title || textoErro;
    } catch {
      // não era JSON, mantém o texto puro
    }
    throw new Error(mensagem || `Erro ${resposta.status} ao chamar a API.`);
  }

  // Respostas 204 (No Content) não têm corpo para parsear.
  if (resposta.status === 204) {
    return undefined as unknown as TResposta;
  }

  return (await resposta.json()) as TResposta;
}

// ---------------------------------------------------------------------------
// Pessoas
// ---------------------------------------------------------------------------

export const pessoasApi = {
  /** GET /api/pessoas — lista todas as pessoas cadastradas. */
  listar: () => requisitar<Pessoa[]>("/pessoas"),

  /** POST /api/pessoas — cria uma nova pessoa. */
  criar: (payload: CriarPessoaPayload) =>
    requisitar<Pessoa>("/pessoas", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * DELETE /api/pessoas/{id} — remove a pessoa.
   * No back-end, isso também apaga em cascata todas as transações dela.
   */
  deletar: (id: string) =>
    requisitar<void>(`/pessoas/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Transações
// ---------------------------------------------------------------------------

export const transacoesApi = {
  /** GET /api/transacoes — lista todas as transações cadastradas. */
  listar: () => requisitar<Transacao[]>("/transacoes"),

  /**
   * POST /api/transacoes — cria uma nova transação.
   * O back-end pode rejeitar (Promise rejeita) se a pessoa não existir
   * ou se ela for menor de idade tentando cadastrar Receita.
   */
  criar: (payload: CriarTransacaoPayload) =>
    requisitar<Transacao>("/transacoes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ---------------------------------------------------------------------------
// Balanço / Totais
// ---------------------------------------------------------------------------

export const balancoApi = {
  /** GET /api/balanco — retorna o balanço individual de cada pessoa + o total geral da casa. */
  obter: () => requisitar<BalancoGeral>("/balanco"),
};
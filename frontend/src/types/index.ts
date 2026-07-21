export type TipoTransacao = "Despesa" | "Receita";

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface CriarPessoaPayload {
  nome: string;
  idade: number;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
  nomePessoa: string;
}

export interface CriarTransacaoPayload {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

export interface BalancoPessoa {
  pessoaId: string;
  nome: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface BalancoGeral {
  pessoas: BalancoPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquidoGeral: number;
}
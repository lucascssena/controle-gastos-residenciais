namespace ControleGastos.Api.DTOs
{
    /// <summary>
    /// DTO que representa o balanço financeiro INDIVIDUAL de uma pessoa.
    /// </summary>
    public class BalancoPessoaDto
    {
        public Guid PessoaId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }

        /// <summary>
        /// Saldo individual = Total de Receitas - Total de Despesas.
        /// </summary>
        public decimal Saldo => TotalReceitas - TotalDespesas;
    }

    /// <summary>
    /// DTO "raiz" retornado pelo endpoint de balanço geral.
    /// Contém a lista de balanços individuais + os totais consolidados da casa.
    /// </summary>
    public class BalancoGeralDto
    {
        public List<BalancoPessoaDto> Pessoas { get; set; } = new();

        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }

        /// <summary>
        /// Saldo Líquido Geral da casa = soma de todas as receitas - soma de todas as despesas.
        /// </summary>
        public decimal SaldoLiquidoGeral => TotalGeralReceitas - TotalGeralDespesas;
    }
}
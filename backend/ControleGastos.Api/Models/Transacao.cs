namespace ControleGastos.Api.Models
{
    /// <summary>
    /// Entidade que representa uma transação financeira (Receita ou Despesa)
    /// vinculada a uma Pessoa.
    /// </summary>
    public class Transacao
    {
        public Guid Id { get; set; }

        public string Descricao { get; set; } = string.Empty;

        public decimal Valor { get; set; }

        public TipoTransacao Tipo { get; set; }

        /// <summary>
        /// Chave estrangeira (FK) que vincula a transação à Pessoa dona dela.
        /// A existência prévia dessa Pessoa é validada no TransacoesController.
        /// </summary>
        public Guid PessoaId { get; set; }

        public Pessoa? Pessoa { get; set; }
    }
}
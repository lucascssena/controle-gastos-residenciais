namespace ControleGastos.Api.Models
{
    /// <summary>
    /// Entidade que representa uma pessoa (morador) cadastrada no sistema.
    /// </summary>
    public class Pessoa
    {
        /// <summary>
        /// Identificador único gerado automaticamente pelo servidor (nunca informado pelo cliente).
        /// </summary>
        public Guid Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public int Idade { get; set; }

        /// <summary>
        /// Propriedade de navegação para o EF Core.
        /// A exclusão em cascata (Pessoa -> Transacoes) é configurada no AppDbContext.
        /// </summary>
        public List<Transacao> Transacoes { get; set; } = new();

        /// <summary>
        /// Regra de negócio auxiliar: define se a pessoa é menor de idade.
        /// </summary>
        public bool EhMenorDeIdade => Idade < 18;
    }
}
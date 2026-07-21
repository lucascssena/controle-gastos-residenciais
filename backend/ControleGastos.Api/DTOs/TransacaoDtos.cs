using ControleGastos.Api.Models;

namespace ControleGastos.Api.DTOs
{
    /// <summary>
    /// DTO usado para RECEBER os dados de criação de uma Transação.
    /// O PessoaId é obrigatório e será validado no Controller
    /// (deve existir previamente no banco).
    /// </summary>
    public class CriarTransacaoDto
    {
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public Guid PessoaId { get; set; }
    }

    /// <summary>
    /// DTO usado para RETORNAR os dados de uma Transação ao cliente.
    /// Inclui o nome da pessoa (NomePessoa) apenas para facilitar a exibição
    /// no front-end.
    /// </summary>
    public class TransacaoDto
    {
        public Guid Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public Guid PessoaId { get; set; }
        public string NomePessoa { get; set; } = string.Empty;
    }
}
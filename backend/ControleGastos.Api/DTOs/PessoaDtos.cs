namespace ControleGastos.Api.DTOs
{
    /// <summary>
    /// DTO usado para RECEBER os dados de criação de uma Pessoa.
    /// Não existe campo "Id" aqui: ele é sempre gerado no servidor
    /// (Guid.NewGuid()), nunca informado pelo cliente.
    /// </summary>
    public class CriarPessoaDto
    {
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
    }

    /// <summary>
    /// DTO usado para RETORNAR os dados de uma Pessoa ao cliente.
    /// Separar o DTO de saída da entidade de banco (Pessoa) evita expor
    /// detalhes internos do EF Core em endpoints que não precisam disso.
    /// </summary>
    public class PessoaDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
    }
}
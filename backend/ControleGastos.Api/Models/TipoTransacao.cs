namespace ControleGastos.Api.Models
{
    /// <summary>
    /// Representa os dois únicos tipos de transação aceitos pelo sistema.
    /// Usar um Enum (em vez de string livre) garante que o valor gravado no banco
    /// seja sempre consistente e evita erros de digitação como "despesa"/"Despesa"/"DESPESA".
    /// </summary>
    public enum TipoTransacao
    {
        Despesa = 0,
        Receita = 1
    }
}
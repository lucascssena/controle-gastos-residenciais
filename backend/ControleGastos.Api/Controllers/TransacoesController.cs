using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    /// <summary>
    /// Controller responsável pela criação e listagem de Transações financeiras.
    /// Não há endpoints de edição (PUT) nem de deleção (DELETE) individual.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")] // rota base: /api/transacoes
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/transacoes — lista todas as transações, já com o nome da pessoa vinculada.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<TransacaoDto>>> Listar()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa) // join com Pessoa para trazer o Nome
                .OrderByDescending(t => t.Id)
                .Select(t => new TransacaoDto
                {
                    Id = t.Id,
                    Descricao = t.Descricao,
                    Valor = t.Valor,
                    Tipo = t.Tipo,
                    PessoaId = t.PessoaId,
                    NomePessoa = t.Pessoa!.Nome
                })
                .ToListAsync();

            return Ok(transacoes);
        }

        /// <summary>
        /// POST /api/transacoes — cria uma nova transação (Receita ou Despesa).
        ///
        /// Ordem de validações aplicadas ANTES de qualquer gravação no banco:
        ///   1) Campos básicos (descrição, valor);
        ///   2) REGRA CRÍTICA 1 — a PessoaId informada precisa existir previamente;
        ///   3) REGRA CRÍTICA 2 — se a pessoa for menor de 18 anos, bloqueia "Receita".
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<TransacaoDto>> Criar([FromBody] CriarTransacaoDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Descricao))
            {
                return BadRequest("A descrição da transação é obrigatória.");
            }

            if (dto.Valor <= 0)
            {
                return BadRequest("O valor da transação deve ser maior que zero.");
            }

            // --- REGRA CRÍTICA 1: a pessoa vinculada precisa existir previamente ---
            var pessoa = await _context.Pessoas.FirstOrDefaultAsync(p => p.Id == dto.PessoaId);

            if (pessoa is null)
            {
                return NotFound(
                    $"Não é possível cadastrar a transação: a Pessoa com Id '{dto.PessoaId}' não existe."
                );
            }

            // --- REGRA CRÍTICA 2: menor de idade não pode cadastrar Receita ---
            if (pessoa.EhMenorDeIdade && dto.Tipo == TipoTransacao.Receita)
            {
                return BadRequest(
                    $"'{pessoa.Nome}' é menor de idade ({pessoa.Idade} anos) e, portanto, " +
                    "só pode ter transações do tipo 'Despesa'. Cadastro de 'Receita' bloqueado."
                );
            }

            var transacao = new Transacao
            {
                Id = Guid.NewGuid(),
                Descricao = dto.Descricao.Trim(),
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                PessoaId = dto.PessoaId
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            var resultado = new TransacaoDto
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                PessoaId = transacao.PessoaId,
                NomePessoa = pessoa.Nome
            };

            return CreatedAtAction(nameof(Listar), new { id = resultado.Id }, resultado);
        }
    }
}
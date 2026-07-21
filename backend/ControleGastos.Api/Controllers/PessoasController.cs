using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo CRUD (parcial: Criar, Listar, Deletar) de Pessoas.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")] // rota base: /api/pessoas
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/pessoas — lista todas as pessoas cadastradas.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<PessoaDto>>> Listar()
        {
            var pessoas = await _context.Pessoas
                .OrderBy(p => p.Nome)
                .Select(p => new PessoaDto
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Idade = p.Idade
                })
                .ToListAsync();

            return Ok(pessoas);
        }

        /// <summary>
        /// POST /api/pessoas — cria uma nova pessoa.
        /// O Id é sempre gerado no servidor (Guid.NewGuid()), nunca recebido do cliente.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PessoaDto>> Criar([FromBody] CriarPessoaDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
            {
                return BadRequest("O nome da pessoa é obrigatório.");
            }

            if (dto.Idade < 0)
            {
                return BadRequest("A idade não pode ser negativa.");
            }

            var pessoa = new Pessoa
            {
                Id = Guid.NewGuid(), // <- geração automática do identificador
                Nome = dto.Nome.Trim(),
                Idade = dto.Idade
            };

            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync(); // <- persiste no arquivo SQLite

            var resultado = new PessoaDto
            {
                Id = pessoa.Id,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade
            };

            return CreatedAtAction(nameof(Listar), new { id = resultado.Id }, resultado);
        }

        /// <summary>
        /// DELETE /api/pessoas/{id} — remove uma pessoa do sistema.
        ///
        /// *** REGRA CRÍTICA: Deleção em Cascata ***
        /// Basta remover a entidade "Pessoa" e chamar SaveChangesAsync().
        /// Como o relacionamento foi configurado no AppDbContext com
        /// .OnDelete(DeleteBehavior.Cascade), o EF Core apaga automaticamente
        /// TODAS as transações vinculadas a essa pessoa.
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Deletar(Guid id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);

            if (pessoa is null)
            {
                return NotFound($"Pessoa com Id '{id}' não foi encontrada.");
            }

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return NoContent(); // 204: sucesso sem corpo de resposta
        }
    }
}
using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    /// <summary>
    /// Controller responsável por consolidar os totais financeiros de cada pessoa
    /// e o Total Geral da casa.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")] // rota base: /api/balanco
    public class BalancoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BalancoController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/balanco — retorna o balanço individual de cada pessoa
        /// (Total de Receitas, Total de Despesas, Saldo Individual) e, ao final,
        /// os totais consolidados de toda a casa.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<BalancoGeralDto>> ObterBalanco()
        {
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .OrderBy(p => p.Nome)
                .ToListAsync();

            var balancoPessoas = pessoas.Select(p => new BalancoPessoaDto
            {
                PessoaId = p.Id,
                Nome = p.Nome,
                Idade = p.Idade,
                TotalReceitas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor),
                TotalDespesas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor)
            }).ToList();

            var resultado = new BalancoGeralDto
            {
                Pessoas = balancoPessoas,
                TotalGeralReceitas = balancoPessoas.Sum(b => b.TotalReceitas),
                TotalGeralDespesas = balancoPessoas.Sum(b => b.TotalDespesas)
            };

            return Ok(resultado);
        }
    }
}
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data
{
    /// <summary>
    /// Contexto do Entity Framework Core responsável por mapear as entidades
    /// (Pessoa, Transacao) para as tabelas do banco SQLite e gerenciar a conexão.
    /// O SQLite grava tudo em um único arquivo físico (controle_gastos.db),
    /// garantindo que os dados persistam mesmo depois de fechar a aplicação.
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Pessoa> Pessoas => Set<Pessoa>();

        public DbSet<Transacao> Transacoes => Set<Transacao>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- Configuração da entidade Pessoa ---
            modelBuilder.Entity<Pessoa>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Nome).IsRequired();
                entity.Property(p => p.Idade).IsRequired();
            });

            // --- Configuração da entidade Transacao ---
            modelBuilder.Entity<Transacao>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Descricao).IsRequired();

                // Guarda o Enum como texto ("Despesa"/"Receita") no banco,
                // deixando o conteúdo do arquivo .db legível.
                entity.Property(t => t.Tipo)
                      .HasConversion<string>()
                      .IsRequired();

                // Define precisão explícita para evitar arredondamentos incorretos.
                entity.Property(t => t.Valor).HasColumnType("decimal(18,2)");

                // *** REGRA CRÍTICA: Deleção em Cascata ***
                // Ao remover uma Pessoa, o EF Core remove automaticamente
                // todas as Transacoes cujo PessoaId aponte para ela.
                entity.HasOne(t => t.Pessoa)
                      .WithMany(p => p.Transacoes)
                      .HasForeignKey(t => t.PessoaId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
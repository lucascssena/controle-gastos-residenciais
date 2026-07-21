using ControleGastos.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// EF Core + SQLite: cria/reutiliza o arquivo controle_gastos.db (persistência em disco)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=controle_gastos.db"));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Serializa Enums como texto ("Despesa"/"Receita") em vez de números.
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS: libera o front-end React para consumir esta API
const string CorsPolicyFrontend = "PermitirFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyFrontend, policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Garante que o banco e as tabelas existam ao iniciar a API
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicyFrontend);
app.UseAuthorization();
app.MapControllers();

app.Run();

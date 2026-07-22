# Controle de Gastos Residenciais

Sistema full stack para controle de receitas e despesas de uma residência,
com cadastro de pessoas, cadastro de transações e consulta de balanço.

## Tecnologias

- **Back-end**: .NET 8 Web API + Entity Framework Core + SQLite
- **Front-end**: React + TypeScript + Vite

## Como executar o back-end (.NET)

```bash
cd backend/ControleGastos.Api
dotnet restore
dotnet run
```

A API sobe por padrão em `http://localhost:5049`. O Swagger fica disponível em `http://localhost:5049/swagger`.

## Como executar o front-end (React + TypeScript + Vite)

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre por padrão em `http://localhost:5173` (a porta pode variar).

## Regras de negócio implementadas

1. **Deleção em cascata**: ao excluir uma pessoa, todas as transações vinculadas a ela são apagadas automaticamente.
2. **Pessoa deve existir**: ao criar uma transação, a API valida que o `PessoaId` informado existe previamente.
3. **Menor de idade não pode ter Receita**: se a pessoa vinculada tiver menos de 18 anos, apenas transações do tipo `Despesa` são permitidas.
4. **Balanço**: retorna, para cada pessoa, total de receitas, total de despesas e saldo individual, além do Total Geral da casa.
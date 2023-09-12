## Descrição

Ferramenta para automatização de busca de commits por data e intervalo de horário, para facilitar o processo de apontamentos no timesheet.
O script é feito mediante consulta à API do GitHub.

## Pré-requisitos

- NodeJS;
- Token de acesso pessoal válido do GitHub.

## Como usar

Para rodar o projeto, basta clonar o repositório na sua máquina e rodar o comando:

```bash
$ npx timesheet --key="seu token de acesso aqui"
```

Após rodar o comando, serão promptados os seguintes requisitos no seu terminal:

- O nome de usuário do GitHub do dono do repositório que você quer buscar os commits;
- O seu nome de usuário do GitHub;
- O repositório que você quer buscar os commits;
- A branch que você quer buscar os commits;
- O horário de começo do intervalo de início dos commits;
- O horário final do intervalo dos commits.

Preenchendo todos os requisitos de forma válida, será gerado um arquivo "output.txt" na pasta raiz da aplicação
contendo os commits que pertencem ao intervalo de horário especificado.

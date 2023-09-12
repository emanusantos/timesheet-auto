## Descrição

Ferramenta para automatização de busca de commits por data e intervalo de horário, para facilitar o processo de apontamentos no timesheet.
O script é feito mediante consulta à API do GitHub.

## Pré-requisitos

- NodeJS;
- Token de acesso pessoal válido do GitHub.

## Como usar

Para rodar o script, basta rodar o comando:

```bash
$ npx timesheet-auto --key="seu token de acesso aqui"
```

Após rodar o comando, serão promptados os seguintes requisitos no seu terminal:

- O nome de usuário do GitHub do dono do repositório que você quer buscar os commits;
- O seu nome de usuário do GitHub;
- O repositório que você quer buscar os commits;
- A branch que você quer buscar os commits;
- A data dos commits;
- O horário de começo do intervalo de início dos commits (opcional);
- O horário final do intervalo dos commits (opcional).

Preenchendo todos os requisitos de forma válida, será gerado um arquivo "output.txt" na pasta raiz de onde o comando foi executado,
contendo os commits que pertencem à data e horário especificado.

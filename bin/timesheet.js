#! /usr/bin/env node

const fs = require("fs");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let ghApiKey;

let owner = "lubysoftware";
let repo;
let ghUsername = "emanusantos";

let day;
let month;

let sinceHours;
let sinceMinutes;

let untilHours;
let untilMinutes;

let branch;

const headers = {
  "Content-Type": "application/json",
  "User-Agent": ghUsername,
  Authorization: `Bearer ${ghApiKey}`,
};

const fetchParams = {
  method: "GET",
  headers,
};

function verifyGHKey() {
  const args = process.argv;

  if (args.length < 3) throw new Error("API key do GitHub não informada");

  if (!args[2].startsWith("--key"))
    throw new Error(`Argumento inválido: ${args[2]}`);

  const providedKey = args[2].split("=")[1];

  if (!providedKey) throw new Error("API key do GitHub não informada");

  ghApiKey = providedKey;
}

function getISOFormattedDate({
  day,
  month = new Date().getMonth + 1,
  hours,
  minutes,
}) {
  const date = new Date();

  date.setDate(day);
  date.setMonth(month);
  date.setHours(hours, minutes, 0, 0);

  return date.toISOString();
}

function promptOwner() {
  return new Promise((resolve) => {
    readline.question(
      "Informe o username do dono do repositório (ex: lubysoftware): ",
      (username) => {
        if (!username)
          throw new Error(
            "Username do dono do repositório não pode estar vazio"
          );

        owner = username;

        resolve();
      }
    );
  });
}

function promptUsername() {
  return new Promise((resolve) => {
    readline.question("Informe seu username do GitHub: ", (username) => {
      if (!username)
        throw new Error("Nome do usuário do GitHub não pode estar vazio");

      ghUsername = username;

      resolve();
    });
  });
}

function promptRepo() {
  return new Promise((resolve) => {
    readline.question(
      "Informe o nome do repositório exatamente como está na url do GitHub: ",
      (repository) => {
        if (!repository)
          throw new Error("Nome do repositório não pode estar vazio");

        repo = repository;

        resolve();
      }
    );
  });
}

function promptBranch() {
  return new Promise((resolve) => {
    readline.question(
      "Informe o nome da branch que você quer retirar os commits (ex: main): ",
      (promptBranch) => {
        if (!promptBranch)
          throw new Error("Nome da branch não pode estar vazio");

        branch = promptBranch;

        resolve();
      }
    );
  });
}

function promptDate() {
  return new Promise((resolve) => {
    readline.question(
      "Informe a data dos commits (formato DD/MM): ",
      (date) => {
        if (!date || !date.split("/")[0] || !date.split("/")[1])
          throw new Error("Data não informada ou inválida");

        const [inputDay, inputMonth] = date.split("/");

        const numericInputDay = Number(inputDay);
        const numericInputMonth = Number(inputMonth);

        if (isNaN(numericInputDay) || isNaN(numericInputMonth))
          throw new Error("A data informada é inválida");

        day = numericInputDay;
        month = numericInputMonth - 1;

        resolve();
      }
    );
  });
}

function promptSinceTime() {
  return new Promise((resolve) => {
    readline.question(
      "Informe o horário do começo dos commits (formato HH:MM): ",
      (time) => {
        if (!time || !time.split(":")[0] || !time.split(":")[1])
          throw new Error("Horário não informado ou inválido");

        const [inputHour, inputMinutes] = time.split(":");

        const numericInputHour = Number(inputHour);
        const numericInputMinutes = Number(inputMinutes);

        if (isNaN(numericInputHour) || isNaN(numericInputMinutes))
          throw new Error("O horário informado é inválido");

        sinceHours = numericInputHour;
        sinceMinutes = numericInputMinutes;

        resolve();
      }
    );
  });
}

function promptUntilTime() {
  return new Promise((resolve) => {
    readline.question(
      "Informe o horário de término dos commits (formato HH:MM): ",
      (time) => {
        if (!time || !time.split(":")[0] || !time.split(":")[1])
          throw new Error("Horário não informado ou inválido");

        const [inputHour, inputMinutes] = time.split(":");

        const numericInputHour = Number(inputHour);
        const numericInputMinutes = Number(inputMinutes);

        if (isNaN(numericInputHour) || isNaN(numericInputMinutes))
          throw new Error("O horário informado é inválido");

        untilHours = numericInputHour;
        untilMinutes = numericInputMinutes;

        resolve();
      }
    );
  });
}

async function setupInputInfo() {
  await promptOwner();
  await promptUsername();
  await promptRepo();
  await promptBranch();
  await promptDate();
  await promptSinceTime();
  await promptUntilTime();

  readline.close();
}

async function grabCommits() {
  const since = getISOFormattedDate({
    day,
    month,
    hours: sinceHours,
    minutes: sinceMinutes,
  });

  const until = getISOFormattedDate({
    day,
    month,
    hours: untilHours,
    minutes: untilMinutes,
  });

  const url = `https://api.github.com/repos/${owner}/${repo}/commits?author=${ghUsername}&sha=${branch}&since=${since}&until=${until}`;

  const response = await fetch(url, fetchParams);

  if (!response.ok) {
    const err = await response.text();

    throw new Error(err);
  }

  const commits = await response.json();

  await new Promise((res) => {
    fs.unlink("output.txt", res);
  });

  const stream = fs.createWriteStream("output.txt");

  stream.once("open", () => {
    commits.forEach((commit) => {
      stream.write(`- ${commit.commit.message}\n`);
    });

    stream.write("\n\ncommits:\n");

    commits.forEach((commit) => {
      stream.write(`${commit.html_url};\n`);
    });

    stream.end();
  });
}

async function execute() {
  try {
    verifyGHKey();
    await setupInputInfo();
    await grabCommits();

    console.log("Relatório gerado com sucesso no arquivo output.txt");
  } catch (error) {
    readline.close();
    console.log(error);
  }
}

execute();

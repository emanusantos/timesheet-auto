const fs = require("fs");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ghApiKey = process.env.GITHUB_API_KEY;

let owner;
let repo;
let ghUsername;

const day = 4;
const sinceHours = 7;
const sinceMinutes = 50;
const since = getISOFormattedDate({
  day: 4,
  hours: sinceHours,
  minutes: sinceMinutes,
});

const untilHours = 13;
const untilMinutes = 30;
const until = getISOFormattedDate({
  day: 4,
  hours: untilHours,
  minutes: untilMinutes,
});

const branch = "develop";

const url = `https://api.github.com/repos/${owner}/${repo}/commits?author=${ghUsername}&sha=${branch}&since=${since}&until=${until}`;

const headers = {
  "Content-Type": "application/json",
  "User-Agent": ghUsername,
  Authorization: `Bearer ${ghApiKey}`,
};

const fetchParams = {
  method: "GET",
  headers,
};

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

async function setupInputInfo() {
  await promptOwner();
  await promptRepo();
  await promptUsername();

  readline.close();
}

async function grabCommits() {
  const response = await fetch(url, fetchParams);

  if (!response.ok) {
    const err = await response.text();

    throw new Error(err);
  }

  const commits = await response.json();

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

function getISOFormattedDate({
  day,
  month = new Date().getMonth + 1,
  year = 2023,
  hours,
  minutes,
}) {
  const date = new Date();

  date.setDate(day);
  date.setHours(hours, minutes, 0, 0);

  return date.toISOString();
}

async function execute() {
  try {
    await setupInputInfo();
    // await grabCommits();
  } catch (error) {
    console.log("Erro:", error);
  }
}

execute();

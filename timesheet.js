const fs = require("fs");

const ghApiKey = process.env.GITHUB_API_KEY;

const owner = "lubysoftware";
const repo = "Conciliacao.admin";
const ghUsername = "emanusantos";

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

async function execute() {
  try {
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
  } catch (error) {
    console.log({ error });
  }
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

execute();

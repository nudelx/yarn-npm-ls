#!/usr/bin/env node
const path = require("path");
const chalk = require("chalk").default;
const exec = require("child_process").execSync;
const readline = require("readline");
const fs = require("fs");
readline.emitKeypressEvents(process.stdin);

let packageJsonCache = null;
let scriptsCache = null;
let searchIndex = null;

const ROOT_PATH = process.env.ROOT_PATH || path.resolve(process.cwd());

const loadPackageJson = () => {
  if (packageJsonCache) return packageJsonCache;

  try {
    packageJsonCache = require(`${ROOT_PATH}/package.json`);
    scriptsCache = packageJsonCache.scripts || {};
    searchIndex = Object.entries(scriptsCache).map(([key, value]) => ({
      key,
      value,
      searchText: `${key} ${value}`.toLowerCase(),
    }));
    return packageJsonCache;
  } catch (error) {
    console.log(chalk.red("❌ Error: package.json not found or invalid"));
    process.exit(1);
  }
};

const packageJson = loadPackageJson();

let selected = 0;
let searchQuery = "";
let filteredScripts = [];
const MAX = Object.keys(scriptsCache).length;
const select_icon = "👉";

const colors = {
  blue: chalk.blueBright,
  yellow: chalk.yellow,
  green: chalk.greenBright,
  gray: chalk.gray,
  red: chalk.red,
  cyan: chalk.cyan,
};

const options = {
  down: function (x, max) {
    return (x + 1) % max;
  },
  up: function (x, max) {
    return x - 1 >= 0 ? (x - 1) % max : max - 1;
  },
  escape: function () {
    console.log(colors.yellow("\n👋 Goodbye!"));
    process.exit();
  },
  "?": function () {
    showHelp();
    return selected;
  },
  "/": function () {
    searchQuery = "";
    showSearchPrompt();
    return selected;
  },
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clear = function () {
  process.stdout.write("\x1Bc");
};

const showHelp = function () {
  clear();
  console.log(colors.blue("📋 Available Commands:"));
  console.log(colors.yellow("↑/↓") + " - Navigate through scripts");
  console.log(colors.yellow("Enter") + " - Run selected script");
  console.log(colors.yellow("/") + " - Search scripts");
  console.log(colors.yellow("?") + " - Show this help");
  console.log(colors.yellow("Esc") + " - Exit\n");
  console.log(colors.blue("Press any key to continue..."));
};

const performSearch = (query) => {
  if (!query || query.trim() === "") {
    filteredScripts = Object.keys(scriptsCache);
    return;
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  console.log(colors.gray(`Searching for terms: ${searchTerms.join(", ")}`));

  filteredScripts = Object.keys(scriptsCache).filter((key) => {
    const script = scriptsCache[key].toLowerCase();
    const matches = searchTerms.every(
      (term) => key.toLowerCase().includes(term) || script.includes(term)
    );
    if (matches) {
      console.log(colors.gray(`Found match: ${key}`));
    }
    return matches;
  });

  console.log(colors.gray(`Found ${filteredScripts.length} matches`));
};

const showSearchPrompt = function () {
  rl.question(colors.blue("🔍 Search scripts: "), (query) => {
    console.log(colors.gray(`\nSearch query: "${query}"`));
    searchQuery = query;
    performSearch(query);
    selected = 0;
    clear();
    listScripts();
    ask();
  });
};

const run = function (cmd) {
  if (!cmd) {
    console.log(colors.red("❌ Command not found!"));
    return;
  }

  console.log(colors.blue(`\n🚀 Running: ${colors.yellow(cmd)}\n`));
  try {
    exec(cmd, { encoding: "utf8", stdio: "inherit" });
  } catch (error) {
    console.log(colors.red(`\n❌ Error executing command: ${error.message}`));
  }
};

const getScriptDescription = (() => {
  const descriptions = packageJson.scriptsDescriptions || {};
  return (scriptName) => descriptions[scriptName] || null;
})();

const listScripts = function () {
  if (!scriptsCache || Object.keys(scriptsCache).length === 0) {
    console.log(colors.yellow("🤔 No scripts found in package.json\n"));
    process.exit();
  }

  const scriptsToShow = searchQuery
    ? filteredScripts
    : Object.keys(scriptsCache);

  if (searchQuery && scriptsToShow.length === 0) {
    console.log(
      colors.yellow(`\n🔍 No scripts found matching "${searchQuery}"\n`)
    );
  } else {
    console.log(colors.blue("📋 Available scripts:\n"));
    if (searchQuery) {
      console.log(colors.gray(`Search results for "${searchQuery}":\n`));
    }
  }

  const footer = [
    colors.gray("\nNavigation:"),
    colors.yellow("↑/↓") + " - Navigate",
    colors.yellow("Enter") + " - Run",
    colors.yellow("/") + " - Search",
    colors.yellow("?") + " - Help",
    colors.yellow("Esc") + " - Exit\n",
  ].join(" | ");

  const output = scriptsToShow
    .map((k, i) => {
      const script = scriptsCache[k];
      const isSelected = selected === i;
      const prefix = isSelected ? `   ${select_icon}  ` : "\t";
      const number = colors.yellow(`${i + 1}`);
      const name = colors.green(k);
      const command = colors.gray(script);
      const description = getScriptDescription(k);

      let line = `${prefix}${number} - ${name} => ${command}`;
      if (description) {
        line += `\n\t   ${colors.cyan(description)}`;
      }
      return line;
    })
    .join("\n");

  console.log(output);
  console.log(footer);
};

const listenForInput = function () {
  process.stdin.on("keypress", (str, key) => {
    if (options[key.name]) {
      selected = Math.abs(options[key.name](selected, MAX));
      clear();
      listScripts();
      ask();
    }
  });
};

const ask = function () {
  rl.clearLine(process.stdin);
  rl.question(
    colors.blue(
      "🎯 Use arrows ↑↓ to navigate, type number/name, or ? for help: "
    ),
    (res) => {
      if (res === "?") {
        showHelp();
        return ask();
      }
      if (res === "/") {
        showSearchPrompt();
        return;
      }

      res = res || selected + 1;
      const scriptsToUse = searchQuery
        ? filteredScripts
        : Object.keys(scriptsCache);
      const cmd = isNaN(res)
        ? scriptsCache[res.trim()]
        : scriptsCache[scriptsToUse[res - 1]];

      rl.close();
      run(cmd);
    }
  );
};

clear();
listScripts();
listenForInput();
ask();

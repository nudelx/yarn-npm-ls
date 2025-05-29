#!/usr/bin/env node
/* eslint-disable no-console */
const path = require("path");
const chalk = require("chalk").default;
const exec = require("child_process").execSync;
const readline = require("readline");
const fs = require("fs");
readline.emitKeypressEvents(process.stdin);

const ROOT_PATH = process.env.ROOT_PATH || path.resolve(process.cwd());
let packageJson;
try {
  packageJson = require(`${ROOT_PATH}/package.json`);
} catch (error) {
  console.log(chalk.red("❌ Error: package.json not found or invalid"));
  process.exit(1);
}

let selected = 0;
const MAX = packageJson.scripts && Object.keys(packageJson.scripts).length;
const select_icon = "👉";
const options = {
  down: function (x, max) {
    return (x + 1) % max;
  },
  up: function (x, max) {
    return x - 1 >= 0 ? (x - 1) % max : max - 1;
  },
  escape: function () {
    console.log(chalk.yellow("\n👋 Goodbye!"));
    process.exit();
  },
  "?": function () {
    showHelp();
    return selected;
  },
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clear = function () {
  console.log(exec("clear", { encoding: "utf8" }));
};

const showHelp = function () {
  clear();
  console.log(chalk.blueBright("📋 Available Commands:"));
  console.log(chalk.yellow("↑/↓") + " - Navigate through scripts");
  console.log(chalk.yellow("Enter") + " - Run selected script");
  console.log(chalk.yellow("?") + " - Show this help");
  console.log(chalk.yellow("Esc") + " - Exit\n");
  console.log(chalk.blueBright("Press any key to continue..."));
};

const run = function (cmd) {
  if (!cmd) {
    console.log(chalk.red("❌ Command not found!"));
    return;
  }

  console.log(chalk.blueBright(`\n🚀 Running: ${chalk.yellow(cmd)}\n`));
  try {
    exec(cmd, { encoding: "utf8", stdio: "inherit" });
  } catch (error) {
    console.log(chalk.red(`\n❌ Error executing command: ${error.message}`));
  }
};

const listScripts = function () {
  if (!packageJson.scripts || Object.keys(packageJson.scripts).length === 0) {
    console.log(chalk.yellow("🤔 No scripts found in package.json\n"));
    process.exit();
  }

  debugger;
  console.log("chalk", chalk);
  console.log(chalk.blueBright("📋 Available scripts:\n"));
  Object.keys(packageJson.scripts).forEach((k, i) => {
    const script = packageJson.scripts[k];
    const isSelected = selected === i;
    const prefix = isSelected ? `   ${select_icon}  ` : "\t";
    const number = chalk.yellow(`${i + 1}`);
    const name = chalk.greenBright(k);
    const command = chalk.gray(script);

    console.log(`${prefix}${number} - ${name} => ${command}`);
  });
  console.log(chalk.gray("\nPress ? for help\n"));
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
    chalk.blueBright(
      "🎯 Use arrows ↑↓ to navigate, type number/name, or ? for help: "
    ),
    (res) => {
      if (res === "?") {
        showHelp();
        return ask();
      }

      res = res || selected + 1;
      const cmd = isNaN(res)
        ? packageJson.scripts[res.trim()]
        : packageJson.scripts[Object.keys(packageJson.scripts)[res - 1]];

      rl.close();
      run(cmd);
    }
  );
};

clear();
listScripts();
listenForInput();
ask();

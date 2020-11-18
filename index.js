#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path')
const chalk = require('chalk')
const exec = require('child_process').execSync
const readline = require('readline')
readline.emitKeypressEvents(process.stdin)
const ROOT_PATH = process.env.ROOT_PATH || path.resolve(process.cwd()) // eslint-disable-line
const list = require(`${ROOT_PATH}/package.json`)

let selected = 0
const MAX = list.scripts && Object.keys(list.scripts).length
const select_icon = '👉'
const options = {
  down: function (x, max) {
    return (x + 1) % max
  },
  up: function (x, max) {
    return x - 1 >= 0 ? (x - 1) % max : max - 1
  },
  escape: function () {
    process.exit()
  },
}
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const clear = function () {
  console.log(exec('clear', { encoding: 'utf8' }))
}

const run = function (cmd) {
  const shell = cmd
    ? exec(cmd, { encoding: 'utf8', stdio: 'inherit' })
    : console.log(chalk.blueBright(' 🤨  command not found: \n'))
}

const listScripts = function () {
  if (!list.scripts) {
    console.log(chalk.blueBright(' 🤔  Your scripts are empty: \n'))
    process.exit()
  }
  console.log(chalk.blueBright(' 🤓  Available commands are: \n'))
  Object.keys(list.scripts).forEach((k, i) =>
    console.log(
      selected === i
        ? `   ${select_icon}  ${chalk.yellow(i + 1)} - ${chalk.greenBright(k)} => ${chalk.gray(
            list.scripts[k]
          )}`
        : `\t${chalk.yellow(i + 1)} - ${chalk.greenBright(k)} => ${chalk.gray(list.scripts[k])}`
    )
  )
  console.log('\n')
}

const listenForInput = function () {
  process.stdin.on('keypress', (str, key) => {
    if (options[key.name]) {
      selected = Math.abs(options[key.name](selected, MAX))
      clear()
      listScripts()
      ask()
    }
  })
}

const ask = function () {
  rl.clearLine(process.stdin)
  rl.question(chalk.blueBright(' 🧐 Use arrows to navigate or type the name/number: '), (res) => {
    res = res || selected + 1
    cmd = isNaN(res) ? list.scripts[res.trim()] : list.scripts[Object.keys(list.scripts)[res - 1]]
    rl.close()
    run(cmd)
  })
}

clear()
listScripts()
listenForInput()
ask()

#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path')
const chalk = require('chalk')
const exec = require('child_process').execSync
const readline = require('readline')
readline.emitKeypressEvents(process.stdin)
const ROOT_PATH = process.env.ROOT_PATH || path.resolve(process.cwd()) // eslint-disable-line
const list = require(`${ROOT_PATH}/package.json`)
const cliSelect = require('cli-select')
let selected = 0
options = {
  up: function (){},
  down: function(){}
}


const clear = function () {
  console.log(exec('clear', { encoding: 'utf8' }))
}

const run = function (cmd) {
  const shell = cmd
    ? exec(cmd, { encoding: 'utf8', stdio: 'inherit' })
    : console.log(chalk.blueBright(' 👉  command not found: \n'))
}

const listScripts = function () {
  if (!list.scripts) {
    console.log(chalk.blueBright(' 🤔  Your scripts are empty: \n'))
    process.exit()
  }
  console.log(chalk.blueBright(' 🤓  Available commands are: \n'))
  Object.keys(list.scripts).forEach((k, i) =>
    console.log(
      `\t${chalk.yellow(i + 1)} - ${chalk.greenBright(k)} => ${chalk.gray(list.scripts[k])}`
    )
  )
  console.log('\n')
}

const listenForInput = function () {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  process.stdin.on('keypress', (str, key) => {
    selected = options[key] ? options[key](selected) : null
  })

  rl.question(
    chalk.blueBright(
      " 🧐 Use arrows to navigate or type the number: "
    ),
    res => {
      console.log('res is:', res)
      // rl.close()
      // const cmd = isNaN(res)
      //   ? list.scripts[res.trim()]
      //   : list.scripts[Object.keys(list.scripts)[res - 1]]
      // run(cmd)
    }
  )
}

const askAndRun = function () {

  if (!list.scripts) {
    console.log(chalk.blueBright(' 🤔  Your scripts are empty: \n'))
    process.exit()
  }
  console.log(chalk.blueBright(' 🤓  Choose from available commands: \n'))
  
  cliSelect({
    inputStream: process.stdin,
    values: Object.keys(list.scripts),
    valueRenderer: (value, selected) =>
      `${chalk.greenBright(value)} => ${chalk.gray(list.scripts[value])}`,
    selected: ' 👉 ',
    unselected: '   ',
  })
    .then((res) => {
      console.log(chalk.blueBright(`🤞 Executing: ${res.value}`))
      const cmd = isNaN(res)
        ? list.scripts[res.value.trim()]
        : list.scripts[Object.keys(list.scripts)[res.id]]
      run(cmd)
    })
    .catch((e) => {
      e ? console.log(`Execution Error ${e}`) : console.log('Cancel')
    })
}

clear()
listScripts()
listenForInput()
// askAndRun()

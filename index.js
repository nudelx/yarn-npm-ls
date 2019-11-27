#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path')
const chalk = require('chalk')
const exec = require('child_process').execSync
const readline = require('readline');
process.env.__DEV__ === 'dev' ? process.chdir('.') : process.chdir('../..')
const ROOT_PATH = process.env.ROOT_PATH || path.resolve(process.cwd()) // eslint-disable-line
const list = require(`${ROOT_PATH}/package.json`)

const clear = function () {
  console.log(exec('clear', { encoding: 'utf8' }))
}

const run = function (cmd) {
  cmd ? console.log(exec(cmd, { encoding: 'utf8' })) : console.log(chalk.blueBright(' 👉  command not found: \n'))
}

const listScripts = function () {
  if (!list.scripts) {
    console.log(chalk.blueBright(' 🤔  Your scripts are empty: \n'))
    process.exit()

  }
  console.log(chalk.blueBright(' 👉  Available commands are: \n'))
  Object.keys(list.scripts).map((k,i) => console.log(`\t${chalk.yellow(i + 1)} - ${chalk.greenBright(k)} => ${chalk.gray(list.scripts[k])}`))
  console.log("\n")
}
  
const askAndRun = function () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question(chalk.blueBright(' 🤓  number or name of cmd to run or just hit enter to cancel $: '), 
  res => {
    rl.close()
    const cmd = isNaN(res) ? list.scripts[res.trim()] : list.scripts[ Object.keys(list.scripts)[res-1] ]
    run(cmd)
  })
}

// clear()
listScripts()
askAndRun()
#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path')
const chalk = require('chalk')
const ROOT_PATH = process.env.ROOT_PATH || path.resolve(__dirname, `../..`) // eslint-disable-line
const list = require(`${ROOT_PATH}/package.json`)
const exec = require('child_process').execSync
console.log(exec('clear', { encoding: 'utf8' }))

if (!list.scripts) {
  console.log(chalk.blueBright(' 🤔  Your scripts are empty: \n'))
  return
}
console.log(chalk.blueBright(' 👉  Available commands are: \n'))
Object.keys(list.scripts).map(k => console.log(`${chalk.yellow('✷')} - ${chalk.greenBright(k)}`))
console.log(' \n\n')

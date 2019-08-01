#!/usr/bin/env node

const child_process = require('child_process')
var path = require('path');
var argv = require('yargs').argv
var program = require('commander')
var chalk = require('chalk')
var shell = require('shelljs')
const {exec} = require('shelljs')

// 如果存在本地的命令，执行本地的
try {
    var localWebpack = require.resolve(path.join(process.cwd(), "node_modules", "xl-close_port", "bin", "xl-close_port.js"));
    if (__filename !== localWebpack) {
        return require(localWebpack);
    }
} catch (e) {
}


let package = JSON.parse(shell.cat(path.join(__dirname, '../package.json')))

let dirName = process.cwd()
program
    .version(package.version)
    .usage('<file> [options]')
    .option('-o', '输出文件名称')
    .option('-c', '混淆压缩')
    .action((file) => {
        let outFile = file.replace(/\.?(jsx|js)$/, '.min.js')
        if (argv.o) {
            outFile = `${argv.o}`
        }
        exec(`babel ${file} --out-file ${outFile}`, () => {
            if (argv.c) {
                exec(`uglifyjs ${outFile} -c -o ${outFile}`, () => {
                    console.log(chalk.blue(`成功！`))
                })
            } else {
                console.log(chalk.blue(`成功！`))
            }

        })
    })

program.parse(process.argv)

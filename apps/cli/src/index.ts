#!/usr/bin/env node
/* eslint-disable no-console */

import chalk from 'chalk';
import tmp from 'tmp';
import yargs from 'yargs';
import { globalArgumentsOptions } from './lib/global_arguments';
import { getYargsInput } from './lib/pre-yargs/preprocess_command';

// this line gets rid of warnings about "experimental fetch API" for our users
// while still showing us warnings when we test with DEBUG=1
if (!process.env.DEBUG) {
  process.removeAllListeners('warning');
}

// https://www.npmjs.com/package/tmp#graceful-cleanup
tmp.setGracefulCleanup();

const cwdIndex = process.argv.indexOf('--cwd');
if (cwdIndex >= 0 && process.argv[cwdIndex + 1]) {
  process.chdir(process.argv[cwdIndex + 1]);
}

process.on('uncaughtException', (err) => {
  console.log(chalk.redBright(`UNCAUGHT EXCEPTION: ${err.message}`));
  console.log(chalk.redBright(`UNCAUGHT EXCEPTION: ${err.stack}`));
  // eslint-disable-next-line no-restricted-syntax
  process.exit(1);
});

void yargs(getYargsInput())
  .commandDir('commands')
  .help()
  .usage(
    'Graphite is a command line tool that makes working with stacked changes fast & intuitive.\n\nhttps://github.com/tianrendong/gt-gh'
  )
  .options(globalArgumentsOptions)
  .global(Object.keys(globalArgumentsOptions))
  .strict()
  .demandCommand().argv;

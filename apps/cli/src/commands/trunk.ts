import yargs from 'yargs';
import { graphite } from '../lib/runner';

const args = {
  add: {
    describe:
      'Add an additional trunk. Multiple trunks are not supported by this GitHub-only CLI.',
    type: 'boolean',
    default: false,
  },
  all: {
    describe: 'Show all configured trunks. this CLI supports one trunk.',
    type: 'boolean',
    default: false,
    alias: 'a',
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'trunk';
export const canonical = 'trunk';
export const description = 'Show the trunk of the current branch.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    void argv;
    context.splog.info(context.engine.trunk);
  });

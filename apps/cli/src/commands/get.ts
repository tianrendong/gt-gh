import yargs from 'yargs';
import { getAction } from '../actions/sync/get';
import { graphite } from '../lib/runner';

const args = {
  branch: {
    describe: 'Branch or PR number to get from remote.',
    demandOption: false,
    type: 'string',
    positional: true,
    hidden: true,
  },
  checkout: {
    describe:
      'Check out target branch after syncing. Accepted for compatibility.',
    type: 'boolean',
    default: true,
  },
  'delete-all': {
    describe:
      'Delete merged or closed branches during get. Not separately configurable in Graphite.',
    type: 'boolean',
    default: false,
  },
  downstack: {
    describe: `Don't sync upstack branches. gt get is downstack-only.`,
    type: 'boolean',
    default: false,
    alias: 'd',
  },
  force: {
    describe: 'Overwrite all fetched branches with remote source of truth.',
    type: 'boolean',
    default: false,
    alias: 'f',
  },
  restack: {
    describe: 'Restack branches after get. Accepted for compatibility.',
    type: 'boolean',
    default: true,
  },
  unfrozen: {
    describe:
      'Checkout new branches as unfrozen. Graphite has no freeze support.',
    type: 'boolean',
    default: false,
    alias: 'U',
  },
  'remote-upstack': {
    describe: 'Include upstack PRs when fetching. Not supported by Graphite.',
    type: 'boolean',
    default: false,
    alias: 'u',
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'get [branch]';
export const canonical = 'get';
export const description =
  'Sync branches from trunk to the given branch from remote.';
export const builder = args;

export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) =>
    getAction({ branchName: argv.branch, force: argv.force }, context)
  );

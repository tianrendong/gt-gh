import yargs from 'yargs';
import { deleteBranchAction } from '../actions/delete_branch';
import { ExitFailedError } from '../lib/errors';
import { graphite } from '../lib/runner';

const args = {
  name: {
    type: 'string',
    positional: true,
    demandOption: false,
    optional: true,
    describe: 'The name of the branch to delete.',
    hidden: true,
  },
  close: {
    describe:
      'Close associated pull requests on GitHub. Not supported by this CLI delete.',
    type: 'boolean',
    default: false,
    alias: 'c',
  },
  downstack: {
    describe: 'Also delete ancestors. Not supported by this CLI delete.',
    type: 'boolean',
    default: false,
  },
  force: {
    describe: 'Delete the branch even if it is not merged or closed.',
    type: 'boolean',
    alias: 'f',
    default: false,
  },
  upstack: {
    describe: 'Also delete children. Not supported by this CLI delete.',
    type: 'boolean',
    default: false,
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'delete [name]';
export const canonical = 'delete';
export const description =
  'Delete a branch and its corresponding Graphite metadata.';
export const builder = args;

export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    if (argv.close) {
      throw new ExitFailedError(
        'This GitHub-only CLI does not support gt delete --close.'
      );
    }
    if (argv.downstack || argv.upstack) {
      throw new ExitFailedError(
        'This GitHub-only CLI does not support gt delete --downstack or --upstack.'
      );
    }
    const branchName = argv.name ?? context.engine.currentBranchPrecondition;
    return deleteBranchAction({ branchName, force: argv.force }, context);
  });

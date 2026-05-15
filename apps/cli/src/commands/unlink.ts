import yargs from 'yargs';
import { graphite } from '../lib/runner';

const args = {
  branch: {
    describe: 'The branch to unlink.',
    demandOption: false,
    type: 'string',
    positional: true,
    hidden: true,
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'unlink [branch]';
export const canonical = 'unlink';
export const description =
  'Unlink the PR currently associated with the branch.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    const branchName = argv.branch ?? context.engine.currentBranchPrecondition;
    context.engine.clearPrInfo(branchName);
    context.splog.info(`Unlinked PR info for ${branchName}.`);
  });

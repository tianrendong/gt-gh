import { execFileSync } from 'child_process';
import yargs from 'yargs';
import { graphite } from '../lib/runner';

const args = {
  branch: {
    describe: 'A branch name or PR number to open.',
    demandOption: false,
    type: 'string',
    positional: true,
    hidden: true,
  },
  stack: {
    describe:
      'Open the stack page. Graphite opens the GitHub PR page for the branch.',
    type: 'boolean',
    default: false,
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'pr [branch]';
export const canonical = 'pr';
export const description =
  'Open the pull request page for a branch or PR number.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    execFileSync(
      'gh',
      [
        'pr',
        'view',
        argv.branch ?? context.engine.currentBranchPrecondition,
        '--web',
      ],
      {
        stdio: 'inherit',
      }
    );
  });

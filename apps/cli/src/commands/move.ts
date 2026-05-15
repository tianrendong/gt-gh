import chalk from 'chalk';
import yargs from 'yargs';
import { currentBranchOnto } from '../actions/current_branch_onto';
import { interactiveBranchSelection } from '../actions/log';
import { ExitFailedError } from '../lib/errors';
import { graphite } from '../lib/runner';

const args = {
  all: {
    describe:
      'Show branches across all configured trunks in interactive selection. Charcoal has one trunk.',
    type: 'boolean',
    default: false,
    alias: 'a',
  },
  only: {
    describe:
      'Only move this branch. Not supported by Charcoal; descendants are restacked.',
    type: 'boolean',
    default: false,
  },
  onto: {
    describe: 'Branch to move the current branch onto.',
    type: 'string',
    alias: 'o',
  },
  source: {
    describe: 'Branch to move. Defaults to current branch.',
    type: 'string',
    alias: 's',
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'move';
export const canonical = 'move';
export const description =
  'Rebase the current branch onto the target branch and restack all descendants.';
export const builder = args;

export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    if (argv.only) {
      throw new ExitFailedError('Charcoal does not support gt move --only.');
    }

    const originalBranch = argv.source
      ? context.engine.currentBranch
      : undefined;
    if (argv.source) {
      context.engine.checkoutBranch(argv.source);
    }

    const dest =
      argv.onto ??
      (await interactiveBranchSelection(
        {
          message: `Choose a new base for ${chalk.yellow(
            context.engine.currentBranchPrecondition
          )} (autocomplete or arrow keys)`,
          omitCurrentBranch: true,
        },
        context
      ));

    currentBranchOnto(dest, context);

    if (originalBranch) {
      context.engine.checkoutBranch(originalBranch);
    }
  });

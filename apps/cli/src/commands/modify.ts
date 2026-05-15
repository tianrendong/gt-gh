import yargs from 'yargs';
import { commitAmendAction } from '../actions/commit_amend';
import { commitCreateAction } from '../actions/commit_create';
import { editBranchAction } from '../actions/edit_branch';
import { ExitFailedError } from '../lib/errors';
import { graphite } from '../lib/runner';

const args = {
  all: {
    describe: `Stage all changes before committing.`,
    demandOption: false,
    default: false,
    type: 'boolean',
    alias: 'a',
  },
  commit: {
    describe: `Create a new commit instead of amending the current commit.`,
    demandOption: false,
    default: false,
    type: 'boolean',
    alias: 'c',
  },
  edit: {
    describe: `Open an editor to edit the commit message when amending.`,
    demandOption: false,
    default: true,
    type: 'boolean',
    alias: 'e',
  },
  'interactive-rebase': {
    describe: `Start a git interactive rebase on the commits in this branch.`,
    demandOption: false,
    default: false,
    type: 'boolean',
  },
  into: {
    describe: `The branch to modify instead of the current branch. Not currently supported by Charcoal.`,
    demandOption: false,
    type: 'string',
  },
  message: {
    describe: `The message for the new or amended commit.`,
    demandOption: false,
    type: 'string',
    alias: 'm',
  },
  patch: {
    describe: `Pick hunks to stage before committing.`,
    demandOption: false,
    default: false,
    type: 'boolean',
    alias: 'p',
  },
  'reset-author': {
    describe: `Set the author of the commit to the current user if amending. Not currently supported by Charcoal.`,
    demandOption: false,
    default: false,
    type: 'boolean',
  },
  update: {
    describe: `Stage updates to tracked files before committing. Currently treated like --all in Charcoal.`,
    demandOption: false,
    default: false,
    type: 'boolean',
    alias: 'u',
  },
  verbose: {
    describe: `Show commit diff in editor. Not currently supported by Charcoal.`,
    demandOption: false,
    count: true,
    alias: 'v',
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'modify';
export const canonical = 'modify';
export const description =
  'Modify the current branch by amending its commit or creating a new commit.';
export const builder = args;

export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    if (argv.into) {
      throw new ExitFailedError('Charcoal does not support gt modify --into.');
    }
    if (argv['reset-author']) {
      throw new ExitFailedError(
        'Charcoal does not support gt modify --reset-author.'
      );
    }
    if (argv.verbose) {
      throw new ExitFailedError(
        'Charcoal does not support gt modify --verbose.'
      );
    }
    if (argv['interactive-rebase']) {
      return editBranchAction(context);
    }

    if (argv.commit) {
      return commitCreateAction(
        {
          message: argv.message,
          addAll: argv.all || argv.update,
          patch: argv.patch,
        },
        context
      );
    }

    return commitAmendAction(
      {
        message: argv.message,
        noEdit: !argv.edit || !!argv.message,
        addAll: argv.all || argv.update,
        patch: argv.patch,
      },
      context
    );
  });

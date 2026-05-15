import yargs from 'yargs';
import { submitAction } from '../actions/submit/submit_action';
import { SCOPE } from '../lib/engine/scope_spec';
import { ExitFailedError } from '../lib/errors';
import { graphite } from '../lib/runner';
import { args as sharedArgs } from './shared-commands/submit';

const args = {
  ...sharedArgs,
  select: {
    describe:
      'Reports the PRs that would be submitted and asks the user to select which should be updated/created.',
    type: 'boolean',
    default: false,
  },
  stack: {
    describe:
      'Submit descendants of the current branch in addition to its ancestors.',
    type: 'boolean',
    default: false,
    alias: 's',
  },
  ai: {
    describe:
      'Graphite AI PR metadata generation is not supported by this GitHub-only CLI.',
    type: 'boolean',
    default: false,
  },
  'no-ai': {
    describe:
      'No-op compatibility flag; this GitHub-only CLI never uses Graphite AI.',
    type: 'boolean',
    default: false,
  },
  cli: {
    describe: 'No-op compatibility flag; this CLI edits PR metadata locally.',
    type: 'boolean',
    default: false,
  },
  web: {
    describe:
      'Graphite-hosted web PR metadata editing is not supported by this GitHub-only CLI.',
    type: 'boolean',
    default: false,
    alias: 'w',
  },
  'edit-title': {
    describe: 'Use --edit in this CLI.',
    type: 'boolean',
    default: false,
  },
  'edit-description': {
    describe: 'Use --edit in this CLI.',
    type: 'boolean',
    default: false,
  },
  'no-edit-title': {
    describe: 'Use --no-edit in this CLI.',
    type: 'boolean',
    default: false,
  },
  'no-edit-description': {
    describe: 'Use --no-edit in this CLI.',
    type: 'boolean',
    default: false,
  },
  comment: {
    describe:
      'Adding submit comments is not supported by this GitHub-only CLI.',
    type: 'string',
  },
  'merge-when-ready': {
    describe:
      'Graphite merge-when-ready is not supported by this GitHub-only CLI.',
    type: 'boolean',
    default: false,
    alias: 'm',
  },
  'team-reviewers': {
    describe: 'Use --reviewers org/team-slug with GitHub CLI semantics.',
    type: 'string',
    alias: 't',
  },
  'rerequest-review': {
    describe: 'Rerequesting reviews is not supported by this GitHub-only CLI.',
    type: 'boolean',
    default: false,
  },
  restack: {
    describe:
      'Restack branches before submitting. This CLI already validates stack state.',
    type: 'boolean',
    default: false,
  },
  'target-trunk': {
    describe:
      'Multiple target trunks are not supported by this GitHub-only CLI.',
    type: 'string',
  },
  'ignore-out-of-sync-trunk': {
    describe: 'No-op compatibility flag.',
    type: 'boolean',
    default: false,
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'submit';
export const canonical = 'submit';
export const aliases = ['ss'];
export const description =
  'Idempotently force push branches to GitHub, creating or updating pull requests.';
export const builder = args;

export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    if (argv.ai) {
      throw new ExitFailedError(
        'This GitHub-only CLI does not support Graphite AI PR metadata generation.'
      );
    }
    if (argv.web) {
      throw new ExitFailedError(
        'This GitHub-only CLI does not support gt submit --web.'
      );
    }
    if (argv.comment) {
      throw new ExitFailedError(
        'This GitHub-only CLI does not support gt submit --comment.'
      );
    }
    if (argv['merge-when-ready']) {
      throw new ExitFailedError(
        'This GitHub-only CLI does not support Graphite merge-when-ready.'
      );
    }
    if (argv['rerequest-review']) {
      throw new ExitFailedError(
        'This GitHub-only CLI does not support gt submit --rerequest-review.'
      );
    }
    if (argv['target-trunk']) {
      throw new ExitFailedError(
        'This GitHub-only CLI does not support gt submit --target-trunk.'
      );
    }

    await submitAction(
      {
        scope: argv.stack ? SCOPE.STACK : SCOPE.DOWNSTACK,
        editPRFieldsInline:
          !argv['no-edit'] &&
          (argv.edit || argv['edit-title'] || argv['edit-description']),
        draft: argv.draft,
        publish: argv.publish,
        dryRun: argv['dry-run'],
        updateOnly: argv['update-only'],
        reviewers: argv.reviewers ?? argv['team-reviewers'],
        confirm: argv.confirm,
        forcePush: argv.force,
        select: argv.select,
        always: argv.always,
        branch: argv.branch,
      },
      context
    );
  });

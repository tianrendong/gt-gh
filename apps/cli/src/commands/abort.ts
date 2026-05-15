import yargs from 'yargs';
import { clearContinuation } from '../actions/persist_continuation';
import { graphite } from '../lib/runner';

const args = {
  force: {
    describe: 'Do not prompt for confirmation; abort immediately.',
    type: 'boolean',
    default: false,
    alias: 'f',
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'abort';
export const canonical = 'abort';
export const description =
  'Abort the current Graphite command halted by a rebase conflict.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    if (
      !argv.force &&
      context.interactive &&
      !(
        await context.prompts({
          type: 'confirm',
          name: 'value',
          message: 'Abort the current rebase?',
          initial: false,
        })
      ).value
    ) {
      return;
    }
    context.engine.abortRebase();
    clearContinuation(context);
    context.splog.info('Aborted rebase.');
  });

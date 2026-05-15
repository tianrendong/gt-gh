import yargs from 'yargs';
import { editDownstack } from '../actions/edit/edit_downstack';
import { ExitFailedError } from '../lib/errors';
import { graphite } from '../lib/runner';

const args = {
  stack: {
    describe:
      'Include every upstack branch through the tip. Not supported by Charcoal reorder.',
    type: 'boolean',
    default: false,
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'reorder';
export const canonical = 'reorder';
export const description =
  'Reorder branches between trunk and the current branch, restacking descendants.';
export const builder = args;

export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    if (argv.stack) {
      throw new ExitFailedError(
        'Charcoal does not support gt reorder --stack.'
      );
    }
    await editDownstack(undefined, context);
  });

import { relative } from 'path';
import * as paths from './paths';

import colors = require('colors');

// Base
export const start = (port) => colors.yellow(`Mocking Server is running on port ${port} ...\n`);

// JsonExtender
export const extender = {
    success: colors.green(`\nGeneration successfull !`),
    staticTitle: colors.green(`\nstatic json mocks used :\n`),
    generatedTitle: colors.green(`\ngenerated mocks :\n`),
    savedTo: (filePath) => colors.green(`\nresult saved to ${relative(paths.projectRoot, filePath)} \n\n`),
};

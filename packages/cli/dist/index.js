#!/usr/bin/env node
import { runInitCommand } from './commands/init.js';
import { runContinueCommand } from './commands/continue.js';
import { runPromptCommand } from './commands/prompt.js';
import { runStatusCommand } from './commands/status.js';
const [, , command, ...args] = process.argv;
const printUsage = () => {
    console.log([
        'Usage:',
        '  nexxoria init',
        '  nexxoria continue',
        '  nexxoria status',
        '  nexxoria prompt "your prompt"',
    ].join('\n'));
};
const main = async () => {
    const projectRoot = process.cwd();
    switch (command) {
        case 'init': {
            console.log(await runInitCommand(projectRoot));
            return;
        }
        case 'continue': {
            console.log(await runContinueCommand(projectRoot));
            return;
        }
        case 'status': {
            console.log(await runStatusCommand(projectRoot));
            return;
        }
        case 'prompt': {
            const prompt = args.join(' ').trim();
            console.log(await runPromptCommand(projectRoot, prompt));
            return;
        }
        default: {
            printUsage();
            process.exitCode = 1;
        }
    }
};
main().catch((error) => {
    const message = error instanceof Error ? error.message : 'Unknown CLI error';
    console.error(`Nexxoria CLI error: ${message}`);
    process.exitCode = 1;
});

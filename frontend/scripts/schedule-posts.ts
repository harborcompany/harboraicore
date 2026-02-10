
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATE_SCRIPT = path.join(__dirname, 'generate-post.ts');

// Run every 24 hours
const INTERVAL = 24 * 60 * 60 * 1000;

function runGenerator() {
    console.log(`[${new Date().toISOString()}] Starting blog post generation...`);

    // Use npx tsx to run the script
    const child = spawn('npx', ['tsx', GENERATE_SCRIPT], {
        stdio: 'inherit',
        shell: true,
        cwd: path.join(__dirname, '..') // Run from frontend root
    });

    child.on('close', (code) => {
        console.log(`[${new Date().toISOString()}] Blog generation finished with code ${code}`);
    });
}

// Run immediately on start
runGenerator();

// Schedule
setInterval(runGenerator, INTERVAL);

console.log(`Blog Scheduler active. Running every 24 hours.`);

const { spawn } = require('child_process');
const path = require('path');

// Function to run a command
function runCommand(command, args, options = {}) {
    const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
    });

    return new Promise((resolve, reject) => {
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });

        child.on('error', (err) => {
            reject(err);
        });
    });
}

// Run both commands concurrently
async function start() {
    try {
        // Start Tailwind CSS watcher
        const tailwindProcess = spawn(
            'tailwindcss',
            ['-i', './src/styles/input.css', '-o', './src/styles/output.css', '--watch'],
            { stdio: 'inherit', shell: true }
        );

        // Start Electron
        const electronProcess = spawn(
            'electron',
            ['.'],
            { stdio: 'inherit', shell: true }
        );

        // Handle process termination
        const cleanup = () => {
            tailwindProcess.kill();
            electronProcess.kill();
            process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

        // Handle child process errors
        tailwindProcess.on('error', (err) => {
            console.error('Tailwind CSS process error:', err);
            cleanup();
        });

        electronProcess.on('error', (err) => {
            console.error('Electron process error:', err);
            cleanup();
        });

    } catch (error) {
        console.error('Error starting application:', error);
        process.exit(1);
    }
}

// Start the application
start();
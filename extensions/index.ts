import { exec } from 'child_process';
import { promisify } from 'util';
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

type Executor = (command: string) => Promise<{ stdout: string; stderr: string }>;

export default function codebaseMemoryMcpTriggerExtension(
  pi: ExtensionAPI,
  executor: Executor = promisify(exec)
) {
  pi.registerCommand("codebase-memory-mcp", {
    description: "Trigger the codebase-memory-mcp executable with arguments",
    handler: async (args, ctx) => {
      const cmd = "codebase-memory-mcp";
      const trimmedArgs = args.trim();
      const fullCommand = trimmedArgs ? `${cmd} ${trimmedArgs}` : `${cmd} --help`;

      ctx.ui.notify(`Triggering: ${fullCommand}`, "info");

      try {
        const { stdout, stderr } = await executor(fullCommand);
        
        if (stdout) {
          process.stdout.write(stdout);
          ctx.ui.notify(stdout.length > 500 ? stdout.slice(0, 500) + '...' : stdout, "info");
        }
        if (stderr) {
          process.stderr.write(stderr);
          ctx.ui.notify(stderr.length > 500 ? stderr.slice(0, 500) + '...' : stderr, "warning");
        }
        
        if (stdout || stderr) {
          pi.sendUserMessage((stdout + stderr).trim());
        }
      } catch (error: any) {
        if (error.message.includes("not found") || error.message.includes("ENOENT")) {
          ctx.ui.notify(`Command '${cmd}' not found. Please install it first.`, "error");
        } else {
          process.stderr.write(error.message + '\n');
          ctx.ui.notify(`Error: ${error.message}`, "error");
        }
      }
    },
  });
}

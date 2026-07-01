import assert from 'node:assert';
import test from 'node:test';
import codebaseMemoryMcpTriggerExtension from '../extensions/index';

// Mock types for our tests
interface MockPi {
  sendUserMessage: (msg: string) => void;
  registerCommand: (name: string, config: any) => void;
}

interface MockCtx {
  ui: {
    notify: (msg: string, type: string) => void;
  };
}

test('codebase-memory-mcp extension', async (t) => {
  let capturedHandler: (args: string, ctx: any) => Promise<void>;
  let lastCommandExecuted = '';
  let lastNotifyCall: { msg: string; type: string } | null = null;
  let lastUserMessage = '';

  const mockPi = {
    registerCommand: (name: string, config: any) => {
      if (name === 'codebase-memory-mcp') {
        capturedHandler = config.handler;
      }
    },
    sendUserMessage: (msg: string) => {
      lastUserMessage = msg;
    },
  } as unknown as MockPi;

  const mockCtx = {
    ui: {
      notify: (msg: string, type: string) => {
        lastNotifyCall = { msg, type };
      },
    },
  } as unknown as MockCtx;

  // Initialize the extension
  codebaseMemoryMcpTriggerExtension(mockPi, async () => ({ stdout: '', stderr: '' }) as any);

  assert.ok(capturedHandler, 'Handler should be registered');

  await t.test('should execute command with no arguments', async (t) => {
    lastCommandExecuted = '';
    lastNotifyCall = null;
    lastUserMessage = '';
    
    const executor = async (cmd: string) => {
      lastCommandExecuted = cmd;
      return { stdout: 'success output', stderr: '' };
    };
    
    codebaseMemoryMcpTriggerExtension(mockPi, executor as any);
    await capturedHandler!('', mockCtx);

    assert.strictEqual(lastCommandExecuted, 'codebase-memory-mcp --help');
    assert.strictEqual(lastNotifyCall?.type, 'info');
    assert.ok(lastUserMessage.includes('success output'));
  });

  await t.test('should execute command with arguments', async (t) => {
    lastCommandExecuted = '';
    lastNotifyCall = null;
    lastUserMessage = '';
    
    const executor = async (cmd: string) => {
      lastCommandExecuted = cmd;
      return { stdout: 'arg success', stderr: '' };
    };
    
    codebaseMemoryMcpTriggerExtension(mockPi, executor as any);
    await capturedHandler!('--arg1 --arg2', mockCtx);

    assert.strictEqual(lastCommandExecuted, 'codebase-memory-mcp --arg1 --arg2');
    assert.ok(lastUserMessage.includes('arg success'));
  });

  await t.test('should handle execution error', async (t) => {
    lastNotifyCall = null;
    
    const executor = async (cmd: string) => {
      throw new Error('failed to run');
    };
    
    codebaseMemoryMcpTriggerExtension(mockPi, executor as any);
    await capturedHandler!('', mockCtx);

    assert.strictEqual(lastNotifyCall?.type, 'error');
    assert.ok(lastNotifyCall?.msg.includes('failed to run'));
  });

  await t.test('should handle stderr', async (t) => {
    lastNotifyCall = null;
    
    const executor = async (cmd: string) => {
      return { stdout: '', stderr: 'some error msg' };
    };
    
    codebaseMemoryMcpTriggerExtension(mockPi, executor as any);
    await capturedHandler!('', mockCtx);

    assert.strictEqual(lastNotifyCall?.type, 'warning');
    assert.ok(lastNotifyCall?.msg.includes('some error msg'));
  });

  await t.test('should handle command not found', async (t) => {
    lastNotifyCall = null;
    
    const executor = async (cmd: string) => {
      throw new Error('sh: 1: codebase-memory-mcp: not found');
    };
    
    codebaseMemoryMcpTriggerExtension(mockPi, executor as any);
    await capturedHandler!('', mockCtx);

    assert.strictEqual(lastNotifyCall?.type, 'error');
    assert.ok(lastNotifyCall?.msg.includes("Command 'codebase-memory-mcp' not found. Please install it first."));
  });

  await t.test('should handle stdout and notify user', async (t) => {
    lastNotifyCall = null;
    lastUserMessage = '';
    
    const executor = async (cmd: string) => {
      return { stdout: 'important data', stderr: '' };
    };
    
    codebaseMemoryMcpTriggerExtension(mockPi, executor as any);
    await capturedHandler!('', mockCtx);

    assert.strictEqual(lastNotifyCall?.type, 'info');
    assert.ok(lastNotifyCall?.msg.includes('important data'));
    assert.strictEqual(lastUserMessage, 'important data');
  });
});

import { BotExecutionContext } from './api';
import { setTimeout } from 'node:timers/promises';

export async function test(context: BotExecutionContext) {
  context.log('info', 'test');
  await setTimeout(2000, null, { signal: context.signal });
  context.log('warning', 'ok!');
}
import { BotExecutionContext } from './api';
import { setTimeout } from 'node:timers/promises';

export default async function (context: BotExecutionContext) {
  context.log('info', 'Execution OK!');
}
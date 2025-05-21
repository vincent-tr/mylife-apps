import yargs from 'yargs';

let argv;

export function getArgs() {
  if(!argv) {
    argv = yargs.argv;
  }
  return argv;

}

export function getArg(name: string, defaultValue?) {
  const value = getArgs()[name];
  return value === undefined ? defaultValue : value;
}

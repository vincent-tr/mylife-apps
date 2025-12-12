import { confirmable, createConfirmation } from 'react-confirm';
import { ToolsProvider } from '../../components/application';
import Confirm, { ConfirmOptions } from './components/confirm';
import Input, { InputOptions, InputResult } from './components/input';

export function create<TProps>(Dialog: React.ComponentType<TProps>) {
  // We omit 'show' and 'proceed' from the props as they will be provided by the confirmable HOC
  const DialogWrapper = (props: Omit<TProps, 'show' | 'proceed'>) => (
    <ToolsProvider>
      <Dialog {...(props as TProps)} />
    </ToolsProvider>
  );

  return createConfirmation(confirmable(DialogWrapper));
}

const confirmDialog = create(Confirm);

const defaultConfirmActions = [
  { text: 'Oui', value: true },
  { text: 'Non', value: false },
];

export async function confirm<TValue = boolean>(options: ConfirmOptions<TValue>) {
  if (!options.actions) {
    // Note: wrong if TValue is not boolean but actions are not provided
    options = { actions: defaultConfirmActions as ConfirmOptions<TValue>['actions'], ...options };
  }

  return (await confirmDialog({ options })) as TValue;
}

const inputDialog = create(Input);

export async function input(options: InputOptions) {
  return (await inputDialog({ options })) as InputResult;
}

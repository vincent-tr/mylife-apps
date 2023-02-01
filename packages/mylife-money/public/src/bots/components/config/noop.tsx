import { React, mui } from 'mylife-tools-ui';

type FIXME_any = any;
type Bot = FIXME_any;

interface NoopConfigProps {
  bot: Bot;
  onChange?: (changes: Partial<Bot>) => void;
}

export const NoopConfig: React.FunctionComponent<NoopConfigProps> = ({ bot, onChange }) => {
  return (
    <></>
  );
};

interface NoopStateProps {
  bot: Bot;
}

export const NoopState: React.FunctionComponent<NoopStateProps> = ({ bot }) => {
  return (
    <></>
  );
};

import { React, mui } from 'mylife-tools-ui';

type FIXME_any = any;
type Bot = FIXME_any;

interface NoopConfigProps {
  configuration: unknown;
  onChange?: (configuration: unknown) => void;
}

export const NoopConfig: React.FunctionComponent<NoopConfigProps> = ({ configuration, onChange }) => {
  return (
    <></>
  );
};

interface NoopStateProps {
  state: unknown;
}

export const NoopState: React.FunctionComponent<NoopStateProps> = ({ state }) => {
  return (
    <></>
  );
};

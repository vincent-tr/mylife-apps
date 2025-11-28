import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api, useLifecycle } from 'mylife-tools';
import { enter, leave } from '../actions';
import { getNagiosView, getUpsmonView, getUpdatesView } from '../selectors';
import NagiosSummary from './nagios-summary';
import UpdatesSummary from './updates-summary';
import UpsmonSummary from './upsmon-summary';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    nagios: useSelector(getNagiosView),
    upsmon: useSelector(getUpsmonView),
    updates: useSelector(getUpdatesView),
    ...useMemo(
      () => ({
        enter: () => dispatch(enter()),
        leave: () => dispatch(leave()),
      }),
      [dispatch]
    ),
  };
};

const Container = styled('div')({
  flex: '1 1 auto',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const Section = styled('div')({});

export default function Home() {
  const { enter, leave, nagios, upsmon, updates } = useConnect();
  useLifecycle(enter, leave);

  return (
    <Container>
      <Section>
        {Object.values(nagios).map((summary: api.Entity) => (
          <NagiosSummary key={summary._id} data={summary} />
        ))}
      </Section>

      <Section>
        <UpsmonSummary view={upsmon} />
      </Section>

      <Section>
        <UpdatesSummary view={updates} />
      </Section>
    </Container>
  );
}

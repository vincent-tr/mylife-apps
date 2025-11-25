import React, { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { views, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getNagiosView, getUpsmonView, getUpdatesView } from '../selectors';
import NagiosSummary from './nagios-summary';
import UpsmonSummary from './upsmon-summary';
import UpdatesSummary from './updates-summary';

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

const Home = () => {
  const { enter, leave, nagios, upsmon, updates } = useConnect();
  useLifecycle(enter, leave);

  return (
    <Container>
      <Section>
        {Object.values(nagios).map((summary: views.Entity) => (
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
};

export default Home;

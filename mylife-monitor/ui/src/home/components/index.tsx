import { styled } from '@mui/material/styles';
import { api } from 'mylife-tools';
import { useNagiosSummaryView, useUpsmonSummaryView, useUpdatesSummaryView } from '../views';
import NagiosSummary from './nagios-summary';
import UpdatesSummary from './updates-summary';
import UpsmonSummary from './upsmon-summary';

const Container = styled('div')({
  flex: '1 1 auto',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const Section = styled('div')({});

export default function Home() {
  const nagios = useNagiosSummaryView();
  const upsmon = useUpsmonSummaryView();
  const updates = useUpdatesSummaryView();

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

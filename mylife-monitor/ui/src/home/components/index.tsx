import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PropsWithChildren } from 'react';
import Nagios from '../../nagios/components';
import Updates from '../../updates/components';
import Upsmon from '../../upsmon/components';
import icons from '../../common/icons';

export default function Home() {
  return (
    <Container>
      <Section name='Nagios' icon={icons.menu.Nagios}>
        <Nagios summary={true} />
      </Section>

      <Section name='Updates' icon={icons.menu.Updates}>
        <Updates summary={true} />
      </Section>

      <Section name='Ups monitor' icon={icons.menu.Upsmon}>
        <Upsmon summary={true} />
      </Section>
    </Container>
  );
}

const Container = styled('div')({
  flex: '1 1 auto',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

interface SectionProps extends PropsWithChildren {
  name: string;
  icon: React.ElementType;
}

function Section({ name, icon, children }: SectionProps) {
  const Icon = icon;
  return (
    <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <TitleContainer>
            <Icon />
            <Typography>{name}</Typography>
          </TitleContainer>
        </AccordionSummary>
        <AccordionDetails>
          {children}
        </AccordionDetails>
      </Accordion>
  );
}

const TitleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flex: '1 1 auto',
  overflowY: 'auto',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
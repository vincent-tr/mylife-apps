import ExpandMore from '@mui/icons-material/ExpandMore';
import Accordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import React, { PropsWithChildren, useState } from 'react';

export interface SummaryAccordionProps extends PropsWithChildren, Omit<AccordionProps, 'expanded' | 'onChange' | 'children'> {
  initialExpanded?: boolean;
  expandedSummary: React.ReactNode;
  collapsedSummary: React.ReactNode;
}

export default function SummaryAccordion({ initialExpanded = true, expandedSummary, collapsedSummary, children, ...props }: SummaryAccordionProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Accordion expanded={expanded} onChange={toggleExpanded} {...props}>
      <AccordionSummary expandIcon={<ExpandMore />}>{expanded ? expandedSummary : collapsedSummary}</AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

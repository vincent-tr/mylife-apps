import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import * as icons from '@mui/icons-material';

const SummaryAccordion = ({ initialExpanded = true, expandedSummary, collapsedSummary, children, ...props }) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Accordion expanded={expanded} onChange={toggleExpanded} {...props}>
      <AccordionSummary expandIcon={<icons.ExpandMore />}>
        {expanded ? expandedSummary : collapsedSummary}
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

SummaryAccordion.propTypes = {
  initialExpanded: PropTypes.bool,
  expandedSummary: PropTypes.node.isRequired,
  collapsedSummary: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default SummaryAccordion;

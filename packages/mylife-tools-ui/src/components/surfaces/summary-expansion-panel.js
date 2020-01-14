'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import * as icons from '@material-ui/icons';

const SummaryExpansionPanel = ({ initialExpanded = true, expandedSummary, collapsedSummary, children, ...props }) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <ExpansionPanel expanded={expanded} onChange={toggleExpanded} {...props}>
      <ExpansionPanelSummary expandIcon={<icons.ExpandMore />}>
        {expanded ? expandedSummary : collapsedSummary}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

SummaryExpansionPanel.propTypes = {
  initialExpanded: PropTypes.bool,
  expandedSummary: PropTypes.node.isRequired,
  collapsedSummary: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default SummaryExpansionPanel;

'use strict';

import { React, PropTypes, mui, useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getSuggestions } from '../selectors';
import WarnSyncingCard from './warn-syncing-card';
import CleanOthersCard from './clean-others-card';
import CleanDuplicatesCard from './clean-duplicates-card';
import AlbumCreationCard from './album-creation-card';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      suggestions : getSuggestions(state),
    })),
    ...useMemo(() => ({
      enter : () => dispatch(enter()),
      leave : () => dispatch(leave()),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    flex: '1 1 auto',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10
  },
  card: {
    width: 400,
    height: 180,
    margin: 10
  }
});

const SuggestionCard = ({ suggestion, ...props }) => {
  switch(suggestion.type) {
    case 'warn-syncing':
      return (<WarnSyncingCard definition={suggestion.definition} {...props} />);
    case 'clean-others':
      return (<CleanOthersCard definition={suggestion.definition} {...props} />);
    case 'clean-duplicates':
      return (<CleanDuplicatesCard definition={suggestion.definition} {...props} />);
    case 'album-creation':
      return (<AlbumCreationCard definition={suggestion.definition} {...props} />);
    default:
      throw new Error(`Unsupported suggestion type: '${suggestion.type}'`);
  }
};

SuggestionCard.propTypes = {
  suggestion: PropTypes.object.isRequired
};

const Suggestions = () => {
  const classes = useStyles();
  const { enter, leave, suggestions } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      {suggestions.map(suggestion => (
        <SuggestionCard key={suggestion._id} suggestion={suggestion} className={classes.card} variant='outlined' />
      ))}
    </div>
  );
};

export default Suggestions;

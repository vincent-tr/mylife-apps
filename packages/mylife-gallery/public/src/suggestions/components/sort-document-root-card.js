'use strict';

import { React, PropTypes, mui, addLineBreaks, useDispatch, useMemo, routing } from 'mylife-tools-ui';
import { browseWithCriteria } from '../actions';
import CardBase from './card-base';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    browseWithCriteria : (criteria) => dispatch(browseWithCriteria(criteria))
  }), [dispatch]);
};

const SortDocumentRootCard = ({ definition, ...props }) => {
  const { browseWithCriteria } = useConnect();
  const { navigate } = routing.useRoutingConnect();

  const onBrowse = () => {
    browseWithCriteria({ path: definition.root });
    navigate('/browse');
  };

  return (
    <CardBase
      title={definition.root}
      description={addLineBreaks([
        `${definition.movableCount} document(s) à déplacer`,
        `${definition.sortableCount} document(s) à trier`
      ])}
      actions={
        <mui.Button size='small' onClick={onBrowse}>Parcourir</mui.Button>
      }
      {...props}
    />
  );
};

SortDocumentRootCard.propTypes = {
  definition: PropTypes.object.isRequired
};

export default SortDocumentRootCard;

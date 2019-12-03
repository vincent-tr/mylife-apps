'use strict';

import { React } from 'mylife-tools-ui';

const List = ({ data }) => {

  return (
    <div>
      {`Browse (data = ${data ? data.size : null})`}
    </div>
  );
};

export default List;

'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

console.log(components);

const Tables = () => (
  <div>
    <components.Table>
      <components.TableHeader>
        <components.TableHeaderRow>
          <components.TableHeaderCell>Column1</components.TableHeaderCell>
          <components.TableHeaderCell>Column2</components.TableHeaderCell>
          <components.TableHeaderCell>Column3</components.TableHeaderCell>
        </components.TableHeaderRow>
      </components.TableHeader>
      <components.TableBody>
        <components.TableRow>
          <components.TableCell>Cell11</components.TableCell>
          <components.TableCell>Cell12</components.TableCell>
          <components.TableCell>Cell13</components.TableCell>
        </components.TableRow>
        <components.TableRow>
          <components.TableCell>Cell21</components.TableCell>
          <components.TableCell>Cell22</components.TableCell>
          <components.TableCell>Cell23</components.TableCell>
        </components.TableRow>
        <components.TableRow>
          <components.TableCell>Cell31</components.TableCell>
          <components.TableCell>Cell32</components.TableCell>
          <components.TableCell>Cell33</components.TableCell>
        </components.TableRow>
        <components.TableRow>
          <components.TableCell>Cell41</components.TableCell>
          <components.TableCell>Cell42</components.TableCell>
          <components.TableCell>Cell43</components.TableCell>
        </components.TableRow>
      </components.TableBody>
    </components.Table>
  </div>
);

Tables.meta = {
  menu: 'Components',
  icon: null,
  title: 'Tables'
};

export default Tables;

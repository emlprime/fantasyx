import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Characters from './Characters';

storiesOf('Characters', module)
  .add('all', () => (
    <Characters />
  ));


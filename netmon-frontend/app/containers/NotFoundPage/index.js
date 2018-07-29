/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';

import Flex from 'components/Flex';

const NotFoundPage = () => (
  <Flex
    width={1}
    mx="auto"
    px={14}
    pt={168}
    pb={12}
    flex="1 1 auto"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    Page not found
  </Flex>
);

export default NotFoundPage;

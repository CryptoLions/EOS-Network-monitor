import React, { Fragment } from 'react';
import styled from 'styled-components';

// Styles
const ProducerNameLink = styled.a`
  display: inline-block;
  padding-right: 5px;

  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  word-break: break-word;

  &:hover {
    text-decoration: underline;
    color: #005dc1;
  }
`;

const Arrow = styled.span`
  padding-right: 5px;
  &:after {
    content: '>';
  }
`;

export const stringHandler = (str = '', callback) => {
  if (!str || !str.match) {
    return str;
  }
  if (str.match(/,|>/)) {
    const isStringHasComas = str.match(/(, )/);
    const strArr = str.split(isStringHasComas ? ', ' : '>');

    return strArr.map((name, index) => (
      <Fragment key={`PName-${index}`}>
        <ProducerNameLink onClick={callback}>{name}</ProducerNameLink>
        {!isStringHasComas && index !== strArr.length - 1 && <Arrow />}
      </Fragment>
    ));
  }
  if (str.length === 12 && !str.match(/EOS|bytes|IQ/))
    return <ProducerNameLink onClick={callback}>{str}</ProducerNameLink>;

  return str;
};

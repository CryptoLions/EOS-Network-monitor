// Core
import React, { Fragment } from 'react';

// Styles
import { Header, HeadBox, HeadText } from '../styles';
import {
  LegendContainer,
  Heading,
  Content,
  BottomContent,
  AboutDiv,
  ColorsLegendDiv,
  ColorDiv,
  ColorDesc,
  Green,
  Red,
  Yellow,
  Purple,
  Grey,
  NoteDiv,
  Note,
  NoteNumber,
  Link,
  Bold,
} from './styles';

export const Legend = () => (
  <Fragment>
    <Header>
      <HeadBox>
        <HeadText>LEGEND</HeadText>
      </HeadBox>
    </Header>
    <LegendContainer>
      <AboutDiv>
        <Heading>ABOUT</Heading>
        <Content>
          <span>All information comes from quering PUBLIC nodes. Block producing nodes are usually hidden. </span>
          <span>EOS Network Monitor is a tool to check EOS public endpoints and show general info. </span>
          <span>It shows all registerd producers and ftech info about endpoints from bp.json file.</span>
          <span>
            {`The monitor checks only the first 60 producer's public endpoints and does not necessarily represent the state of
        hidden production nodes.`}
          </span>
        </Content>
        <BottomContent>
          <span>
            <Bold>TPS</Bold> - Transaction per second
          </span>
          <span>
            <Bold>APS</Bold> - Actions in transaction per second
          </span>
        </BottomContent>
      </AboutDiv>
      <ColorsLegendDiv>
        <Heading>COLORS LEGEND</Heading>
        <ColorDiv>
          <Green /> - producing right now.
        </ColorDiv>
        <ColorDiv>
          <Red /> - No response from public API endpoint&nbsp;
          <ColorDesc>(Does not necessarily mean that producers node is down).</ColorDesc>
        </ColorDiv>
        <ColorDiv>
          <Yellow /> - Other version.
        </ColorDiv>
        <ColorDesc>
          {`Version information is obtained from querying public nodes. Block producing nodes are usually hidden. There may
        be legitimate reasons for "off version" public nodes, like sidestepping a known bug, but these are rare.`}
        </ColorDesc>
        <ColorDiv>
          <Purple /> - Unsynced.
        </ColorDiv>
        <ColorDesc>
          {`This does NOT necessarily mean there's a fork or a difference in consensus. It could be that the node is
        resynchronizing and will soon by synced again`}
        </ColorDesc>
        <ColorDiv>
          <Grey /> - err bp.json **.
        </ColorDiv>
        <ColorDesc>
          {`BPs marked in grey have incorrect or missing bp.json file. We do a period check. Also, we're only checking the
        top 60. `}
          <Link href="https://github.com/eosrio/bp-info-standard">More info</Link>
        </ColorDesc>
      </ColorsLegendDiv>
      <NoteDiv>
        <Note>
          <NoteNumber>NOTE 1:</NoteNumber> Many BPs use some load balancer with many nodes behind it. For this reason,
          even subsequent querries sometimes return different information.
        </Note>
        <Note>
          <NoteNumber>NOTE 2:</NoteNumber> We pull the list of node producers from `cleos system list producers`. We do
          this every several seconds.
        </Note>
      </NoteDiv>
    </LegendContainer>
  </Fragment>
);

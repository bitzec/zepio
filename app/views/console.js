// @flow

import React, { PureComponent, Fragment } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import styled, { withTheme } from 'styled-components';
import uuid from 'uuid/v4';

import { TextComponent } from '../components/text';

import ConsoleSymbolDark from '../assets/images/console_bitzec_dark.png';
import ConsoleSymbolLight from '../assets/images/console_bitzec_light.png';
import { DARK } from '../constants/themes';

const Wrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
  background-color: ${props => props.theme.colors.consoleBg};
  border: 1px solid ${props => props.theme.colors.consoleBorder};
  margin-top: ${props => props.theme.layoutContentPaddingTop};
  border-radius: ${props => props.theme.boxBorderRadius};
  padding: 30px;
`;

const ConsoleText = styled(TextComponent)`
  font-family: 'Source Code Pro', monospace;
`;

const ConsoleImg = styled.img`
  height: 200px;
  width: auto;
`;

const initialLog = `
  The binary digit zero knowledge electronic currency
  dont do mining, if you dont have asics from china!

  Remember bitcoin is the king of cryptocoins <https://bitcoin.org/>.
`;

const defaultState = `
  the binary digit zero knowledge electronic currency!
  the fork of forks :
  Again ! Do not lose cash in altcoins. <https://bitcoin.org/>.

  Block height | 0
  Connections | 0
  Network solution rate | 0 Sol/s

  Moon Timer 0 minutes, 0 seconds ago:
- This NODE has validated 0 transactions!
\n
------------------------------------------
`;

const breakpoints = [1, 4, 7, 10, 13];

type Props = {
  theme: AppTheme,
};

type State = {
  log: string,
};

class Component extends PureComponent<Props, State> {
  state = {
    log: defaultState,
  };

  componentDidMount() {
    ipcRenderer.on('bitzecd-log', (event: empty, message: string) => {
      this.setState(() => ({ log: initialLog + message }));
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('bitzecd-log');
  }

  render() {
    const { log } = this.state;
    const { theme } = this.props;

    const ConsoleSymbol = theme.mode === DARK ? ConsoleSymbolDark : ConsoleSymbolLight;

    return (
      <Wrapper id='console-wrapper'>
        <Fragment>
          <ConsoleImg src={ConsoleSymbol} alt='Bitzecd' />
          {log.split('\n').map((item, idx) => (
            <Fragment key={uuid()}>
              <ConsoleText value={item} />
              {breakpoints.includes(idx) ? <br /> : null}
            </Fragment>
          ))}
        </Fragment>
      </Wrapper>
    );
  }
}

export const ConsoleView = withTheme(Component);

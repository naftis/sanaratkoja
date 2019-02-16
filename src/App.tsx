import styled from '@emotion/styled/macro';
import React, { Component } from 'react';
import * as SolverService from './services/SolverService';

const Results = styled.div`
  padding: 2rem;
  background: linear-gradient(to right, #5e2a62, #633979);
  color: #fff;

  b {
    text-transform: uppercase;
    font-weight: normal;
    font-size: 0.8rem;
    letter-spacing: 0.05rem;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 0.25rem 0rem;
    }
  }
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
`;

const Box = styled.div`
  display: grid;
  grid-template-columns: 3rem 3rem 3rem 3rem;
  grid-template-rows: 3rem 3rem 3rem 3rem;
  grid-gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;

  input {
    border: 1px solid rgba(0, 0, 0, 0.15);
    text-align: center;
    font-size: 2rem;
    color: #838383;
    border-radius: 0.25rem;
    font-family: monospace;

    &:focus {
      outline-color: #ddd;
    }
  }
`;

interface IAppState {
  values: string[];
}

class App extends Component<{}, IAppState> {
  public state: IAppState = {
    values: [...Array(4 * 4)].map(() => '')
  };

  private inputRefs: Array<React.RefObject<HTMLInputElement>> = [
    ...Array(4 * 4)
  ].map(() => React.createRef());

  public render() {
    const { values } = this.state;

    return (
      <Container>
        <Results>
          <b>6 löydettyä sanaa</b>
          <ul>
            <li>kek</li>
            <li>jees</li>
            <li>jeesus</li>
            <li>jeesustelija</li>
            <li>jeesustelijoita</li>
          </ul>
        </Results>
        <Box>
          {this.inputRefs.map((ref, i) => (
            <input
              ref={ref}
              type="text"
              key={i}
              onChange={this.onChange(i)}
              value={values[i]}
            />
          ))}
        </Box>
      </Container>
    );
  }

  private solveBoard = () => {
    const { values } = this.state;

    const board = SolverService.convertFlatBoardTo2D(
      SolverService.lowerCaseFlatBoard(values)
    );
    console.log(SolverService.solveForBoard(board));
  };

  private onChange = (key: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { values } = this.state;
    const newValues = values.slice(0);

    newValues[key] = event.currentTarget.value.slice(-1).toLocaleUpperCase();

    this.setState({ values: newValues }, () => {
      const allValuesSet = newValues.every(letter => letter.length > 0);

      if (allValuesSet) {
        this.solveBoard();
      }
    });

    const nextInput =
      this.inputRefs[key + 1] && this.inputRefs[key + 1].current;

    if (nextInput) {
      nextInput.focus();
    }
  };
}

export default App;

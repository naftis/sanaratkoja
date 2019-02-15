import styled from '@emotion/styled/macro';
import React, { Component } from 'react';
import * as SolverService from './services/SolverService';

const Container = styled.div`
  display: grid;
  place-items: center center;
  height: 100vh;
`;

const Box = styled.div`
  display: grid;
  grid-template-columns: 3rem 3rem 3rem 3rem;
  grid-template-rows: 3rem 3rem 3rem 3rem;
  grid-gap: 0.5rem;
  padding: 1rem;
  background: #b5d9f8;
  border-radius: 0.5rem;

  input {
    border: 0;
    text-align: center;
    font-size: 2rem;
    color: #536f72;
    border-radius: 0.25rem;
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
        <Box>
          {this.inputRefs.map((ref, i) => (
            <input
              ref={ref}
              type="text"
              maxLength={1}
              key={i}
              onChange={this.onChange(i)}
              value={values[i]}
            />
          ))}
        </Box>
      </Container>
    );
  }

  private onChange = (key: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    SolverService.solveForBoard([['x']]);

    const { values } = this.state;
    const newValues = values.slice(0);

    newValues[key] = event.currentTarget.value.toLocaleUpperCase();

    this.setState({ values: newValues });

    const nextInput =
      this.inputRefs[key + 1] && this.inputRefs[key + 1].current;

    if (nextInput) {
      nextInput.focus();
    }
  };
}

export default App;

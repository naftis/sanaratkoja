import styled from '@emotion/styled/macro';
import groupBy from 'lodash/groupBy';
import React, { Component } from 'react';
import * as SolverService from './services/SolverService';

const convertNumberToXY = (i: number) => ({
  x: i % 4,
  y: Math.floor(i / 4)
});

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
    cursor: pointer;
    list-style: none;
    padding: 0;

    li {
      padding: 0.25rem 0rem;

      ul {
        padding-top: 0.25rem;
        padding-left: 0.5rem;
      }
    }
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
`;

const Box = styled.div`
  display: grid;
  grid-template-columns: 3rem 3rem 3rem 3rem;
  grid-template-rows: 3rem 3rem 3rem 3rem;
  grid-gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
`;

interface IInputProps {
  highlighted: boolean;
}

const Input = styled.input<IInputProps>`
  border: 1px solid rgba(0, 0, 0, 0.15);
  text-align: center;
  font-size: 2rem;
  color: #838383;
  border-radius: 0.25rem;
  font-family: monospace;

  &:focus {
    outline-color: #ddd;
  }

  ${props =>
    props.highlighted &&
    `
    background: rgba(0, 0, 0, 0.1);  
  `}
`;

interface IAppState {
  values: string[];
  results: SolverService.IResult[];
  openedWords: string[];
  highlightedPath: SolverService.ICoordinate[];
}

class App extends Component<{}, IAppState> {
  public state: IAppState = {
    highlightedPath: [],
    openedWords: [],
    results: [],
    values: [...Array(4 * 4)].map(() => '')
  };

  private inputRefs: Array<React.RefObject<HTMLInputElement>> = [
    ...Array(4 * 4)
  ].map(() => React.createRef());

  public render() {
    const { highlightedPath, openedWords, results, values } = this.state;

    const groupedResults = groupBy(results, 'word');
    const words = Object.keys(groupedResults).sort((a, b) => {
      return b.length - a.length;
    });

    return (
      <Container>
        <Results>
          <b>{words.length} löydettyä sanaa</b>
          <ul>
            {words.map((word, i) => (
              <li key={`${i}_${word}`} onClick={this.toggleWord(word)}>
                {word}

                {openedWords.includes(word) && (
                  <ul>
                    {groupedResults[word].map((result, path) => (
                      <li
                        key={`${i}_${word}_${path}`}
                        onClick={this.highlightPath(result.path)}
                      >
                        {result.word}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Results>
        <Box>
          {this.inputRefs.map((ref, i) => (
            <Input
              ref={ref}
              type="text"
              key={i}
              onChange={this.onChange(i)}
              value={values[i]}
              highlighted={highlightedPath.some(coordinate => {
                const coordinates = convertNumberToXY(i);

                return (
                  coordinates.x === coordinate.x &&
                  coordinates.y === coordinate.y
                );
              })}
            />
          ))}
        </Box>
      </Container>
    );
  }

  private toggleWord = (word: string) => () => {
    const { openedWords } = this.state;

    if (openedWords.includes(word)) {
      this.setState({
        openedWords: openedWords.filter(openedWord => openedWord !== word)
      });
    } else {
      this.setState({
        openedWords: [...openedWords, word]
      });
    }
  };

  private highlightPath = (path: SolverService.ICoordinate[]) => () => {
    this.setState({ highlightedPath: path });
  };

  private solveBoard = () => {
    const { values } = this.state;

    const board = SolverService.convertFlatBoardTo2D(
      SolverService.lowerCaseFlatBoard(values)
    );

    this.setState({
      results: SolverService.solveForBoard(board)
    });
  };

  private onChange = (key: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { values } = this.state;
    const newValues = values.slice(0);

    newValues[key] = event.currentTarget.value.slice(-1).toLocaleUpperCase();

    this.setState({ values: newValues, highlightedPath: [] }, () => {
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

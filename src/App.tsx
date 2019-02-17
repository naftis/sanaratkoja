import styled from '@emotion/styled/macro';
import chunk from 'lodash/chunk';
import findIndex from 'lodash/findIndex';
import groupBy from 'lodash/groupBy';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import * as SolverService from './services/SolverService';

const convertNumberToXY = (i: number) => ({
  x: i % 4,
  y: Math.floor(i / 4)
});

const convertCoordinatesToDirection = (
  fromCoordinate: SolverService.ICoordinate,
  toCoordinate: SolverService.ICoordinate
) =>
  (Math.atan2(
    toCoordinate.y - fromCoordinate.y,
    toCoordinate.x - fromCoordinate.x
  ) *
    180) /
  Math.PI;

const Results = styled.div`
  padding: 2rem;
  background: linear-gradient(to right, #5e2a62, #633979);
  color: #fff;

  > b {
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

const InputContainer = styled.div`
  position: relative;
`;

const Path = styled.div`
  position: absolute;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  font-size: 24px;
  font-weight: 100;
  width: 0;
  height: 0;
  overflow: visible;
  z-index: 1;
`;

const Up = styled(Path)`
  top: -1rem;
  left: 1rem;
`;

const UpRight = styled(Path)`
  transform: rotate(45deg);
  right: -0.4rem;
  top: -1rem;
`;

const Right = styled(Path)`
  transform: rotate(90deg);
  right: -1.25rem;
  top: 1rem;
`;

const RightDown = styled(Path)`
  transform: rotate(135deg);
  right: -1.25rem;
  bottom: -0.5rem;
`;

const Down = styled(Path)`
  transform: rotate(180deg);
  bottom: -1rem;
  left: 2.25rem;
`;

const DownLeft = styled(Path)`
  transform: rotate(-135deg);
  bottom: -1.25rem;
  left: -0.2rem;
`;

const Left = styled(Path)`
  transform: rotate(-90deg);
  left: -1rem;
  top: 2.25rem;
`;

const LeftUp = styled(Path)`
  transform: rotate(-45deg);
  left: -1rem;
  top: -0.1rem;
`;

const degreesToComponent: { [key: number]: JSX.Element } = {
  45: <RightDown>↑</RightDown>,
  90: <Down>↑</Down>,
  135: <DownLeft>↑</DownLeft>,
  180: <Left>↑</Left>,
  [-135]: <LeftUp>↑</LeftUp>,
  [-90]: <Up>↑</Up>,
  [-45]: <UpRight>↑</UpRight>,
  0: <Right>↑</Right>
};

interface IInputProps {
  highlighted: boolean;
  firstHighlighted: boolean;
}

const Input = styled.input<IInputProps>`
  width: 100%;
  height: 100%;
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

  ${props => props.firstHighlighted && `font-weight: bold; font-size: 2.5rem;`}
`;

interface IAppState {
  values: string[];
  results: SolverService.IResult[];
  openedWord?: string;
  highlightedPath: SolverService.ICoordinate[];
}

class App extends Component<{}, IAppState> {
  public state: IAppState = {
    highlightedPath: [],
    results: [],
    values: [...Array(4 * 4)].map(() => '')
  };

  private inputRefs: Array<React.RefObject<HTMLInputElement>> = [
    ...Array(4 * 4)
  ].map(() => React.createRef());

  public render() {
    const { highlightedPath, openedWord, results, values } = this.state;

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

                {openedWord === word && (
                  <>
                    &nbsp;⇲
                    <ul>
                      {groupedResults[word].map((result, path) => (
                        <li
                          key={`${i}_${word}_${path}`}
                          onClick={this.highlightPath(result.path)}
                        >
                          {isEqual(result.path, highlightedPath) ? (
                            <b>{result.word}</b>
                          ) : (
                            result.word
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Results>
        <Box>
          {this.inputRefs.map((ref, i) => {
            const isHighlighted = highlightedPath.find(coordinate => {
              const coordinates = convertNumberToXY(i);

              return (
                coordinates.x === coordinate.x && coordinates.y === coordinate.y
              );
            });

            const index = findIndex(highlightedPath, isHighlighted);

            let arrow = null;

            if (isHighlighted && highlightedPath.length - 1 > index) {
              const direction = convertCoordinatesToDirection(
                isHighlighted,
                highlightedPath[index + 1]
              );

              arrow = degreesToComponent[direction];
            }

            return (
              <InputContainer key={i}>
                {arrow}

                <Input
                  ref={ref}
                  type="text"
                  onChange={this.onChange(i)}
                  value={values[i]}
                  highlighted={Boolean(isHighlighted)}
                  firstHighlighted={
                    Boolean(isHighlighted) && Boolean(index === 0)
                  }
                />
              </InputContainer>
            );
          })}
        </Box>
      </Container>
    );
  }

  private toggleWord = (word: string) => () => {
    const { openedWord } = this.state;

    if (openedWord === word) {
      this.setState({ highlightedPath: [], openedWord: undefined });
    } else {
      this.setState({ highlightedPath: [], openedWord: word });
    }
  };

  private highlightPath = (path: SolverService.ICoordinate[]) => (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation();

    this.setState({ highlightedPath: path });
  };

  private solveBoard = () => {
    const { values } = this.state;

    const board = chunk(SolverService.lowerCaseFlatBoard(values), 4);

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

    if (!/^[A-ZÄÖÅ]$/.test(newValues[key])) {
      return;
    }

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

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  SimpleGrid,
  Stack,
  Button,
  Heading,
  Flex,
} from "@chakra-ui/react";

import styles from './Button.module.css'

const backgroundColorMap = {
  cell: "transparent",
  snake: "green",
  fruit: "red",
};

const INITIAL_DIRECTION = "ArrowRight";
const INITIAL_IS_PLAYING = false;
const INITIAL_GAME_OVER = false;
const INITIAL_SNAKE = [0, 1, 2];
const INITIAL_SCORE = 0;
const INITIAL_TIME_DELAY = 1000;
const GAMEBOARD_WIDTH = 10;
const CELL_WIDTH = 50;

const directionMap = {
  ArrowRight: 1,
  ArrowLeft: -1,
  ArrowDown: GAMEBOARD_WIDTH,
  ArrowUp: -GAMEBOARD_WIDTH,
};

const createGameboard = () => {
  const gameboard = [];
  for (let i = 0; i < GAMEBOARD_WIDTH * GAMEBOARD_WIDTH; i++) {
    gameboard.push("cell");
  }
  INITIAL_SNAKE.forEach((snake) => (gameboard[snake] = "snake"));
  gameboard[58] = "fruit";
  return gameboard;
};

export default function Home() {
  const [gameboard, setGameboard] = useState(createGameboard());
  const [isPlaying, setIsPlaying] = useState(INITIAL_IS_PLAYING);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [gameOver, setGameOver] = useState(INITIAL_GAME_OVER);
  const timeoutId = useRef();
  const score = useRef(INITIAL_SCORE);
  const time = useRef(INITIAL_TIME_DELAY);
  const previousDirection = useRef(INITIAL_DIRECTION);

  const handleKeydown = useCallback((evt) => {
    if (directionMap[evt.key]) {
      setDirection(evt.key);
    }
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    window.addEventListener("keydown", handleKeydown);
  };

  const resetGame = () => {
    score.current = INITIAL_SCORE;
    time.current = INITIAL_TIME_DELAY;
    clearTimeout(timeoutId.current);
    setIsPlaying(INITIAL_IS_PLAYING);
    setGameboard(createGameboard());
    setDirection(INITIAL_DIRECTION);
    setSnake(INITIAL_SNAKE);
    setGameOver(INITIAL_GAME_OVER);
    previousDirection.current = INITIAL_DIRECTION;
    window.removeEventListener("keydown", handleKeydown);
  };

  const move = () => {
    previousDirection.current = direction;
    const tempGameboard = [...gameboard];
    const tempSnake = [...snake];
    const newHead = tempSnake[tempSnake.length - 1] + directionMap[direction];
    tempSnake.push(newHead);
    if (tempGameboard[newHead] !== "fruit") {
      const cell = tempSnake.shift();
      tempGameboard[cell] = "cell";
    } else {
      // this means that the snake has captured the fruit
      score.current += 10;
      time.current = time.current <= 250 ? time.current : time.current - 75;
      tempGameboard[generateFruitIndex(tempSnake)] = "fruit";
    }

    // game should be over if snake runs into itself
    if (tempSnake.indexOf(newHead) !== tempSnake.lastIndexOf(newHead)) {
      setGameOver(true);
    }

    // game over when snake crosses the border.
    if (direction === "ArrowRight" && newHead % GAMEBOARD_WIDTH === 0) {
      setGameOver(true);
      return;
    }

    if (direction === "ArrowLeft" && (newHead + 1) % GAMEBOARD_WIDTH === 0) {
      setGameOver(true);
      return;
    }

    if (direction === "ArrowUp" && newHead < 0) {
      setGameOver(true);
      return;
    }

    if (direction === "ArrowDown" && newHead >= gameboard.length) {
      setGameOver(true);
      return;
    }

    tempGameboard[newHead] = "snake";
    setGameboard(tempGameboard);
    setSnake(tempSnake);
  };

  const generateFruitIndex = useCallback((tempSnake) => {
    let fruitIndex = Math.floor(Math.random() * gameboard.length);

    while (tempSnake.includes(fruitIndex)) {
      fruitIndex = Math.floor(Math.random() * gameboard.length);
    }
    return fruitIndex;
  }, []);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      if (direction !== previousDirection.current) {
        clearTimeout(timeoutId.current);
        move();
      } else {
        timeoutId.current = setTimeout(move, time.current);
      }
    }
  }, [snake, isPlaying, direction, gameOver]);

  return (
    <Stack alignItems="center" justifyContent="center" minHeight="100vh">
      <Flex alignItems="center">
        <SimpleGrid
          columns={GAMEBOARD_WIDTH}
          spacing={0}
          width={`${GAMEBOARD_WIDTH * CELL_WIDTH}px`}
          border="1px solid"
          borderColor={gameOver && "red"}
        >
          {gameboard.map((item, index) => (
            <Box
              width={`${CELL_WIDTH}px`}
              height={`${CELL_WIDTH}px`}
              background={backgroundColorMap[item]}
              key={index}
            />
          ))}
        </SimpleGrid>
        <Heading as="h3" size="lg" marginLeft={16} width="200px">
          Score: {score.current}
        </Heading>
      </Flex>
      {!isPlaying && (
        <Button size="lg" className={styles.btn1} onClick={startGame}>
          Start
        </Button>
      )}
      {isPlaying && (
        <Button size="lg" className={styles.btn2} onClick={resetGame}>
          Reset
        </Button>
      )}
    </Stack>
  );
}

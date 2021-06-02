import { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  SimpleGrid,
  Stack,
  Button,
  Heading,
  Flex,
} from "@chakra-ui/react";

const backgroundColorMap = {
  cell: "transparent",
  snake: "green",
  fruit: "red",
};

const directionMap = {
  ArrowRight: 1,
  ArrowLeft: -1,
  ArrowDown: 10,
  ArrowUp: -10,
};

const createGameboard = () => {
  const gameboard = ["snake", "snake", "snake"];
  for (let i = 3; i < 100; i++) {
    gameboard.push("cell");
  }
  gameboard[58] = "fruit";
  return gameboard;
};

export default function Home() {
  const [gameboard, setGameboard] = useState(createGameboard());
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState("ArrowRight");
  const [snake, setSnake] = useState([0, 1, 2]);
  const [gameOver, setGameOver] = useState(false);
  const timeoutId = useRef();
  const score = useRef(0);
  const time = useRef(1000);
  const previousDirection = useRef("ArrowRight");

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
    score.current = 0;
    time.current = 1000;
    clearTimeout(timeoutId.current);
    setIsPlaying(false);
    setGameboard(createGameboard());
    setDirection("ArrowRight");
    setSnake([0, 1, 2]);
    setGameOver(false);
    previousDirection.current = "ArrowRight";
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
    if (direction === "ArrowRight" && newHead % 10 === 0) {
      setGameOver(true);
      return;
    }

    if (direction === "ArrowLeft" && (newHead + 1) % 10 === 0) {
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
          columns={10}
          spacing={0}
          width="500px"
          border="1px solid"
          borderColor={gameOver && "red"}
        >
          {gameboard.map((item, index) => (
            <Box
              width="50px"
              height="50px"
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
        <Button size="lg" onClick={startGame}>
          Start
        </Button>
      )}
      {isPlaying && (
        <Button size="lg" onClick={resetGame}>
          Reset
        </Button>
      )}
    </Stack>
  );
}

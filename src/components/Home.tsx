import {
  Image,
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Input,
  Button,
  Flex,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useGameData from "../hooks/useGetGame";

const Home = () => {
  const { gameData, loading, error, refetch } = useGameData();
  const [answer, setAnswer] = useState("");
  const [lives, setLives] = useState(3);
  const [resultMessage, setResultMessage] = useState("");
  const [resultColor, setResultColor] = useState("teal.600");
  const [showNext, setShowNext] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!answer) {
      setResultMessage("Please enter an answer.");
      setResultColor("red.500");
      return;
    }

    const parsedAnswer = parseInt(answer, 10);
    if (isNaN(parsedAnswer) || parsedAnswer < 0) {
      setResultMessage("Please enter a valid positive number.");
      setResultColor("red.500");
      return;
    }

    if (parsedAnswer === gameData?.solution) {
      setResultMessage("That's Correct! You won!");
      setResultColor("green.500");
      setShowNext(true);
    } else {
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives > 0) {
        setResultMessage(`Incorrect. You have ${newLives} lives left.`);
        setResultColor("red.500");
      } else {
        setResultMessage(
          `Incorrect. You've run out of lives. The correct answer was ${gameData?.solution}.`
        );
        setResultColor("red.500");
        setShowNext(true);
      }
    }
  };

  const handleNext = async () => {
    resetGameState();
    await refetch();
  };

  const handleSkip = async () => {
    setResultMessage("Skipped! Try the next question.");
    setResultColor("gray.500");
    await handleNext();
  };

  const resetGameState = async () => {
    setAnswer("");
    setLives(3);
    setResultMessage("");
    setResultColor("teal.600");
    setShowNext(false);
    await refetch();
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const renderHearts = () => {
    const totalLives = 3;
    const hearts = [];
    for (let i = 0; i < totalLives; i++) {
      if (i < lives) {
        hearts.push(<FaHeart key={i} color="red" size="24" />);
      } else {
        hearts.push(<FaRegHeart key={i} color="gray" size="24" />);
      }
    }
    return hearts;
  };

  if (loading) {
    return (
      <Box
        textAlign="center"
        p={5}
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        p={5}
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Alert status="error" borderRadius="md" boxShadow="md">
          <AlertIcon />
          Error: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      p={5}
      bg="gray.50"
      minH="80vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading
          as="h1"
          mb={5}
          fontSize="3xl"
          textAlign="center"
          color="teal.600"
        >
          Welcome to Banana Game
        </Heading>
        <IconButton
          icon={<FiLogOut />}
          aria-label="Logout"
          colorScheme="teal"
          variant="outline"
          onClick={handleLogout}
        />
      </Flex>
      {gameData ? (
        <HStack spacing={5} width="full" align="stretch" height="full">
          <Flex
            width="60%"
            height="full"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src={gameData.question}
              alt="Game Question"
              borderRadius="md"
              objectFit="cover"
              width="100%"
              height="100%"
            />
          </Flex>

          <Flex
            direction="column"
            justifyContent="center"
            width="40%"
            height="full"
            borderWidth="1px"
            borderRadius="lg"
            padding="10"
            boxShadow="lg"
            bg="white"
          >
            <Flex mb={5} justifyContent="right">
              {renderHearts()}
            </Flex>
            <form onSubmit={handleSubmit}>
              <Input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                mb={5}
                variant="filled"
                borderColor="teal.300"
                _focus={{ borderColor: "teal.500" }}
                disabled={lives === 0 || showNext}
              />
              <Flex justifyContent="space-between">
                <Button
                  type="submit"
                  colorScheme="teal"
                  _hover={{ bg: "teal.600" }}
                  _active={{ bg: "teal.700" }}
                  isDisabled={lives === 0 || showNext}
                >
                  Submit
                </Button>
              </Flex>
            </form>
            <Text mt={3} color={resultColor}>
              {resultMessage}
            </Text>
            {showNext ? (
              <Button mt={3} colorScheme="green" onClick={handleNext}>
                Next
              </Button>
            ) : lives > 0 ? (
              <Button mt={3} colorScheme="gray" onClick={handleSkip}>
                Skip
              </Button>
            ) : null}
          </Flex>
        </HStack>
      ) : (
        <Text textAlign="center" fontSize="lg" color="gray.600">
          No game data available.
        </Text>
      )}
    </Box>
  );
};

export default Home;

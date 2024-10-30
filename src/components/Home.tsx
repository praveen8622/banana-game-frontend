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
} from "@chakra-ui/react";
import { useState, FormEvent } from "react";
import useGameData from "../hooks/useGetGame";

const Home = () => {
  const { gameData, loading, error, refetch } = useGameData();
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultColor, setResultColor] = useState("teal.600"); // Default color for the message

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (gameData && answer) {
      const parsedAnswer = parseInt(answer);

      if (parsedAnswer > 0) {
        // Check if the answer is a positive number
        if (parsedAnswer === gameData.solution) {
          setResultMessage(
            `That's Correct! You won! The correct answer is ${gameData.solution}.`
          );
          setResultColor("green.500");
        } else {
          setResultMessage(`Incorrect, try again.`);
          setResultColor("red.500");
        }
      } else {
        setResultMessage("Please enter a positive number.");
        setResultColor("red.500");
      }
    }
  };

  const handleSkip = async () => {
    setAnswer("");
    setSubmitted(false);
    setResultMessage("");
    setResultColor("teal.600");
    await refetch();
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
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Heading
        as="h1"
        mb={5}
        fontSize="3xl"
        textAlign="center"
        color="teal.600"
      >
        Game Data
      </Heading>
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
            <form onSubmit={handleSubmit}>
              <Input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                mb={3}
                variant="filled"
                borderColor="teal.300"
                _focus={{ borderColor: "teal.500" }}
              />
              <Flex justifyContent="space-between">
                <Button
                  type="submit"
                  colorScheme="teal"
                  _hover={{ bg: "teal.600" }}
                  _active={{ bg: "teal.700" }}
                >
                  Submit
                </Button>
                <Button
                  onClick={handleSkip}
                  colorScheme="gray"
                  variant="outline"
                >
                  Skip
                </Button>
              </Flex>
            </form>
            {submitted && (
              <Text mt={3} color={resultColor}>
                {resultMessage}
              </Text>
            )}
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

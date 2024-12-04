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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
} from "@chakra-ui/react";
import {
  FaHeart,
  FaRegHeart,
  FaTrophy,
  FaMedal,
  FaThumbsUp,
  FaClock,
} from "react-icons/fa";
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useGameData from "../hooks/useGetGame";

const Home = () => {
  const { gameData, isLoading, error, refetch, isFetching } = useGameData();
  const [answer, setAnswer] = useState("");
  const [lives, setLives] = useState(3);
  const [resultMessage, setResultMessage] = useState("");
  const [resultColor, setResultColor] = useState("teal.600");
  const [showNext, setShowNext] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [quickAnswerTime, setQuickAnswerTime] = useState<number | null>(null);
  const [level, setLevel] = useState(1); // Track the player's level
  const [timer, setTimer] = useState(60); // Timer state
  const [timerInterval, setTimerInterval] = useState<number | null>(null); // Timer interval for clearing
  const [timeUpModalOpen, setTimeUpModalOpen] = useState(false); // Modal state for Time up
  const [playerLevel, setPlayerLevel] = useState(1); // Track the player's level
  const [points, setPoints] = useState(0); // Track the player's points
  const [pointsForNextLevel, setPointsForNextLevel] = useState(500); // Points required for the next level

  const navigate = useNavigate();

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval); // Clear previous interval

    setTimer(60); // Reset to 60 seconds for every new question
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setTimeUpModalOpen(true); // Show "Time's Up" modal when time is over
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval); // Save interval reference to clear it when needed
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const startTime = Date.now();
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
      setCorrectStreak((prev) => prev + 1);
      setPoints((prev) => prev + 100);
      setPointsForNextLevel(500 * level);
      setQuickAnswerTime((Date.now() - startTime) / 1000);
      setLevel((prev) => prev + 1);
      setPlayerLevel((prev) => prev + (correctStreak % 5 === 0 ? 1 : 0)); // Increase level after every 5 consecutive correct answers
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setCorrectStreak(0);

      if (newLives > 0) {
        setResultMessage(`Incorrect. You have ${newLives} lives left.`);
        setResultColor("red.500");
      }
    }
  };

  const handleNext = async () => {
    setRoundsPlayed((prev) => prev + 1);
    resetGameState();
    await refetch();
    startTimer(); // Reset timer after every new question
    checkTimerDecrease(); // Check if we need to decrease the timer
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
    setQuickAnswerTime(null);
    await refetch();
  };

  const checkTimerDecrease = () => {
    if (correctStreak > 0 && correctStreak % 5 === 0) {
      setTimer((prev) => Math.max(prev - 15, 15)); // Decrease timer by 15 seconds after every 5 correct answers
    }
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

  const checkAchievements = () => {
    if (!achievements.includes("First Win") && correctStreak === 1) {
      setAchievements((prev) => [...prev, "First Win"]);
    }

    if (!achievements.includes("Streak Master") && correctStreak >= 5) {
      setAchievements((prev) => [...prev, "Streak Master"]);
    }

    if (!achievements.includes("Persistent Player") && roundsPlayed >= 10) {
      setAchievements((prev) => [...prev, "Persistent Player"]);
    }

    if (!achievements.includes("Life Saver") && lives === 3 && showNext) {
      setAchievements((prev) => [...prev, "Life Saver"]);
    }

    if (
      !achievements.includes("Quick Thinker") &&
      quickAnswerTime &&
      quickAnswerTime <= 10 &&
      correctStreak >= 5
    ) {
      setAchievements((prev) => [...prev, "Quick Thinker"]);
    }

    if (!achievements.includes("Comeback King") && lives === 1 && showNext) {
      setAchievements((prev) => [...prev, "Comeback King"]);
    }

    if (!achievements.includes("Perfectionist") && correctStreak >= 15) {
      setAchievements((prev) => [...prev, "Perfectionist"]);
    }
  };

  useEffect(() => {
    if (showNext) {
      checkAchievements();
    }
  }, [showNext, correctStreak, roundsPlayed, quickAnswerTime]);

  useEffect(() => {
    startTimer(); // Start timer when the component is mounted or question changes
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    }; // Cleanup on component unmount
  }, []);

  if (isLoading) {
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
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading
          as="h1"
          mb={5}
          fontSize="3xl"
          textAlign="center"
          color="teal.600"
        >
          Welcome to Banana Game
          <Text textAlign="left" fontSize="xl">
            Game - Level {level}
          </Text>
        </Heading>
        <Flex alignItems="center">
          <IconButton
            icon={<FiLogOut />}
            aria-label="Logout"
            colorScheme="teal"
            variant="outline"
            onClick={handleLogout}
            mr={2} // Margin to space out the icon and the text
          />
          <Text onClick={handleLogout} color="teal.700" cursor="pointer">
            Logout
          </Text>
        </Flex>
      </Flex>

      <Box textAlign="center" fontSize="xl" color="teal.600">
        <HStack spacing={2} justify="center">
          <FaClock size={24} />
          <Text>Timer: {timer} seconds</Text>
        </HStack>
      </Box>
      {gameData ? (
        <HStack spacing={5} width="full" align="stretch" height="full">
          <Flex direction="column" width="50%">
            <Image
              src={gameData.question}
              alt="Game Question"
              borderRadius="md"
              objectFit="cover"
              width="100%"
            />
            <Flex direction="column" mt={5}>
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
                  disabled={lives === 0 || showNext}
                  autoFocus
                />

                <Flex justifyContent="space-between" width="100%" mb={5}>
                  <Button
                    mt={3}
                    type="submit"
                    colorScheme="teal"
                    isDisabled={lives === 0 || showNext || isFetching}
                    width="48%"
                  >
                    Submit
                  </Button>

                  <Button
                    mt={3}
                    colorScheme="blue"
                    onClick={handleSkip}
                    width="48%"
                    isDisabled={lives === 0 || showNext || isFetching} // Disable when refetching
                  >
                    Skip
                  </Button>
                </Flex>
              </form>

              <Text mt={3} color={resultColor}>
                {resultMessage}
              </Text>

              {showNext && (
                <Button mt={3} colorScheme="green" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Flex>
          </Flex>

          <VStack align="left" spacing={6}>
            {/* Level and Points */}
            <Box
              textAlign="center"
              p={6}
              bg="teal.50"
              borderRadius="md"
              boxShadow="md"
              width="100%"
              maxWidth="200px"
            >
              <Heading as="h3" fontSize="2xl" color="teal.700" mb={2}>
                Level: {playerLevel}
              </Heading>
              <Text fontSize="lg" color="teal.600">
                Points: {points} / {pointsForNextLevel}
              </Text>
            </Box>

            {/* Achievements Section */}
            <Box
              width="800px"
              height="200px"
              p={5}
              bg="gray.100"
              borderRadius="md"
              boxShadow="md"
            >
              <Heading size="lg" mb={4} color="teal.700" textAlign="left">
                Achievements
              </Heading>
              <HStack spacing={6} wrap="wrap" justify="center">
                {achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <Box key={index}>
                      {/* Icon and Achievement Name */}
                      {achievement === "First Win" && (
                        <Box
                          p={5}
                          bg="yellow.100"
                          borderRadius="md"
                          boxShadow="md"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <FaTrophy color="gold" size="20" />
                          <Text
                            mt={1}
                            fontSize="sm"
                            color="gold"
                            textAlign="center"
                          >
                            {achievement}
                          </Text>
                        </Box>
                      )}

                      {achievement === "Streak Master" && (
                        <Box
                          p={5}
                          bg="gray.100"
                          borderRadius="md"
                          boxShadow="md"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <FaMedal color="silver" size="24" />
                          <Text
                            mt={2}
                            fontSize="sm"
                            color="silver"
                            textAlign="center"
                          >
                            {achievement}
                          </Text>
                        </Box>
                      )}

                      {achievement === "Quick Thinker" && (
                        <Box
                          p={5}
                          bg="blue.100"
                          borderRadius="md"
                          boxShadow="md"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <FaClock color="blue" size="24" />
                          <Text
                            mt={2}
                            fontSize="sm"
                            color="blue"
                            textAlign="center"
                          >
                            {achievement}
                          </Text>
                        </Box>
                      )}

                      {achievement === "Life Saver" && (
                        <Box
                          p={5}
                          bg="red.100"
                          borderRadius="md"
                          boxShadow="md"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <FaHeart color="red" size="24" />
                          <Text
                            mt={2}
                            fontSize="sm"
                            color="red"
                            textAlign="center"
                          >
                            {achievement}
                          </Text>
                        </Box>
                      )}

                      {achievement === "Comeback King" && (
                        <Box
                          p={5}
                          bg="green.100"
                          borderRadius="md"
                          boxShadow="md"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <FaThumbsUp color="green" size="24" />
                          <Text
                            mt={2}
                            fontSize="sm"
                            color="green"
                            textAlign="center"
                          >
                            {achievement}
                          </Text>
                        </Box>
                      )}

                      {achievement === "Perfectionist" && (
                        <Box
                          p={5}
                          bg="purple.100"
                          borderRadius="md"
                          boxShadow="md"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <FaTrophy color="purple" size="24" />
                          <Text
                            mt={2}
                            fontSize="sm"
                            color="purple"
                            textAlign="center"
                          >
                            {achievement}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500">No achievements yet</Text>
                )}
              </HStack>
            </Box>
          </VStack>
        </HStack>
      ) : (
        <Text>No game data available</Text>
      )}
      <Modal isOpen={timeUpModalOpen} onClose={() => setTimeUpModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Time's Up!</ModalHeader>
          <ModalBody>
            <Text fontSize="lg" textAlign="center">
              You ran out of time! The correct answer was: {gameData?.solution}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setTimeUpModalOpen(false);
                handleNext();
              }}
            >
              Try Again
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={lives === 0} onClose={resetGameState} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Game Over</ModalHeader>
          <ModalBody>
            <Text>
              You've run out of lives. The correct answer was
              {gameData?.solution}.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={resetGameState}>
              Restart Game
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;

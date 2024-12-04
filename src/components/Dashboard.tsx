import {
  Box,
  Button,
  Heading,
  Flex,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Avatar,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: "Prabin Karna",
    email: "karna@gmail.com",
    username: "prvn123",
    totalWins: 0,
    lastPlayed: Date.now(),
  };

  const handleStartGame = () => {
    navigate("/home");
  };

  const openProfile = () => {
    setIsProfileOpen(true);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      minH="80vh"
      maxWidth="800px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={5}
      borderRadius="lg"
    >
      <VStack
        bg="white"
        p={10}
        borderRadius="md"
        boxShadow="lg"
        spacing={6}
        align="center"
      >
        <Heading as="h1" size="lg" color="teal.700">
          Welcome to Banana Game
        </Heading>
        <Button
          colorScheme="teal"
          size="lg"
          onClick={handleStartGame}
          width="100%"
        >
          Start Game
        </Button>
        <Button colorScheme="blue" size="lg" onClick={openProfile} width="100%">
          Profile
        </Button>
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
      </VStack>

      {/* Profile Modal */}
      <Modal isOpen={isProfileOpen} onClose={closeProfile}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile</ModalHeader>
          <ModalBody>
            <Flex alignItems="center" mb={4}>
              <Avatar size="lg" name={user.name} />
              <Box ml={4}>
                <Heading size="md">{user.name}</Heading>
                <Text color="gray.500">@{user.username}</Text>
              </Box>
            </Flex>
            <VStack align="start" spacing={2}>
              <Text>
                <strong>Email:</strong> {user.email}
              </Text>
              <Text>
                <strong>Total Wins:</strong> {user.totalWins}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeProfile}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;

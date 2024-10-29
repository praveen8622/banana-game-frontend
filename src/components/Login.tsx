// components/Login.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  Text,
  InputGroup,
  Flex,
  Grid,
  Checkbox, // Importing Checkbox component
} from "@chakra-ui/react";
import useLogin from "../hooks/useLogin"; // Adjust the import according to your project structure

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const [isLoading, setIsLoading] = useState(false); // State for sign-up button loading
  const { login, loading, error } = useLogin();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(username, password);
  };

  const handleSignUp = () => {
    setIsLoading(true);
    // Simulate sign-up logic or redirect to sign-up page
    setTimeout(() => {
      setIsLoading(false);
      // Handle sign-up logic here
    }, 2000); // Simulate loading time
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="80vh" // Full viewport height for centering
      p={4}
    >
      <Flex
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg" // Optional: add shadow for better appearance
        overflow="hidden"
      >
        <Grid templateColumns="1fr 1fr" gap={0}>
          <Box
            p={10} // Adjust padding for consistency
            maxWidth="800px"
            borderRightWidth="1px" // Adding right border to separate the two boxes
          >
            <form onSubmit={handleLogin}>
              <Text
                fontSize="20"
                mb={10}
                textAlign="center"
                fontFamily="'Georgia', serif"
              >
                Please login to play the game
              </Text>

              <FormControl mb={4}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading} // Disable input when loading
                  width="full" // Fill the width of the box
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Show password if state is true
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading} // Disable input when loading
                    width="full" // Fill the width of the box
                  />
                </InputGroup>
                <Checkbox
                  mt={2}
                  isChecked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)} // Toggle show password
                >
                  Show Password
                </Checkbox>
              </FormControl>
              {error && (
                <Alert status="error" mb={4}>
                  {error}
                </Alert>
              )}
              <Button
                colorScheme="teal"
                isLoading={loading}
                type="submit"
                disabled={loading}
                width="full" // Full width for better usability
                mb={4} // Added margin for spacing
              >
                Login
              </Button>
            </form>
          </Box>
          <Box p={10} maxWidth="600px">
            <Text
              fontSize="4xl"
              mt={35}
              mb={5}
              textAlign="center"
              fontFamily="'Georgia', serif"
            >
              Welcome to Banana Game
            </Text>
            <Text mb={4} textAlign="center">
              Don't have an account?
              <Button
                variant="link"
                onClick={handleSignUp}
                isLoading={isLoading} // Loading state for sign-up button
                ml={1} // Add some space between text and button
              >
                Sign Up
              </Button>
            </Text>
          </Box>
        </Grid>
      </Flex>
    </Flex>
  );
};

export default Login;

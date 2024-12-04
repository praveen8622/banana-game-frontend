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
  Checkbox,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await login(username, password);
    if (response) {
      navigate("/dashboard");
    }
  };

  const handleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    navigate("/register");
  };

  return (
    <Flex justifyContent="center" alignItems="center" height="80vh" p={4}>
      <Flex
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
      >
        <Grid templateColumns="1fr 1fr" gap={0}>
          <Box p={10} maxWidth="800px" borderRightWidth="1px">
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
                  disabled={loading}
                  width="full"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    width="full"
                  />
                </InputGroup>
                <Checkbox
                  mt={2}
                  isChecked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
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
                width="full"
                mb={4}
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
                isLoading={isLoading}
                ml={1}
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

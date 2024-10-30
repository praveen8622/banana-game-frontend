// components/Register.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  Text,
  Flex,
  Grid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRegister";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await register(username, password);
  };

  const handleSignIn = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    navigate("/");
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
            <form onSubmit={handleRegister}>
              <Text
                fontSize="20"
                mb={10}
                textAlign="center"
                fontFamily="'Georgia', serif"
              >
                Register to start playing!
              </Text>

              <FormControl mb={4}>
                <FormLabel htmlFor="fullname">Full Name</FormLabel>
                <Input
                  id="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  disabled={loading}
                  width="full"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  width="full"
                />
              </FormControl>

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
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  width="full"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  width="full"
                />
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
                Register
              </Button>
            </form>
          </Box>

          <Box p={10} maxWidth="600px">
            <Text
              fontSize="4xl"
              mt={100}
              mb={5}
              textAlign="center"
              fontFamily="'Georgia', serif"
            >
              Join Banana Game!
            </Text>
            <Text mb={4} textAlign="center">
              Don't have an account?
              <Button
                variant="link"
                onClick={handleSignIn}
                isLoading={isLoading}
                ml={1}
              >
                Login
              </Button>
            </Text>
          </Box>
        </Grid>
      </Flex>
    </Flex>
  );
};

export default Register;

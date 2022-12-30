import React from 'react';
import {
  Box,
  Flex,
  Link as ChakraLink,
  IconButton,
  HStack,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import apiCall from '../helpers/apiCall';

const AuthURLS = [['/dashboard', 'Dashboard']];
const URLS = [
  ['/', 'Home'],
  ['/login', 'Login'],
  ['/register', 'Register'],
  ['/play', 'Play'],
];

const NavLink = ({ url }) => {
  return (
    <ChakraLink as={Link} to={`${url[0]}`} id={`${url[1]}`}>
      {url[1]}
    </ChakraLink>
  );
};

const NavBar = () => {
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem('authToken');

  // logout apiCall
  const logout = async () => {
    const response = await apiCall('admin/auth/logout', 'POST', {});
    if (response.ok) {
      sessionStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          _focus={{
            boxShadow: 'none',
          }}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>Big Brain</Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {authToken
              ? AuthURLS.map((url, index) => <NavLink url={url} key={index} />)
              : URLS.map((url, index) => <NavLink url={url} key={index} />)}
          </HStack>
        </HStack>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={5}>
            <Button
              display={authToken ? 'inline-block' : 'none'}
              onClick={logout}
              _focus={{
                boxShadow: 'none',
              }}
              id={'logoutButton'}
            >
              Logout
            </Button>
            <Button
              onClick={toggleColorMode}
              _focus={{
                boxShadow: 'none',
              }}
            >
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </Flex>
      </Flex>
      {isOpen && (
        <Box
          pb={4}
          display={{ md: 'none' }}
          _focus={{
            boxShadow: 'none',
          }}
        >
          <Stack as={'nav'} spacing={4}>
            {authToken
              ? AuthURLS.map((url, index) => <NavLink url={url} key={index} />)
              : URLS.map((url, index) => <NavLink url={url} key={index} />)}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

NavLink.propTypes = {
  url: PropTypes.array,
};

export default NavBar;

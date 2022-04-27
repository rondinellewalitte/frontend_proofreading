import { Flex, Box, Avatar, Text, Menu, MenuButton, MenuList, MenuItem, Button, IconButton, Icon, HStack } from "@chakra-ui/react";
import { useContext } from "react";
import { RiLogoutBoxFill, RiMenuLine, RiUserAddLine } from "react-icons/ri";
import { AuthContext } from "../../contexts/AuthContext";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { user, signOut } = useContext(AuthContext);

  return (

    <Flex align="center">
      {showProfileData && (
        < Box mr="4" textAlign="right">
          <Text>{user?.username}</Text>
          <Text color="gray.300" fontSize="small">{user?.email}</Text>
        </Box>
      )}

      <HStack spacing={["2", "4"]}>
        <Avatar size="md" />

        <Menu autoSelect={false} flip={true} offset={[-182, 20]}>
          <MenuButton

            as={IconButton}
            aria-label='Options'
            icon={<Icon as={RiMenuLine} fontSize="20" />}
            fontSize="20"
            bg="gray.900"
            _hover={{
              bg: "gray.900"
            }}
            _active={{
              bg: "gray.900"
            }}
          />
          <MenuList

            borderColor="pink.500"
            bg="pink.500"
            _active={{
              bg: "gray.900"
            }}
            _hover={{
              bg: "pink.500"
            }}
          >
            <MenuItem

              bg="pink.500"
              _hover={{
                bg: "pink.500"
              }}
              _active={{
                bg: "gray.900"
              }}
              onClick={signOut}
            >
              <Icon as={RiLogoutBoxFill} fontSize="20" />
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

    </Flex >

  );
}
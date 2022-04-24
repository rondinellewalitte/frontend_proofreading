import { Flex, Box, Avatar, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        < Box mr="4" textAlign="right">
          <Text>Rondinelle Walitte</Text>
          <Text color="gray.300" fontSize="small">rondinelle.walitte@gmail.com</Text>
        </Box>
      )}

      <Avatar size="md" />
    </Flex >
  );
}
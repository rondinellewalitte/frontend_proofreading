import { Box, Stack, Text, Link, Icon } from "@chakra-ui/react";
import { RiCommunityLine, RiContactsLine, RiDashboardLine, RiGitMergeLine, RiGroupLine, RiInputMethodLine } from "react-icons/ri";

export function Sidebar() {
  return (
    <Box as="aside" w="64" mr="8">
      <Stack spacing="12" align="flex-start">
        <Box>
          <Text fontWeight="bold" color="gray.400" fontSize="small">GERAL</Text>
          <Stack spacing="4" mt="8" align="stretch">
            <Link display="flex" color="pink.400">
              <Icon as={RiDashboardLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">Dashboard</Text>
            </Link>
            <Link display="flex" color="pink.400">
              <Icon as={RiContactsLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">Usuários</Text>
            </Link>
          </Stack>
        </Box>
        <Box>
          <Text fontWeight="bold" color="gray.400" fontSize="small">DADOS</Text>
          <Stack spacing="4" mt="8" align="stretch">
            <Link display="flex" color="pink.400">
              <Icon as={RiCommunityLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">Inserir Escola</Text>
            </Link>
            <Link display="flex" color="pink.400">
              <Icon as={RiGroupLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">Inserir Turma</Text>
            </Link>
          </Stack>
        </Box>
        <Box>
          <Text fontWeight="bold" color="gray.400" fontSize="small">PROVAS</Text>
          <Stack spacing="4" mt="8" align="stretch">
            <Link display="flex" color="pink.400">
              <Icon as={RiInputMethodLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">Inserir Aluno</Text>
            </Link>
            <Link display="flex" color="pink.400">
              <Icon as={RiGitMergeLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">Inserir Gabarito</Text>
            </Link>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
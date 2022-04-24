import { Stack } from "@chakra-ui/react";
import { RiDashboardLine, RiContactsLine, RiCommunityLine, RiGroupLine, RiInputMethodLine, RiGitMergeLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">Dashboard</NavLink>
        <NavLink icon={RiContactsLine} href="/users">Usuários</NavLink>
      </NavSection>
      <NavSection title="DADOS">
        <NavLink icon={RiCommunityLine} href="/school">Inserir Escola</NavLink>
        <NavLink icon={RiGroupLine} href="/room">Inserir Turma</NavLink>
      </NavSection>
      <NavSection title="PROVAS">
        <NavLink icon={RiInputMethodLine} href="/students">Inserir Aluno</NavLink>
        <NavLink icon={RiGitMergeLine} href="/students/correction">Inserir Gabarito</NavLink>
      </NavSection>
    </Stack >
  );
}
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AppShell, Burger, Group, Title, Button, UnstyledButton, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { ColorSchemeToggleButton } from '../ColorSchemeToggleButton/ColorSchemeToggleButton';
import WebsocketConnection from '../../layout/WebsocketConnection';

export function PageFrame(
  { bodyContent, navbarContent, asideContent, headerContent, footerContent }: {
    bodyContent: ReactNode,
    navbarContent: ReactNode,
    asideContent: ReactNode,
    headerContent: ReactNode,
    footerContent: ReactNode
  }
) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const [mobileAsideOpened, { toggle: toggleMobileAside }] = useDisclosure();
  const [desktopAsideOpened, { toggle: toggleDesktopAside }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      aside={{ width: 300, breakpoint: 'md', collapsed: { mobile: !mobileAsideOpened, desktop: !desktopAsideOpened } }}
      padding="xl"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            <Image src='src/4gamerLogo.png' h={50}></Image>
            <UnstyledButton component={Link} to="/">
              <Title order={1}>4Gamer</Title>
            </UnstyledButton>
          </Group>
          {headerContent}
          <Group>
            <WebsocketConnection />
            <>
              {localStorage.getItem('accessToken') ?
                <Button
                  variant="filled"
                  component={Link}
                  to="/member"
                >
                  내 정보
                </Button>
                :
                <Button
                  variant="filled"
                  component={Link}
                  to="/login"
                >
                  로그인
                </Button>
              }
            </>
            <ColorSchemeToggleButton />
            <Burger opened={mobileAsideOpened} onClick={toggleMobileAside} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopAsideOpened} onClick={toggleDesktopAside} visibleFrom="sm" size="sm" />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navbarContent}
      </AppShell.Navbar>
      <AppShell.Aside p="md">
        {asideContent}
      </AppShell.Aside>
      <AppShell.Footer p="md">
        {footerContent}
      </AppShell.Footer>

      <AppShell.Main>
        {bodyContent}
      </AppShell.Main>
    </AppShell>
  );
}

import { AppShell, NavLink } from '@mantine/core';

import { PageFrame } from "../components/Common/PageFrame/PageFrame";
import { LoginContainer } from "../components/LoginContainer";

const LoginPage = () => {
  return (
    <>
      <PageFrame
        bodyContent={<section className="login-section">
          <LoginContainer />
        </section>} navbarContent={
                    <>
                      <AppShell.Section>
                        <NavLink component="a" href="/game-reviews" label="게임 리뷰 페이지" />
                      </AppShell.Section>
                    </>
                  } asideContent={undefined} headerContent={undefined} footerContent={undefined}      />
    </>
  );
};

export default LoginPage;

import { AppShell, NavLink } from '@mantine/core';

import { TopGameContainer } from "../components/TopGameContainer"
import { PageFrame } from "../components/Common/PageFrame/PageFrame";

const TopGamePage = () => {

  return (
    <>
      <PageFrame
        asideContent={<section className="TopGame-section">
          <TopGameContainer />
        </section>} navbarContent={
                    <>
                      <AppShell.Section>
                        <NavLink component="a" href="/game-reviews" label="게임 리뷰 페이지" />
                      </AppShell.Section>
                    </>
                  } bodyContent={undefined} headerContent={undefined} footerContent={undefined}      />
    </>
  );
};

export default TopGamePage;

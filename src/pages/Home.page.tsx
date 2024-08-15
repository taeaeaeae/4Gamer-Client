import { Text } from '@mantine/core';

import { TopGameContainer } from '@components/TopGameContainer';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { PageFrame } from '../components/Common/PageFrame/PageFrame';
// import { FeaturesCards } from '../components/FeaturesCards/FeaturesCards';

export function HomePage() {
  const homeBody = (
    <>
      <Welcome />
      {/* <FeaturesCards /> */}
      <ColorSchemeToggle />
    </>
  );

  const homeFooter = (
    <>
      <Text>4Gamer: From the gamer, Of the gamer, By the gamer, For the gamer.</Text>
    </>
  );

  return (
    <>
      <PageFrame
        bodyContent={homeBody}
        headerContent={undefined}
        footerContent={homeFooter}
        navbarContent={undefined}
        asideContent={<TopGameContainer />}
      />
    </>
  );
}

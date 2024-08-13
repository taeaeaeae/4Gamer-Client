import { TopGameContainer } from "../components/TopGameContainer"
import { PageFrame } from "../components/Common/PageFrame/PageFrame";

const TopGamePage = () => {

  return (
    <>
      <PageFrame
        asideContent={<section className="TopGame-section">
          <TopGameContainer />
        </section>} navbarContent={undefined} bodyContent={undefined} headerContent={undefined} footerContent={undefined}      />
    </>
  );
};

export default TopGamePage;

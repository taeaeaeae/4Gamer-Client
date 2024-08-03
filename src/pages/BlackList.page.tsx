import { PageFrame } from "../components/Common/PageFrame/PageFrame";
import { BlackListContainer } from "../components/BlackListContainer";

const BlackListPage = () => {

  return (
    <>
      <PageFrame
        bodyContent={<section className="blacklist-section">
          <BlackListContainer />
        </section>} navbarContent={undefined} asideContent={undefined} headerContent={undefined} footerContent={undefined}      />
    </>
  );
};

export default BlackListPage;

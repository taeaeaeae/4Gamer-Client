import { PageFrame } from "../components/Common/PageFrame/PageFrame";
import { MemberContainer } from "../components/MemberContainer";

const MemberPage = () => {

  return (
    <>
      <PageFrame
        bodyContent={<section className="member-section">
          <MemberContainer />
        </section>} navbarContent={undefined} asideContent={undefined} headerContent={undefined} footerContent={undefined}      />
    </>
  );
};

export default MemberPage;

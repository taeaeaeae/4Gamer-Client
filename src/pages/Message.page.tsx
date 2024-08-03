import  { MessageContainer } from "../components/MessageContainer";
import { PageFrame } from "../components/Common/PageFrame/PageFrame";

const MessagePage = () => {

  return (
    <>
      <PageFrame
        bodyContent={<section className="message-section">
          <MessageContainer />
        </section>} navbarContent={undefined} asideContent={undefined} headerContent={undefined} footerContent={undefined}      />
    </>
  );
};

export default MessagePage;

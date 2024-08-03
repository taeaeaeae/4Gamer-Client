import { PageFrame } from "../components/Common/PageFrame/PageFrame";
import { LoginContainer } from "../components/LoginContainer";

const LoginPage = () => {
  return (
    <>
      <PageFrame
        bodyContent={<section className="login-section">
          <LoginContainer />
        </section>} navbarContent={undefined} asideContent={undefined} headerContent={undefined} footerContent={undefined}      />
    </>
  );
};

export default LoginPage;

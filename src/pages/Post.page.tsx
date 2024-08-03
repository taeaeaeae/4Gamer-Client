import { PageFrame } from "../components/Common/PageFrame/PageFrame";
import { PostContainer } from "../components/PostContainer";

const PostPage = () => {

  return (
    <>
      <PageFrame
        bodyContent={<section className="post-section">
          <PostContainer />
        </section>} navbarContent={undefined} asideContent={undefined} headerContent={undefined} footerContent={undefined}      />
    </>
  );
};

export default PostPage;

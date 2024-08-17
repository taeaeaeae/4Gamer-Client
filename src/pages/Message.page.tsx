import { NavLink } from '@mantine/core';
import { Link } from 'react-router-dom';

import { MessageContainer } from '../components/MessageContainer';
import { PageFrame } from '../components/Common/PageFrame/PageFrame';

const MessagePage = () => (
  <>
    <PageFrame
      bodyContent={
        <section className="message-section">
          <MessageContainer />
        </section>
      }
      navbarContent={
        <>
          <NavLink component="a" href="/game-reviews" label="게임 리뷰 페이지" />
          <NavLink
            component={Link}
            to="../"
            relative="path"
            label="내 정보"
          />
          <NavLink
            component={Link}
            to="../posts"
            relative="path"
            label="내 게시물"
          />
          <NavLink
            component={Link}
            to="../message"
            relative="path"
            label="쪽지"
          />
          {/* <NavLink
            component={Link}
            to="/member/blacklist"
            label="차단"
          /> */}
        </>
      }
      asideContent={undefined}
      headerContent={undefined}
      footerContent={undefined}
    />
  </>
);

export default MessagePage;

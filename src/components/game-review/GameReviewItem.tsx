import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import GameReviewScore from './GameReviewScore';
import { dateFormat } from '../../util/dateUtil';
import { thumbsUpFill, thumbsUpBlank, thumbsDownFill, thumbsDownBlank } from '@/assets/index';
import './GameReviewItem.css';
import { deleteGameReview } from '@/api/GameReviewApi';
import { deleteGameReviewReaction, updateGameReviewReaction } from '@/api/VoteApi';

function GameReviewItem(item: GameReviewItem) {
  const navigate = useNavigate();
  const memberId = localStorage.getItem('4gamer_member_id');
  const [isThumbsUpOn, setIsThumbsUpOn] = useState(item.isUpvoting === true);
  const [isThumbsDownOn, setIsThumbsDownOn] = useState(item.isUpvoting === false);
  const [upvoteCount, setUpvoteCount] = useState(item.upvotes);
  const [downvoteCount, setDownvoteCount] = useState(item.downvotes);
  const [isRenderingComplete, setIsRenderingComplete] = useState(false);

  const toggleHandler = (value: string) => {
    setIsRenderingComplete(true);

    switch (value) {
      case 'thumbsUp': {
        const thumbsUp = !isThumbsUpOn;

        if (thumbsUp) {
          setUpvoteCount(upvoteCount + 1);
        } else {
          setUpvoteCount(upvoteCount - 1);
        }

        setIsThumbsUpOn(thumbsUp);

        if (isThumbsDownOn) {
          setIsThumbsDownOn(false);
          setDownvoteCount(downvoteCount - 1);
        }
        break;
      }
      case 'thumbsDown': {
        const thumbsDown = !isThumbsDownOn;

        if (thumbsDown) {
          setDownvoteCount(downvoteCount + 1);
        } else {
          setDownvoteCount(downvoteCount - 1);
        }

        setIsThumbsDownOn(thumbsDown);

        if (isThumbsUpOn) {
          setIsThumbsUpOn(false);
          setUpvoteCount(upvoteCount - 1);
        }

        break;
      }
    }
  };

  const updateVote = async () => {
    if (isThumbsUpOn) {
      await updateGameReviewReaction(item.id, true);
      return;
    }

    if (isThumbsDownOn) {
      await updateGameReviewReaction(item.id, false);
      return;
    }

    if (isRenderingComplete && isThumbsUpOn === false && isThumbsDownOn === false) {
      await deleteGameReviewReaction(item.id);
    }
  };

  localStorage.setItem(
    // TEST용
    'accessToken',
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiM2E3NzY5Ny1jMGY2LTQxNjMtOTRlNC0zYTk4NWM1NTE5ODkiLCJpc3MiOiI0Z2FtZXIuY29tIiwiaWF0IjoxNzIyMzE3MzYxLCJleHAiOjE3MjI5MjIxNjEsImVtYWlsIjoiaGVsbG91ODM2M0BuYXZlci5jb20iLCJyb2xlIjoiQ0hBTk5FTF9BRE1JTiJ9.Zx-UkKA_sCkytw3wJVvqrv5sQ3koyGTDDMj0xlDIgjw'
  );
  localStorage.setItem('4gamer_member_id', 'b3a77697-c0f6-4163-94e4-3a985c551989'); // TEST용

  useEffect(() => {
    if (isRenderingComplete) {
      updateVote();
    }
  }, [upvoteCount, downvoteCount]);

  return (
    <div className="game-review-item-container">
      <h2>{item.gameTitle}</h2>
      <div className="top-info">
        <div>
          <span>{dateFormat(item.createdAt)}</span>
          {item.memberId === memberId && (
            <div className="button-menu">
              <button
                type="button"
                onClick={() => {
                  navigate('/game-review/new', {
                    state: {
                      gameTitle: item.gameTitle,
                      point: item.point,
                      description: item.description,
                    },
                  });
                }}
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('정말 삭제하시겠습니까?')) {
                    deleteGameReview(String(item.id));
                    setTimeout(() => {
                      navigate('/game-reviews');
                    }, 500);
                  }
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <div className="width-125px">
          <GameReviewScore score={Number(item.point)} />
        </div>
      </div>
      <p className="description">{item.description}</p>
      <div className="votes">
        <div
          role="button"
          onClick={() => toggleHandler('thumbsUp')}
          onKeyDown={() => toggleHandler('thumbsUp')}
          tabIndex={0}
        >
          <img
            className="thumbs-icon"
            src={isThumbsUpOn ? thumbsUpFill : thumbsUpBlank}
            alt="추천"
          />
          <span>{upvoteCount}</span>
        </div>
        <div
          role="button"
          onClick={() => toggleHandler('thumbsDown')}
          onKeyDown={() => toggleHandler('thumbsDown')}
          tabIndex={0}
        >
          <img
            className="thumbs-icon"
            src={isThumbsDownOn ? thumbsDownFill : thumbsDownBlank}
            alt="비추천"
          />
          <span>{downvoteCount}</span>
        </div>
      </div>
    </div>
  );
}

export default GameReviewItem;

interface GameReviewItem {
  id: number;
  gameTitle: string;
  point: number;
  description: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  memberId: string;
  isUpvoting: boolean | undefined;
}

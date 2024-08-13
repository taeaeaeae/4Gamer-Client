import { useEffect, useRef, useState } from 'react';
import {
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
  IconThumbDownFilled,
} from '@tabler/icons-react';
import GameReviewScore from './GameReviewScore';
import { dateFormat } from '../../util/dateUtil';
import './GameReviewItem.css';
import { deleteGameReview } from '../../api/gameReviewApi';
import { deleteGameReviewReaction, updateGameReviewReaction } from '../../api/VoteApi';
import GameReviewInput from './GameReviewInput';

function GameReviewItem(item: GameReviewItem) {
  const memberId = localStorage.getItem('4gamer_member_id');
  const [isThumbsUpOn, setIsThumbsUpOn] = useState(item.isUpvoting === true);
  const [isThumbsDownOn, setIsThumbsDownOn] = useState(item.isUpvoting === false);
  const [upvoteCount, setUpvoteCount] = useState(item.upvotes);
  const [downvoteCount, setDownvoteCount] = useState(item.downvotes);
  const [isRenderingComplete, setIsRenderingComplete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [point, setPoint] = useState(item.point);
  const [description, setDescription] = useState(item.description);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [textAreaHeight, setTextAreaHeight] = useState(textAreaRef.current?.scrollHeight);

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

  const handleIsEditing = (isEditingState: boolean, info: GameReviewItem) => {
    setIsEditing(isEditingState);
    setPoint(~~info.point);
    setDescription(info.description);
  };

  useEffect(() => {
    if (isRenderingComplete) {
      updateVote();
    }
  }, [upvoteCount, downvoteCount]);

  useEffect(() => {
    setTextAreaHeight(textAreaRef.current?.scrollHeight);
  }, [isEditing, point, description]);

  if (!isEditing) {
    return (
      <div className="game-review-item-container">
        <h2>{item.gameTitle}</h2>
        <div className="top-info">
          <div>
            <span>{dateFormat(item.createdAt)}</span>
            {item.memberId === memberId && (
              <div className="button-menu">
                <button type="button" onClick={() => setIsEditing(true)}>
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('정말 삭제하시겠습니까?')) {
                      deleteGameReview(String(item.id));
                      window.location.reload();
                    }
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          <div className="width-125px">
            <GameReviewScore score={Number(point)} />
          </div>
        </div>
        <textarea
          className="description"
          ref={textAreaRef}
          style={{ height: textAreaHeight }}
          defaultValue={description}
          readOnly
        />
        <div className="votes">
          <div
            role="button"
            onClick={() => toggleHandler('thumbsUp')}
            onKeyDown={() => toggleHandler('thumbsUp')}
            tabIndex={0}
          >
            {isThumbsUpOn ? <IconThumbUpFilled /> : <IconThumbUp />}
            <span>{upvoteCount}</span>
          </div>
          <div
            role="button"
            onClick={() => toggleHandler('thumbsDown')}
            onKeyDown={() => toggleHandler('thumbsDown')}
            tabIndex={0}
          >
            {isThumbsDownOn ? <IconThumbDownFilled /> : <IconThumbDown />}
            <span>{downvoteCount}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GameReviewInput
      id={String(item.id)}
      gameTitle={item.gameTitle}
      point={String(point)}
      description={description}
      handleFunction={handleIsEditing}
    />
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

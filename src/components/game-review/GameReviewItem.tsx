import { useEffect, useRef, useState } from 'react';
import { Button, Group, Paper, Text, Textarea } from '@mantine/core';
import {
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
  IconThumbDownFilled,
} from '@tabler/icons-react';
import GameReviewScore from './GameReviewScore';
import { dateFormat } from '../../util/dateUtil';
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

  if (!isEditing) {
    return (
      <Paper bd="1px solid dark.9" mt={20} pl={20} pr={20}>
        <h2>{item.gameTitle}</h2>
        <Group justify="space-between">
          {item.memberId === memberId && (
            <Group>
              <span>{dateFormat(item.createdAt)}</span>
              <Button type="button" onClick={() => setIsEditing(true)} size="compact-xs">
                수정
              </Button>
              <Button
                type="button"
                size="compact-xs"
                onClick={() => {
                  if (window.confirm('정말 삭제하시겠습니까?')) {
                    deleteGameReview(String(item.id));
                    window.location.reload();
                  }
                }}
              >
                삭제
              </Button>
            </Group>
          )}
          <GameReviewScore score={Number(point)} />
        </Group>
        <Textarea defaultValue={description} readOnly autosize mt={20} mb={20} />
        <Group justify="flex-end" mb={20}>
          <Group
            align="center"
            role="button"
            onClick={() => toggleHandler('thumbsUp')}
            onKeyDown={() => toggleHandler('thumbsUp')}
            tabIndex={0}
          >
            {isThumbsUpOn ? <IconThumbUpFilled /> : <IconThumbUp />}
            <Text>{upvoteCount}</Text>
          </Group>
          <Group
            align="center"
            role="button"
            onClick={() => toggleHandler('thumbsDown')}
            onKeyDown={() => toggleHandler('thumbsDown')}
            tabIndex={0}
          >
            {isThumbsDownOn ? <IconThumbDownFilled /> : <IconThumbDown />}
            <Text>{downvoteCount}</Text>
          </Group>
        </Group>
      </Paper>
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

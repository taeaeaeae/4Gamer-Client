import { useEffect, useState } from 'react';
import { Table, Divider, Text } from '@mantine/core';
import { Game, GameC, getGameTop10, getFollowGameTop10 } from "../api/IgdbApi";

export function TopGameContainer() {
  const [games, setGames] = useState<{ rank: number; name: string; total_rating: number }[]>([]);
  const [gamesC, setGamesC] = useState<{ rank: number; name: string; hypes: number }[]>([]);
  const tableStyles = {
    th: {
      fontSize: '10px',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGameTop10();
        const data: Game[] = JSON.parse(response.body);
        const top10Games = data.map((game, index) => ({
          rank: index + 1,
          name: game.name,
          total_rating: game.total_rating,
        }));
        setGames(top10Games);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFollowGameTop10();
        const data: GameC[] = JSON.parse(response.body);
        const top10RecentGames = data.map((gameC, index) => ({
          rank: index + 1,
          name: gameC.name,
          hypes: gameC.hypes,
        }));
        setGamesC(top10RecentGames);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Text size="md" style={{ fontWeight: 700, marginBottom: '8px' }}>인기 게임 Top10</Text>
      <Table>
        <thead>
          <tr>
            <th style={tableStyles.th}>Rank</th>
            <th style={tableStyles.th}>Name</th>
            <th style={tableStyles.th}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.rank}>
              <td>{game.rank}</td>
              <td>{game.name}</td>
              <td>{game.total_rating.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Divider my="lg" />

      <Text size="md" style={{ fontWeight: 700, marginBottom: '8px' }}>최다 팔로우 게임 Top10</Text>
      <Table>
        <thead>
          <tr>
            <th style={tableStyles.th}>Rank</th>
            <th style={tableStyles.th}>Name</th>
            <th style={tableStyles.th}>Follower</th>
          </tr>
        </thead>
        <tbody>
          {gamesC.map((gameC) => (
            <tr key={gameC.rank}>
              <td>{gameC.rank}</td>
              <td>{gameC.name}</td>
              <td>{gameC.hypes.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

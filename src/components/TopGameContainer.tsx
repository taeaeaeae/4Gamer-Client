import { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { Game, getGameTop10 } from "../api/IgdbApi"

export function TopGameContainer() {
  const [games, setGames] = useState<{ rank: number; name: string; total_rating: number }[]>([]);
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

  return (
    <Table>
      <thead>
        <tr>
          <th style={tableStyles.th}>Rank</th>
          <th style={tableStyles.th}>Name</th>
          <th style={tableStyles.th}>평점</th>
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
  );
};

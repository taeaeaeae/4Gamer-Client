import { useState, useEffect } from 'react';
import {
    Table,
    ScrollArea,
    UnstyledButton,
    Group,
    Text,
    Center,
    TextInput,
    rem,
    Container,
    Button,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBoards, removeBoards } from '../../api/boardApi';
import { useIsRobot } from '../../api/captchaApi';
import { deleteChannel } from '../../api/channelApi';
import { PageFrame } from '../../components/Common/PageFrame/PageFrame';
import { TopPost } from '../../components/channels/topPost'

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th>
            <UnstyledButton onClick={onSort}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center>
                        <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

function filterData(data: Board[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        Object.keys(item).some((key) =>
            typeof item[key as keyof Board] === 'string' &&
            item[key as keyof Board].toString().toLowerCase().includes(query)
        )
    );
}

function sortData(
    data: Board[],
    payload: { sortBy: keyof Board | null; reversed: boolean; search: string }
) {
    const { sortBy, reversed, search } = payload;

    if (!sortBy) {
        return filterData(data, search);
    }

    return filterData(
        [...data].sort((a, b) => {
            const aValue = a[sortBy] as string;
            const bValue = b[sortBy] as string;
            if (reversed) {
                return bValue.localeCompare(aValue);
            }
            return aValue.localeCompare(bValue);
        }),
        search
    );
}

export function ChannelAdminPage() {
    const navigate = useNavigate();
    const { channelId } = useParams();
    const { checkIsRobot } = useIsRobot();

    const [sortedData, setSortedData] = useState<Board[]>([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<keyof Board | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await getBoards(channelId);
            setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search }));
        })();
    }, [channelId, sortBy, reverseSortDirection, search]);

    const setSorting = (field: keyof Board) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
    };

    const handleCreateClick = () => navigate(`/channels/${channelId}/boards/new`);

    const handleblackClick = () => navigate(`/blacklist/${channelId}`);

    const handleUpdateteClick = (boardId: string) => () => navigate(`/channels/${channelId}/boards/${boardId}/edit`);

    const handleUpdateteChannelClick = (id: any) => () => navigate(`/channels/${id}/edit`);

    const handleDeleteChannelClick = (channelId: any) => async () => {
        try {
            const result = await checkIsRobot();
            if (result.score < 0.8) {
                throw new Error('사람이 아님')
            }

            await deleteChannel(channelId);
            navigate(`/channels`);

        } catch (error) {
            console.error("Failed to check robot status:", error);
        }
    }
    const handleDeleteClick = (id: string) => async () => {

        try {
            const result = await checkIsRobot();
            if (result.score < 0.8) {
                throw new Error('사람이 아님')
            }

            await removeBoards(channelId, id);
            setSortedData((prev) => prev.filter((board) => board.id !== id));


        } catch (error) {
            console.error("Failed to check robot status:", error);
        }
    };

    const rows = sortedData.map((row) => (
        <Table.Tr key={row.id}>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.title}</Table.Td>
            <Table.Td>{row.updatedAt}</Table.Td>
            <Button onClick={handleUpdateteClick(row.id)} color="green" m={10}>수정하기</Button>
            <Button onClick={handleDeleteClick(row.id)} color="red">DELETE</Button>
        </Table.Tr>
    ));

    return (
        <>
            <PageFrame bodyContent={

                <Container fluid bg="var(--mantine-color-blue-light)">
                    <Group justify='space-between' m={10}>
                        <Text>게시판목록</Text>
                        <Group>
                            <Button onClick={handleblackClick} color="black" m={10}>차단목록</Button>
                            <Button onClick={handleUpdateteChannelClick(channelId)} color="green" m={10}>채널수정</Button>
                            <Button onClick={handleDeleteChannelClick(channelId)} color="red" m={10}>채널삭제</Button>
                            <Button onClick={handleCreateClick}>CREATE</Button>
                        </Group>
                    </Group>
                    <ScrollArea>
                        <TextInput
                            placeholder="Search by any field"
                            mb="md"
                            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
                            <Table.Thead>
                                <Table.Tr>
                                    <Th
                                        sorted={sortBy === 'id'}
                                        reversed={reverseSortDirection}
                                        onSort={() => setSorting('id')}
                                    >
                                        ID
                                    </Th>
                                    <Th
                                        sorted={sortBy === 'title'}
                                        reversed={reverseSortDirection}
                                        onSort={() => setSorting('title')}
                                    >
                                        Title
                                    </Th>
                                    <Th
                                        sorted={sortBy === 'updatedAt'}
                                        reversed={reverseSortDirection}
                                        onSort={() => setSorting('updatedAt')}
                                    >
                                        Updated At
                                    </Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows.length > 0 ? (
                                    rows
                                ) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={4}>
                                            <Text fw={500} ta="center">
                                                Nothing found
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Container>


            } navbarContent={undefined} asideContent={TopPost(channelId)} headerContent={undefined} footerContent={undefined}>

            </PageFrame>
        </>
    );
}

export default ChannelAdminPage;

export interface Board {
    id: string;
    title: string;
    updatedAt: string;
}
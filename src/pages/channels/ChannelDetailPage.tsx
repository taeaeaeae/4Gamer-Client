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
    Title
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBoards } from '../../api/boardApi';
import { getChannelItem } from '../../api/channelApi';
import { Channel } from '../../components/channels/channelitem';
import { PageFrame } from '@/components/Common/PageFrame/PageFrame';
import { getMemberInfo } from '../../api/member';
import { TopPost } from '../../components/channels/topPost'
import { TopGameContainer } from '@/components/TopGameContainer';

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

const ChannelDetailPage = () => {
    const navigate = useNavigate();
    const { channelId } = useParams();

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


    const handleUboardClick = (boardId: string) => () => navigate(`/channels/${channelId}/boards/${boardId}/posts`);

    const rows = sortedData.map((row) => (
        <Table.Tr key={row.id} onClick={handleUboardClick(row.id)} style={{ cursor: 'pointer' }}>
            <Table.Td>{row.title}</Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <PageFrame
                bodyContent={
                    <Container>
                        <Group justify='space-between' m={10}>
                            <Text>게시판목록</Text>
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
                                            sorted={sortBy === 'title'}
                                            reversed={reverseSortDirection}
                                            onSort={() => setSorting('title')}
                                        >
                                            Title
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




                }

                asideContent={<TopGameContainer></TopGameContainer>}
                navbarContent={<TopPost channelId={channelId} />}
                headerContent={undefined}
                footerContent={undefined}
            >
            </PageFrame>
        </>
    );
};

export default ChannelDetailPage;

export interface Board {
    id: string;
    title: string;
    updatedAt: string;
}
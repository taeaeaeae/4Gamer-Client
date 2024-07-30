import { Button, TextInput } from "@mantine/core";
import { useState, FormEvent } from "react";
import { createChannel } from "@/api/channelApi";

const ChannelInput: React.FC = () => {
    const [channelData, setChannelData] = useState<ChannelData>({
        title: "ㅁㄴㅇㄹ",
        gameTitle: "ㅁㄴㅇㄹ",
        introduction: "ㄴㅁㅇㄹ",
        alias: "ㅁㄴㅇㄹ",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setChannelData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await createChannel(channelData);
            alert("채널이 성공적으로 생성되었습니다!");
            // 입력 필드 초기화
            setChannelData({
                title: "",
                gameTitle: "",
                introduction: "",
                alias: "",
            });
        } catch (error) {
            console.error("채널 생성 오류:", error);
            alert("채널 생성에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                width: 480,
                margin: "auto",
            }}
        >
            <TextInput
                label="Title"
                name="title"
                placeholder="Enter channel title"
                value={channelData.title}
                onChange={handleChange}
                required
            />
            <TextInput
                label="Game Title"
                name="gameTitle"
                placeholder="Enter game title"
                value={channelData.gameTitle}
                onChange={handleChange}
                required
            />
            <TextInput
                label="Introduction"
                name="introduction"
                placeholder="Enter channel introduction"
                value={channelData.introduction}
                onChange={handleChange}
                required
            />
            <TextInput
                label="Alias"
                name="alias"
                placeholder="Enter channel alias"
                value={channelData.alias}
                onChange={handleChange}
                required
            />

            <Button variant="filled" type="submit" fullWidth>
                Submit
            </Button>
        </form>
    );
};

export default ChannelInput;

interface ChannelData {
    title: string;
    gameTitle: string;
    introduction: string;
    alias: string;
}
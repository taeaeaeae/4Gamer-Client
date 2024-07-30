import { Button, TextInput } from "@mantine/core";
import { useState, FormEvent } from "react";
import { createChannel } from "@/api/channelApi";

interface ChannelData {
    title: string;
    gameTitle: string;
    introduction: string;
    alias: string;
}

// Props 타입 정의
interface ChannelInputProps {
    channel: (data: ChannelData) => Promise<void>;
}

const ChannelInput: React.FC<ChannelInputProps> = ({ channel }) => {
    const [title, setTitle] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await channel({
                title,
                gameTitle: "", // 필요한 경우 초기값 설정
                introduction: "", // 필요한 경우 초기값 설정
                alias: "", // 필요한 경우 초기값 설정
            });
            alert("Channel 추가 완료!");
        } catch (error) {
            console.error("Channel 추가 중 오류 발생:", error);
        }

        setTitle(""); // 입력값 초기화
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
                placeholder="Enter your Channel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Button variant="filled" type="submit" fullWidth>
                Submit
            </Button>
        </form>
    );
};

export default ChannelInput;

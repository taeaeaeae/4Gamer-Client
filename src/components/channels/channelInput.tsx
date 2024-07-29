import { Button, TextInput } from "@mantine/core";
import { useState } from "react";
import { Channel } from './channelitem'

const ChannelInput = ({ channel: Channel }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await channel: Channel({
      title: String,
      gameTitle: String,
      introduction: String,
      alias: String
    });
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
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Text } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { DeleteIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import useGemini from "../hooks/useGemini";

const ChatWithGemini = () => {
  const { messages, loading, sendMessages, updateMessage } = useGemini();
  const [input, setInput] = useState("");

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => {
      elementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    });
    return <div ref={elementRef} />;
  };

  const generateStorylinePrompt = (storyline) => {
    return `
        I have the following storyline: 

        "${storyline}"

        Based on this storyline, can you help me identify:
        1. Game Name (suggest a good name on your own based on storyline)
        2. Main character names (if any,if not u can generate their names).
        3. The central theme or genre of the story.
        4. The roles or players involved in the story (e.g., hero, villain, sidekick, etc.).
        5. The game genre.
        6. The overall gameplay and how it works.
        7. The levels or stages in the game.
        8. Plot twists or surprises in the story.
        9. Interesting elements or unique features in the game.
        10.Villains or antagonists and their character design.

        Please give each of these responses in detail and other elements if you want to add.
    `;
  };

  const handleSend = async () => {
    if (!input) return;
    setInput("");
    const prompt = generateStorylinePrompt(input); // Generate the prompt based on user input
    updateMessage([
      ...messages,
      { role: "user", parts: [{ text: input }] },
    ]);
    sendMessages({ message: prompt, history: messages }); // Send this prompt to the AI
  };

  return (
    <>
      <Box
  className="w-[100%] self-center max-w-[1400px] m-4 overflow-auto rounded-lg h-[80%] items-center bg-gradient-to-br from-purple.800 via-purple.900 to-black"
  p={6}
  boxShadow="purple"
  border="3px solid rgba(255, 255, 255, 0.7)"
  borderRadius="xl"
>

        <Box className="overflow-auto px-10 py-4 flex flex-col space-y-4">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <RenderMessage
                loading={loading}
                key={index + message.role}
                messageLength={messages.length}
                message={message}
                msgIndex={index}
              />
            ))
          ) : (
            <Introduction />
          )}
          <AlwaysScrollToBottom />
        </Box>
      </Box>
      <Box className="flex max-w-[1400px] px-10 pt-2 w-[100%] self-center">
        <Box className="flex w-[100%] gap-2 justify-between items-center">
          <Textarea
            placeholder="Type a message"
            value={input || ""}
            sx={{
              resize: "none",
              padding: "12px 20px",
              background: "black", // Darker background
              border: "2px solid #444", // Dark border
              color: "#E0E0E0", // Soft text color
              borderRadius: "12px", // Round corners for input
              fontSize: "1rem",
              lineHeight: "1.5",
              _placeholder: {
                color: "#A0A0A0", // Lighter placeholder color
                fontStyle: "italic",
              },
              _focus: {
                outline: "none",
                borderColor: "#4B90FF", // Blue border on focus
                boxShadow: "0 0 8px rgba(75, 144, 255, 0.6)", // Subtle glow effect
              },
              _hover: {
                borderColor: "#4B90FF",
                backgroundColor: "#333",
              },
              height: "1.75rem",
            }}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            variant={"unstyled"}
          />
          <Box className="flex gap-2 flex-col">
            <Button
  colorScheme="green"
  border="2px solid #444"
  h="1.75rem"
  size="md"
  onClick={handleSend}
  rightIcon={<ArrowForwardIcon />}
  borderRadius="full"
  px={6}
  _hover={{
    bg: "green.500",
    boxShadow: "0 4px 8px rgba(0, 255, 255, 0.5)",
  }}
  _active={{
    bg: "teal.600",
  }}
  _focus={{
    boxShadow: "0 0 4px rgba(0, 255, 255, 0.6)",
  }}
  fontSize="md"
  transition="all 0.3s ease-in-out"
  _disabled={{
    bg: "gray.500",
    color: "gray.700",
    cursor: "not-allowed",
  }}
>
  Send
</Button>
            <Button
              color={"white"}
              _hover={{
                bg: "blue.400", // Merged hover styles
                borderColor: "#4B90FF", // Optional border change on hover
              }}
              variant={"outline"}
              h="1.75rem"
              size="sm"
              onClick={() => updateMessage([])}
              rightIcon={<DeleteIcon />}
              borderRadius="full"
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const Introduction = () => {
  const TextRenderer = (props) => {
    const { value = "", direction = "r", size = "large" } = props;
    return (
      <Text
        fontSize={size}
        bgGradient={`linear(to-${direction}, purple.100, purple.400)`}
        bgClip={"text"}
        fontWeight={"bold"}
      >
        {value}
      </Text>
    );
  };

  return (
    <Box className="flex flex-col items-center justify-center text-center">
      {/* Add the GameWeaver Logo */}
      <img src="src/icons/image.png" alt="GameWeaver Logo" />
      
      <TextRenderer value="Welcome to GameWeaver" size="4xl" />
      <TextRenderer value="I'm GameWeaver, a chatbot that can help you with all of your gameplays and storylines generation" direction={"l"} />
      <TextRenderer value="Type a message to get started" />
    </Box>
  );
};

const RenderMessage = ({ message, msgIndex, loading, messageLength }) => {
  const { parts, role } = message;

  const Loader = () =>
    msgIndex === messageLength - 1 && loading && (
      <Box className="flex self-start pt-2">
        <Box className="dot bg-blue-500" />
        <Box className="dot bg-blue-500" />
        <Box className="dot bg-blue-500" />
      </Box>
    );

  return parts.map((part, index) =>
    part.text ? (
      <>
        <Box
          as={motion.div}
          className={`flex overflow-auto max-w-[95%]  md:max-w-[96%] w-fit items-end my-2 p-2 px-4 rounded-lg ${
            role === "user" ? "self-end bg-purple-600 text-white " : "self-start bg-purple-200 text-black border-4 border-purple-700 rounded-lg"
          }`}
          initial={{ opacity: 0, scale: 0.5, y: 20, x: role === "user" ? 20 : -20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          key={index}
        >
          <ReactMarkdown
            className="text-sm"
            key={index + part.text}
            components={{
              p: ({ node, ...props }) => <Text {...props} className="text-sm" />,
              code: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="text-sm font-mono text-white bg-black rounded-md p-2 overflow-auto m-2"
                />
              ),
            }}
          >
            {part.text}
          </ReactMarkdown>
        </Box>
        <Loader />
      </>
    ) : (
      <Loader key={index + part.text} />
    )
  );
};

export default ChatWithGemini;

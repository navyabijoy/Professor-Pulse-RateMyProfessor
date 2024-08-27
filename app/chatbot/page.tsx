"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Button, Stack, TextField, IconButton, Typography, Paper } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

export default function ChatbotPage() {
  const { isSignedIn } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the Rate My Professor support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + chunk },
            ];
          });
        }
      }
    } catch (error) {
      console.error("Error processing the request:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgcolor: "black",
          color: "white",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            bgcolor: "grey.900",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Please sign in to use the chatbot
          </Typography>
          <Link href="/" passHref>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "blue.500",
                color: "white",
                "&:hover": { bgcolor: "blue.600" },
              }}
            >
              Go back to home
            </Button>
          </Link>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "black",
        color: "white",
      }}
    >
      <Box
        component="nav"
        sx={{
          p: 2,
          
        }}
      >
        <Link href="/" passHref>
          <Typography variant="h5" component="span" sx={{ fontWeight: "bold", cursor: "pointer" }}>
            ProfessorPulse
          </Typography>
        </Link>
      </Box>
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          m: 2,
          bgcolor: "black",
          color: "white",
        }}
      >
        <Typography variant="h4" gutterBottom>
        </Typography>
        <Stack
          direction="column"
          spacing={2}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            mb: 2,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: message.role === "assistant" ? "flex-start" : "flex-end",
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  radius: "60%",
                  bgcolor: message.role === "assistant" ? "grey.400" : "blue.500",
                }}
              >
                <Typography>{message.content}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about a professor..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "grey.700",
                },
                "&:hover fieldset": {
                  borderColor: "grey.500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "blue.500",
                },
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={!message.trim() || isLoading}
            sx={{
              bgcolor: "blue.500",
              color: "white",
              "&:hover": {
                bgcolor: "blue.600",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
}
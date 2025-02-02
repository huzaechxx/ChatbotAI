"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import axios from "axios";

// Define the Message type
interface Message {
  sender: string;
  text: string;
}

const ChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([]); // Explicitly type the state
  const [input, setInput] = useState("");
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null); // Store the current user safely
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("User logged out");
    router.push("/login");
  };

  // Ensure `localStorage` is accessed only on the client side
  useEffect(() => {
    const user = localStorage.getItem("currentuser");
    setCurrentUser(user);
  }, []);

  const sendMessage = async () => {
    if (input.trim()) {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const newMessages = [...messages, { sender: "user", text: input }];
      setMessages(newMessages);

      try {
        const res = await axios.post(
          "/api/chat",
          { prompt: input },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 15000, // 15 seconds timeout
          }
        );

        const data = res.data;

        const botResponse =
          data.generatedText || "Sorry, I couldn't get a response.";

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botResponse },
        ]);
      } catch (error) {
        console.error("Error submitting prompt:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "An error occurred. Please try again." },
        ]);
      }
      setHasSentMessage(true);
      setInput("");
    }
  };

  return (
    <>
      {/* Main Chat Area */}
      <div className="bg-gray-900 h-screen items-center">
        {/* Header */}
        {/* Logout Button */}
        <div className="flex justify-end pe-5 pt-5">
          <button
            className="bg-blue-500 text-white  px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <div className="flex justify-center">
          <div className="w-full">
            <h1
              style={{ paddingTop: hasSentMessage ? "1%" : "8%" }}
              className=" text-6xl text-center text-white"
            >
              {hasSentMessage ? "AI ChatBot!" : "Welcome to AI ChatBot!"}
            </h1>

            <div className="text-center flex justify-center">
              {/* Greeting */}
              {!hasSentMessage && (
                <div className="mt-10 flex text-center text-white">
                  <h2 className=" text-3xl text-center text-white">
                    Hello {currentUser}!
                  </h2>
                  <p className="ps-5 text-3xl text-center text-white">
                    How can I help you today?
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-10">
              {/* Chat Messages */}
              <div className="pt-10  rounded-2xl w-full max-w-6xl  px-6 bg-slate-600 sm:mx-6 md:mx-6 xs:mx-6">
                {hasSentMessage && (
                  <div className="max-h-96 overflow-y-auto border-b w-fullss border-gray-700 pb-4 mb-4 scrollbar-hidden">
                    <div>
                      {messages.map((message, index) => (
                        <div key={index} className="mx-5 mt-2 mb-2 ">
                          <p
                            className={`font-bold ${
                              message.sender === "user"
                                ? "text-blue-400"
                                : "text-green-400"
                            }`}
                          >
                            {message.sender === "user" ? "You" : "Bot"}:
                          </p>
                          <p className="text-white">
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input and Send Button */}
                <div className="pb-5 flex items-center w-full gap-2">
                  <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-600 w-96 rounded bg-gray-800 text-white"
                    placeholder="Enter prompt here..."
                  />
                  <button
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatApp;

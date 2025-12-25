import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, RotateCcw, Sparkles, User, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TypingIndicator } from "../../components/ui/TypingIndicator";
import { useAIChat, type ChatMessage } from "../../hooks/useAIChat";
import { cn } from "../../lib/utils";

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-3 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            isUser 
              ? "bg-secondary text-secondary-foreground" 
              : "gradient-ai text-primary-foreground"
          )}
        >
          {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-secondary text-secondary-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
          {message.isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1.5 h-4 ml-0.5 bg-current rounded-sm align-middle"
            />
          )}
        </p>
        <span className="text-xs opacity-50 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}

export function AIChatPanel() {
  const { messages, status, error, sendMessage, retry, clearChat } = useAIChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== "loading" && status !== "streaming") {
      sendMessage(input);
      setInput("");
    }
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const isDisabled = status === "loading" || status === "streaming";

  return (
    <Card className="flex flex-col h-[500px] overflow-hidden">
      {/* Header */}
      <CardHeader className="flex-row items-center justify-between space-y-0 px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-ai animate-glow-pulse">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Ask me anything about your data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea ref={scrollRef} className="h-full p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>

            {/* Loading State */}
            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="gradient-ai text-primary-foreground">
                    <Sparkles className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {status === "error" && error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={retry}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-secondary/20">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isDisabled ? "AI is thinking..." : "Type your message..."}
            disabled={isDisabled}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isDisabled || !input.trim()}
            className="gradient-ai text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          {["What are my top metrics?", "Generate a report", "Show trends"].map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setInput(suggestion)}
              disabled={isDisabled}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </form>
    </Card>
  );
}

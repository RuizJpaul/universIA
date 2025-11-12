interface ChatMessageProps {
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function ChatMessage({ type, content, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md px-4 py-3 rounded-lg ${
          type === "user"
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none"
        }`}
      >
        <p className="text-sm">{content}</p>
        <p className={`text-xs mt-1 ${type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

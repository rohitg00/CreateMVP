import ChatComponent from "@/components/Chat";

export default function ChatPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Chat with AI Models
      </h1>
      <ChatComponent />
    </div>
  );
}

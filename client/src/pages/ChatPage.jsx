import { useEffect } from 'react';
import { useConversationStore } from '../store/conversationStore';
import { ConversationSidebar } from '../features/chat/components/ConversationSidebar';
import { ChatPanel } from '../features/chat/components/ChatPanel';

export function ChatPage() {
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    sending,
    streaming,
    error,
    listLoading,
    fetchConversations,
    createConversation,
    loadConversation,
    deleteConversation,
    sendMessage,
    cancelGeneration,
    clearError,
  } = useConversationStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleCreate = async () => {
    await createConversation();
  };

  const handleSelect = (id) => {
    loadConversation(id);
  };

  const handleRetry = () => {
    clearError();
    if (activeConversation?._id) {
      loadConversation(activeConversation._id);
    } else {
      fetchConversations();
    }
  };

  return (
    <div className="flex h-full min-h-0">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversation?._id}
        listLoading={listLoading}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={deleteConversation}
      />
      <ChatPanel
        messages={messages}
        loading={loading}
        sending={sending}
        streaming={streaming}
        error={error}
        hasConversation={Boolean(activeConversation)}
        onSend={sendMessage}
        onCancel={cancelGeneration}
        onCreateConversation={handleCreate}
        onClearError={clearError}
        onRetry={handleRetry}
      />
    </div>
  );
}

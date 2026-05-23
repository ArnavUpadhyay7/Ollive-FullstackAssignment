import { useEffect, useState } from 'react';
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleCreate = async () => {
    await createConversation();
    setSidebarOpen(false);
  };

  const handleSelect = (id) => {
    loadConversation(id);
    setSidebarOpen(false);
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
    <div className="relative flex h-full min-h-0 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 md:relative md:translate-x-0 md:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConversation?._id}
          listLoading={listLoading}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onDelete={deleteConversation}
        />
      </div>

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
        onMenuOpen={() => setSidebarOpen(true)}
      />
    </div>
  );
}
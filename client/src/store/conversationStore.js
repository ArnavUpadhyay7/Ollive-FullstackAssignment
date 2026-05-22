import { create } from 'zustand';
import * as conversationService from '../services/conversationService';
import * as chatService from '../services/chatService';
import { createStreamReveal } from '../lib/streamReveal';

const TEMP_USER_PREFIX = 'temp-user-';
const TEMP_ASSISTANT_PREFIX = 'temp-assistant-';

let activeAbortController = null;
let activeStreamReveal = null;

function normalizeMessage(message) {
  return {
    _id: message._id,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp,
    conversationId: message.conversationId,
    isStreaming: false,
    isOptimistic: false,
  };
}

function cleanupGeneration() {
  activeAbortController?.abort();
  activeAbortController = null;
  activeStreamReveal?.stop();
  activeStreamReveal = null;
}

export const useConversationStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  loading: false,
  sending: false,
  streaming: false,
  error: null,
  listLoading: false,

  clearError: () => set({ error: null }),

  fetchConversations: async () => {
    set({ listLoading: true, error: null });
    try {
      const conversations = await conversationService.listConversations();
      set({ conversations, listLoading: false });
    } catch (err) {
      set({ error: err.message, listLoading: false });
    }
  },

  createConversation: async () => {
    set({ error: null });
    try {
      const conversation = await conversationService.createConversation();
      const { conversations } = get();
      set({
        conversations: [conversation, ...conversations],
        activeConversation: conversation,
        messages: [],
      });
      return conversation;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  loadConversation: async (id) => {
    if (!id) return;
    cleanupGeneration();
    set({ loading: true, error: null, sending: false, streaming: false });

    try {
      const data = await conversationService.getConversation(id);
      const { conversations } = get();
      const exists = conversations.some((c) => c._id === data._id);

      set({
        activeConversation: data,
        messages: (data.messages || []).map(normalizeMessage),
        loading: false,
        conversations: exists
          ? conversations.map((c) => (c._id === data._id ? { ...c, ...data } : c))
          : [data, ...conversations],
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteConversation: async (id) => {
    try {
      await conversationService.deleteConversation(id);
      const { conversations, activeConversation } = get();
      const nextConversations = conversations.filter((c) => c._id !== id);

      set({
        conversations: nextConversations,
        ...(activeConversation?._id === id
          ? { activeConversation: null, messages: [] }
          : {}),
      });
    } catch (err) {
      set({ error: err.message });
    }
  },

  sendMessage: async (content) => {
    const { activeConversation, messages } = get();
    if (!activeConversation?._id || !content.trim()) return;

    const conversationId = activeConversation._id;
    const tempUserId = `${TEMP_USER_PREFIX}${Date.now()}`;
    const tempAssistantId = `${TEMP_ASSISTANT_PREFIX}${Date.now()}`;

    cleanupGeneration();
    activeAbortController = new AbortController();

    const optimisticUser = {
      _id: tempUserId,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      conversationId,
      isOptimistic: true,
      isStreaming: false,
    };

    const optimisticAssistant = {
      _id: tempAssistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      conversationId,
      isOptimistic: true,
      isStreaming: true,
    };

    set({
      messages: [...messages, optimisticUser, optimisticAssistant],
      sending: true,
      streaming: true,
      error: null,
    });

    try {
      const result = await chatService.sendMessage({
        conversationId,
        message: content.trim(),
        signal: activeAbortController.signal,
      });

      const userMessage = normalizeMessage(result.userMessage);
      const assistantMessage = normalizeMessage({
        ...result.assistantMessage,
        isStreaming: true,
      });

      set((state) => ({
        messages: state.messages
          .filter((m) => m._id !== tempUserId && m._id !== tempAssistantId)
          .concat([userMessage, assistantMessage]),
        sending: false,
      }));

      activeStreamReveal = createStreamReveal((partial, done) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m._id === assistantMessage._id
              ? { ...m, content: partial, isStreaming: !done }
              : m
          ),
          streaming: !done,
        }));

        if (done) {
          activeStreamReveal = null;
        }
      });

      activeStreamReveal.start(assistantMessage.content);
    } catch (err) {
      const cancelled =
        err.original?.code === 'ERR_CANCELED' ||
        err.original?.name === 'CanceledError' ||
        err.message?.toLowerCase().includes('cancel');

      set((state) => ({
        messages: state.messages.filter(
          (m) => m._id !== tempAssistantId && (!cancelled || m._id !== tempUserId)
        ),
        sending: false,
        streaming: false,
        error: cancelled ? null : err.message,
      }));
    } finally {
      activeAbortController = null;
    }
  },

  cancelGeneration: async () => {
    const { activeConversation } = get();
    if (!activeConversation?._id) return;

    cleanupGeneration();

    set((state) => ({
      messages: state.messages.filter(
        (m) => !(m.isOptimistic && m.role === 'assistant') && !m.isStreaming
      ),
      sending: false,
      streaming: false,
    }));

    try {
      await chatService.cancelGeneration(activeConversation._id);
    } catch (err) {
      if (err.status !== 404) {
        set({ error: err.message });
      }
    }
  },

  reset: () => {
    cleanupGeneration();
    set({
      activeConversation: null,
      messages: [],
      loading: false,
      sending: false,
      streaming: false,
      error: null,
    });
  },
}));

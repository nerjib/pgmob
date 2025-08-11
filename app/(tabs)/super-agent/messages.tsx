import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import api from '@/services/api';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  receiver_name: string;
  message_type: string;
  content: string;
  read_status: boolean;
  created_at: string;
  parent_message_id: string | null;
}

export default function SuperAgentMessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [sendingReply, setSendingReply] = useState(false);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/super-agents/messages');
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await api.put(`/super-agents/messages/${messageId}/read`);
      // Optimistically update UI
      setMessages(prevMessages =>
        prevMessages.map(msg => (msg.id === messageId ? { ...msg, read_status: true } : msg))
      );
    } catch (err) {
      console.error('Failed to mark message as read:', err);
      Alert.alert('Error', 'Failed to mark message as read.');
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !selectedMessage) {
      Alert.alert('Error', 'Reply content and selected message are required.');
      return;
    }

    setSendingReply(true);
    try {
      await api.post('/super-agents/messages', {
        receiver_id: selectedMessage.sender_id, // Reply to the sender of the selected message
        message_type: 'reply',
        content: replyContent,
        parent_message_id: selectedMessage.id,
      });
      Alert.alert('Success', 'Reply sent successfully!');
      setReplyContent('');
      setSelectedMessage(null);
      fetchMessages(); // Refresh messages to show the new reply
    } catch (err) {
      console.error('Failed to send reply:', err);
      Alert.alert('Error', 'Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Messages & Notifications</Text>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`bg-white rounded-lg p-4 mb-3 shadow-sm border ${item.read_status ? 'border-gray-200' : 'border-blue-400'}`}
              onPress={() => {
                setSelectedMessage(item);
                if (!item.read_status) handleMarkAsRead(item.id);
              }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold text-gray-800">From: {item.sender_name || 'System'}</Text>
                {!item.read_status && (
                  <View className="px-2 py-1 rounded-full bg-blue-100">
                    <Text className="text-xs font-semibold text-blue-700">New</Text>
                  </View>
                )}
              </View>
              <Text className="text-gray-600 mb-1">Type: {item.message_type}</Text>
              <Text className="text-gray-800 mb-2">{item.content}</Text>
              <Text className="text-gray-500 text-xs">{new Date(item.created_at).toLocaleString()}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-500">No messages or notifications.</Text>
            </View>
          )}
        />

        {selectedMessage && (
          <View className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-2">Reply to {selectedMessage.sender_name || 'System'}</Text>
            <TextInput
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 mb-3"
              placeholder="Type your reply..."
              multiline
              value={replyContent}
              onChangeText={setReplyContent}
            />
            <TouchableOpacity
              className="w-full bg-blue-600 p-3 rounded-lg flex-row justify-center items-center"
              onPress={handleReply}
              disabled={sendingReply}
            >
              {sendingReply ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg font-semibold">Send Reply</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full bg-gray-400 p-3 rounded-lg flex-row justify-center items-center mt-2"
              onPress={() => setSelectedMessage(null)}
            >
              <Text className="text-white text-lg font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

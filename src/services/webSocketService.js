import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.subscribers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.userId = null;
    }

    // Kết nối WebSocket
    connect(userId) {
        return new Promise((resolve, reject) => {
            try {
                this.userId = userId;
                const socket = new SockJS('http://localhost:8080/ws');
                this.stompClient = Stomp.over(socket);

                // Tắt debug logs
                this.stompClient.debug = () => { };

                const connectCallback = (frame) => {
                    console.log('Connected to WebSocket:', frame);
                    this.connected = true;
                    this.reconnectAttempts = 0;

                    // Subscribe to user's conversations updates
                    this.subscribeToConversations(userId);

                    resolve(frame);
                };

                const errorCallback = (error) => {
                    console.error('WebSocket connection error:', error);
                    this.connected = false;

                    // Thử reconnect
                    this.handleReconnect();
                    reject(error);
                };

                this.stompClient.connect({}, connectCallback, errorCallback);
            } catch (error) {
                console.error('Error creating WebSocket connection:', error);
                reject(error);
            }
        });
    }

    // Ngắt kết nối
    disconnect() {
        if (this.stompClient && this.connected) {
            this.stompClient.disconnect();
            this.connected = false;
            this.subscribers.clear();
            console.log('Disconnected from WebSocket');
        }
    }

    // Xử lý reconnect
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

            setTimeout(() => {
                this.connect(this.userId).catch(() => {
                    console.log('Reconnection failed');
                });
            }, this.reconnectInterval);
        }
    }

    // Subscribe to conversations updates
    subscribeToConversations(userId) {
        if (!this.connected || !this.stompClient) return;

        const subscription = this.stompClient.subscribe(
            `/topic/conversations/${userId}`,
            (message) => {
                try {
                    const conversations = JSON.parse(message.body);
                    this.notifySubscribers('conversations', conversations);
                } catch (error) {
                    console.error('Error parsing conversations message:', error);
                }
            }
        );

        this.subscribers.set('conversations', subscription);
    }

    // Subscribe to messages in a specific conversation
    subscribeToMessages(conversationId, userId) {
        if (!this.connected || !this.stompClient) return;

        const subscriptionKey = `messages_${conversationId}`;

        // Unsubscribe existing subscription if any
        this.unsubscribeFromMessages(conversationId);

        const subscription = this.stompClient.subscribe(
            `/topic/messages/${conversationId}/${userId}`,
            (message) => {
                try {
                    const messages = JSON.parse(message.body);
                    this.notifySubscribers('messages', { conversationId, messages });
                } catch (error) {
                    console.error('Error parsing messages:', error);
                }
            }
        );

        this.subscribers.set(subscriptionKey, subscription);
    }

    // Unsubscribe from messages
    unsubscribeFromMessages(conversationId) {
        const subscriptionKey = `messages_${conversationId}`;
        const subscription = this.subscribers.get(subscriptionKey);

        if (subscription) {
            subscription.unsubscribe();
            this.subscribers.delete(subscriptionKey);
        }
    }

    // Subscribe to typing indicators
    subscribeToTyping(conversationId) {
        if (!this.connected || !this.stompClient) return;

        const subscriptionKey = `typing_${conversationId}`;

        const subscription = this.stompClient.subscribe(
            `/topic/typing/${conversationId}`,
            (message) => {
                try {
                    const typingData = JSON.parse(message.body);
                    this.notifySubscribers('typing', { conversationId, ...typingData });
                } catch (error) {
                    console.error('Error parsing typing indicator:', error);
                }
            }
        );

        this.subscribers.set(subscriptionKey, subscription);
    }

    // Subscribe to online status
    subscribeToOnlineStatus() {
        if (!this.connected || !this.stompClient) return;

        const subscription = this.stompClient.subscribe(
            '/topic/online-status',
            (message) => {
                try {
                    const statusData = JSON.parse(message.body);
                    this.notifySubscribers('onlineStatus', statusData);
                } catch (error) {
                    console.error('Error parsing online status:', error);
                }
            }
        );

        this.subscribers.set('onlineStatus', subscription);
    }

    // Request conversations list
    requestConversations(userId) {
        if (this.connected && this.stompClient) {
            this.stompClient.send('/app/conversations/get', {}, JSON.stringify(userId));
        }
    }

    // Request messages for a conversation
    requestMessages(conversationId, userId, page = 0, size = 20) {
        if (this.connected && this.stompClient) {
            this.stompClient.send('/app/messages/get', {}, JSON.stringify({
                conversationId,
                userId,
                page,
                size
            }));
        }
    }

    // Send typing indicator
    sendTypingIndicator(conversationId, userId, isTyping) {
        if (this.connected && this.stompClient) {
            this.stompClient.send('/app/typing', {}, JSON.stringify({
                conversationId,
                userId,
                isTyping
            }));
        }
    }

    // Send online status
    sendOnlineStatus(userId, isOnline) {
        if (this.connected && this.stompClient) {
            this.stompClient.send('/app/online-status', {}, JSON.stringify({
                userId,
                isOnline
            }));
        }
    }

    // Event listener system
    listeners = new Map();

    addEventListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    removeEventListener(event, callback) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    notifySubscribers(event, data) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
    }

    // Check connection status
    isConnected() {
        return this.connected;
    }
}

// Singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;

// Chat functionality
function formatResponse(text) {
    // Convert markdown-like formatting to HTML
    let formatted = text
        // Code blocks (```code```)
        .replace(/```([\s\S]*?)```/g, '<div class="code-block">$1</div>')
        // Inline code (`code`)
        .replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>')
        // Bold (**text**)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic (*text*)
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Links [text](url)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="formatted-link" target="_blank">$1</a>')
        // Lists
        .replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>')
        // Quotes (> text)
        .replace(/^>\s+(.+)$/gm, '<div class="formatted-quote">$1</div>')
        // Line breaks
        .replace(/\n/g, '<br>');

    // Wrap lists in ul tags
    formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul class="formatted-list">$1</ul>');
    
    return formatted;
}

function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = isUser ? 'U' : 'AI';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = isUser ? content : formatResponse(content);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showLoading() {
    const chatMessages = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot';
    loadingDiv.id = 'loadingMessage';
    
    loadingDiv.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content">
            <div class="loading">
                Thinking
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideLoading() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const userMessage = document.getElementById('userMessage');
    const sendButton = document.getElementById('sendButton');
    const message = userMessage.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input and disable button
    userMessage.value = '';
    sendButton.disabled = true;
    
    // Show loading
    showLoading();
    
    try {
        const response = await fetch('/Chat/GetBotResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userMessage: message })
        });

        const data = await response.json();
        
        // Hide loading and add bot response
        hideLoading();
        addMessage(data.response);
        
    } catch (error) {
        hideLoading();
        addMessage('Sorry, I encountered an error. Please try again.');
        console.error('Error:', error);
    } finally {
        sendButton.disabled = false;
        userMessage.focus();
    }
}

// Auto-resize textarea
function initializeChat() {
    const messageInput = document.getElementById('userMessage');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
}); 
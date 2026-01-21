'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ChatMessage } from '@/types/intake';

export default function PatientIntakePage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [intakeId, setIntakeId] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not a patient
  useEffect(() => {
    if (user && user.role !== 'patient') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Load existing intake or create new one
  useEffect(() => {
    if (!token) return;

    const loadIntake = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/patient/intake', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to load intake');

        const data = await response.json();
        setIntakeId(data.id);
        setChatHistory(data.chatHistory);
        setIsComplete(data.isComplete);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load intake');
      } finally {
        setIsLoading(false);
      }
    };

    loadIntake();
  }, [token]);

  // Scroll to bottom when chat updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !intakeId || isSending) return;

    try {
      setIsSending(true);
      setError('');

      const response = await fetch('/api/patient/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intakeId,
          message: messageInput.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setChatHistory(data.chatHistory);
      setMessageInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleCompleteIntake = async () => {
    if (!intakeId) return;

    try {
      setShowAnalyzing(true);
      setError('');

      const response = await fetch('/api/patient/intake/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ intakeId }),
      });

      if (!response.ok) throw new Error('Failed to analyze intake');

      await response.json();
      setIsComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete intake');
    } finally {
      setShowAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading intake form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {/* Chat Messages */}
        {chatHistory.length > 0 ? (
          <div className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.timestamp && (
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading conversation...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Completion Status */}
      {isComplete && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ Your intake form has been completed and sent to the doctor for review.
          </p>
        </div>
      )}

      {/* Input Form */}
      {!isComplete ? (
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your response here..."
            disabled={isSending || showAnalyzing}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isSending || !messageInput.trim() || showAnalyzing}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      ) : null}

      {/* Complete Intake Button */}
      {!isComplete && chatHistory.length > 1 && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleCompleteIntake}
            disabled={showAnalyzing}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {showAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              'Complete Intake'
            )}
          </button>
          <p className="text-xs text-gray-500 flex items-center">
            Click when you&apos;re done sharing your information
          </p>
        </div>
      )}
    </div>
  );
}

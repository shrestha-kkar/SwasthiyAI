'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ChatMessage } from '@/types/intake';

// SVG Icons
const FormIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <FormIcon />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Intake Form</h1>
            <p className="text-gray-600 text-sm">Have a conversation with our AI assistant about your health</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Chat Messages */}
        {chatHistory.length > 0 ? (
          <div className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-lg px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.timestamp && (
                    <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {showAnalyzing && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-lg rounded-bl-none bg-gray-50 border border-gray-200 shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Starting conversation...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-white border border-red-200 text-red-800 rounded-xl font-medium flex items-start gap-3 shadow-sm">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertIcon />
          </div>
          <div>
            <p className="font-semibold mb-0.5">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Completion Status */}
      {isComplete && (
        <div className="p-4 bg-white border border-green-200 text-green-800 rounded-xl font-medium flex items-start gap-3 shadow-sm">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckIcon />
          </div>
          <div>
            <p className="font-semibold mb-0.5">Intake Complete</p>
            <p className="text-sm">Your intake form has been completed and sent to the doctor for review.</p>
          </div>
        </div>
      )}

      {/* Input Form */}
      {!isComplete ? (
        <form onSubmit={handleSendMessage} className="flex gap-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your response here..."
            disabled={isSending || showAnalyzing}
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed transition text-sm"
          />
          <button
            type="submit"
            disabled={isSending || !messageInput.trim() || showAnalyzing}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {isSending ? 'Sending...' : <SendIcon />}
          </button>
        </form>
      ) : null}

      {/* Complete Intake Button */}
      {!isComplete && chatHistory.length > 1 && (
        <div className="flex gap-2 bg-white p-4 rounded-lg border border-green-200 shadow-sm">
          <button
            onClick={handleCompleteIntake}
            disabled={showAnalyzing}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {showAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <CheckIcon />
                Complete Intake
              </>
            )}
          </button>
          <p className="text-xs text-gray-600 flex items-center">
            Click when you&apos;re done sharing your information
          </p>
        </div>
      )}
    </div>
  );
}

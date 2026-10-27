import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api';
import { translations } from '../../lib/translations';
import { 
  Mic, 
  MicOff, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  HardHat,
  IndianRupee,
  Clock,
  UserX,
  HelpCircle
} from 'lucide-react';

export default function WorkerSafeVoice({ onGrievanceCreated, onNavigate, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const [category, setCategory] = useState('safety');
  const [priority, setPriority] = useState('high');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('identified');
  const [confirmedByWorker, setConfirmedByWorker] = useState(false);

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // AI Classification state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [createdCase, setCreatedCase] = useState(null);
  const [error, setError] = useState('');

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setDescription(prev => transcript.trim());
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [lang]);

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert(t.micNotSupported);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      // Trigger AI analysis when speech stops
      triggerAiClassification(description);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Cannot start speech recognition:', err);
      }
    }
  };

  const triggerAiClassification = async (text) => {
    if (!text || text.trim().length < 8) return;
    try {
      setAiLoading(true);
      const res = await api.classifyAiGrievance(text);
      if (res.suggestion) {
        setAiSuggestion(res.suggestion);
        if (res.suggestion.suggestedCategory) {
          setCategory(res.suggestion.suggestedCategory);
        }
        if (res.suggestion.suggestedPriority) {
          setPriority(res.suggestion.suggestedPriority);
        }
      }
    } catch (err) {
      console.warn('AI classification fallback:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || description.trim().length < 5) {
      setError('Please provide at least 5 characters describing the issue.');
      return;
    }

    if (!confirmedByWorker) {
      setError('Please review your report and check the confirmation box before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        category,
        priority,
        description: description.trim(),
        aiSummary: aiSuggestion?.summary || null,
        visibility
      };

      const res = await api.submitGrievance(payload);
      setCreatedCase(res.grievance);
      if (onGrievanceCreated) onGrievanceCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'safety', label: t.categorySafety, icon: HardHat, color: 'var(--danger)' },
    { id: 'pay', label: t.categoryPay, icon: IndianRupee, color: 'var(--brand-700)' },
    { id: 'hours', label: t.categoryHours, icon: Clock, color: 'var(--warning)' },
    { id: 'harassment', label: t.categoryHarassment, icon: UserX, color: '#9333EA' },
    { id: 'other', label: t.categoryOther, icon: HelpCircle, color: 'var(--text-secondary)' }
  ];

  if (createdCase) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--success-bg)', 
          color: 'var(--success)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <CheckCircle size={36} />
        </div>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--brand-950)', marginBottom: '8px' }}>
          Report Lodged Successfully!
        </h2>
        <div style={{
          backgroundColor: 'var(--surface-muted)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          display: 'inline-block',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--brand-700)',
          marginBottom: '16px'
        }}>
          {t.caseNumber}: {createdCase.caseNumber}
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
          Your concern has been registered and assigned status: <strong>{createdCase.status?.toUpperCase()}</strong>. You can monitor investigator updates and notes anytime.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('reports')}
          >
            Track in My Reports
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setCreatedCase(null);
              setDescription('');
              setAiSuggestion(null);
              setConfirmedByWorker(false);
            }}
          >
            Submit Another Concern
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-950)' }}>
          {t.safeVoiceTitle}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t.safeVoiceSubtitle}
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Step 1: Category Selection */}
        <div className="card" style={{ padding: '20px' }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>
            1. Select Concern Category
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? `2px solid ${cat.color}` : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--brand-100)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={24} color={cat.color} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-950)', textAlign: 'center' }}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Speech or Text Entry */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              2. Describe What Happened
            </label>
            {speechSupported && (
              <button
                type="button"
                onClick={toggleRecording}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isRecording ? 'var(--danger-bg)' : 'var(--brand-100)',
                  color: isRecording ? 'var(--danger)' : 'var(--brand-800)',
                  border: isRecording ? '1px solid var(--danger)' : '1px solid var(--brand-600)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                {isRecording ? t.stopSpeaking : t.startSpeaking}
              </button>
            )}
          </div>

          {isRecording && (
            <div style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="pulsing-dot" />
              <strong>{t.listening}</strong>
            </div>
          )}

          <textarea
            rows={5}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.length > 20 && !isRecording) {
                // debounce ai classification
                clearTimeout(window.__aiTimer);
                window.__aiTimer = setTimeout(() => triggerAiClassification(e.target.value), 800);
              }
            }}
            placeholder={t.speakOrType}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              resize: 'vertical'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>{description.length} characters</span>
            <button
              type="button"
              onClick={() => triggerAiClassification(description)}
              style={{ color: 'var(--brand-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Sparkles size={12} /> Analyze with AI Assistant
            </button>
          </div>
        </div>

        {/* Step 3: AI Assistant Preview & Suggestion (Explicitly Labeled) */}
        {aiSuggestion && (
          <div style={{
            backgroundColor: 'var(--brand-100)',
            border: '1px solid var(--brand-600)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-950)', fontWeight: 700, fontSize: '0.9rem' }}>
              <Sparkles size={16} color="var(--brand-700)" />
              <span>SafeVoice AI Assistant Suggestion</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--brand-800)' }}>
              {aiSuggestion.explanation}
            </p>
            <div style={{ fontSize: '0.85rem', backgroundColor: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <strong>Structured Summary:</strong> {aiSuggestion.summary}
            </div>
          </div>
        )}

        {/* Step 4: Confidentiality & Priority */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority (Urgent Hazard)</option>
                <option value="urgent">Critical (Immediate Danger)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>
                Confidentiality Level
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                <option value="identified">Identified (Direct contact with officer)</option>
                <option value="confidential">Confidential (Name visible only to safety team)</option>
                <option value="anonymous">Anonymous (No name or worker ID recorded)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            <Info size={14} />
            <span>{t.privacyNotice}</span>
          </div>
        </div>

        {/* Confirmation Checkbox - Ethical AI Requirement */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
          <input
            type="checkbox"
            id="confirmReport"
            checked={confirmedByWorker}
            onChange={(e) => setConfirmedByWorker(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="confirmReport" style={{ fontSize: '0.9rem', color: 'var(--brand-950)', cursor: 'pointer', fontWeight: 500 }}>
            I have reviewed the text and category above and confirm this report is accurate.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !description || description.trim().length < 5 || !confirmedByWorker}
          className="btn btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
        >
          <Send size={18} />
          {submitting ? t.submitting : t.confirmAndSubmit}
        </button>
      </form>
    </div>
  );
}

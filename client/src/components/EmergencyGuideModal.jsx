import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  CheckCircle2,
  Clock,
  HelpCircle
} from 'lucide-react';

export const EmergencyGuideModal = ({ isOpen, onClose }) => {
  const [selectedTopic, setSelectedTopic] = useState('cardiac');

  if (!isOpen) return null;

  const topics = [
    {
      id: 'cardiac',
      title: 'Cardiac Arrest / Heart Attack',
      icon: Heart,
      color: '#DC2626',
      criticalAction: 'Begin Chest Compressions Immediately (100-120 bpm)',
      steps: [
        'Check consciousness: Gently shake shoulders and ask loudly "Are you okay?".',
        'Call for help: Ensure ambulance 108 is dispatched.',
        'Place heel of one hand in the center of the chest, place other hand on top and interlock fingers.',
        'Push hard and fast: Depress chest 2 to 2.4 inches (5-6 cm) to the beat of "Stayin Alive" (100-120 beats per minute).',
        'Do not interrupt compressions until the paramedic arrives or an AED is ready.',
        'If trained, perform 30 compressions followed by 2 rescue breaths.'
      ],
      warning: 'Do NOT give water, food, or aspirin if the person is unconscious or allergic.'
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding & Trauma',
      icon: AlertTriangle,
      color: '#EA580C',
      criticalAction: 'Apply Firm, Direct Continuous Pressure',
      steps: [
        'Use a clean cloth, sterile gauze, or clothing and press directly onto the wound.',
        'Maintain firm, continuous pressure with both hands for at least 5-10 minutes without lifting to check.',
        'If blood soaks through, DO NOT remove the first cloth — add more layers on top and press harder.',
        'Elevate the injured limb above heart level if no bone fracture is suspected.',
        'Keep patient calm, warm, and lying down to counter medical shock.'
      ],
      warning: 'Do NOT remove deeply embedded objects (glass, knife) — pad around them firmly instead.'
    },
    {
      id: 'choking',
      title: 'Choking & Airway Blockage',
      icon: Activity,
      color: '#7C3AED',
      criticalAction: '5 Back Blows followed by 5 Abdominal Thrusts (Heimlich)',
      steps: [
        'Ask "Are you choking?". If they can cough forcefully, encourage them to keep coughing.',
        'If they cannot breathe, speak, or make sounds: Stand behind them and lean them slightly forward.',
        'Deliver 5 firm back blows between shoulder blades with the heel of your hand.',
        'If still blocked: Stand behind, make a fist above the navel, grasp with other hand, and give 5 quick upward & inward abdominal thrusts.',
        'Repeat 5 back blows and 5 thrusts until object is expelled or help arrives.'
      ],
      warning: 'If patient becomes unconscious, lower to ground and begin CPR immediately.'
    },
    {
      id: 'seizure',
      title: 'Seizures & Loss of Consciousness',
      icon: Clock,
      color: '#2563EB',
      criticalAction: 'Protect the Head & Clear Surrounding Space',
      steps: [
        'Ease the person to the floor and place something soft (folded jacket) under their head.',
        'Clear away hard or sharp objects from the surroundings.',
        'Loosen tight neckwear (ties, collars, scarves) to facilitate breathing.',
        'Turn them gently onto their side (Recovery Position) once jerking stops to keep airway clear.',
        'Time the duration of the seizure.'
      ],
      warning: 'NEVER force anything into their mouth or try to restrain their violent movements.'
    },
    {
      id: 'burns',
      title: 'Severe Burns & Scalds',
      icon: Flame,
      color: '#D97706',
      criticalAction: 'Cool with Clean Running Tap Water for 20 Minutes',
      steps: [
        'Immediately cool the burn under gently running cool tap water for 15-20 minutes.',
        'Remove restrictive items (rings, watches, belts) before swelling occurs.',
        'Cover loosely with clean plastic cling wrap or sterile non-adherent dressing.',
        'Keep the rest of the patient warm to avoid hypothermia.'
      ],
      warning: 'Do NOT use ice, butter, toothpaste, or oil. Do NOT burst burn blisters.'
    }
  ];

  const current = topics.find(t => t.id === selectedTopic) || topics[0];
  const CurrentIcon = current.icon;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', padding: '1.75rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.45rem', backgroundColor: 'var(--primary-red-light)', borderRadius: '8px', color: 'var(--primary-red)' }}>
              <Heart size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-navy)', margin: 0 }}>
                While the Ambulance is En Route
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Crucial First-Aid Instructions for Caretakers & Bystanders
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)', padding: '0.3rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Topic Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          {topics.map((t) => {
            const isSelected = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: isSelected ? `2px solid ${t.color}` : '1px solid var(--border-light)',
                  backgroundColor: isSelected ? `${t.color}15` : 'var(--bg-light)',
                  color: isSelected ? t.color : 'var(--text-dark)',
                  cursor: 'pointer'
                }}
              >
                {t.title.split(' / ')[0]}
              </button>
            );
          })}
        </div>

        {/* Selected Topic Content */}
        <div style={{ backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <CurrentIcon size={24} color={current.color} />
            <h4 style={{ fontSize: '1.15rem', color: 'var(--secondary-navy)', margin: 0 }}>
              {current.title}
            </h4>
          </div>

          {/* Golden Rule Banner */}
          <div style={{
            backgroundColor: `${current.color}18`,
            borderLeft: `4px solid ${current.color}`,
            padding: '0.75rem 1rem',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            marginBottom: '1rem',
            fontWeight: 700,
            color: current.color,
            fontSize: '0.95rem'
          }}>
            ⚡ Priority Action: {current.criticalAction}
          </div>

          {/* Action Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {current.steps.map((st, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.88rem', color: '#374151', lineHeight: 1.5 }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '1.5px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {i + 1}
                </span>
                <span>{st}</span>
              </div>
            ))}
          </div>

          {/* Critical Caution Warning */}
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
            fontSize: '0.82rem',
            color: '#991B1B',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span><strong>Do Not:</strong> {current.warning}</span>
          </div>
        </div>

        {/* Footer info & close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Stay on line with ambulance dispatcher if instructed
          </span>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close & Back to Tracking
          </button>
        </div>

      </div>
    </div>
  );
};

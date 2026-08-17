import React, { useState } from 'react';
import { X, Clock, Plus, Save } from 'lucide-react';
import { logTime } from '../../lib/portalService';
import { TimeEntry } from '../../types';

interface TimeTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  milestoneId: string;
  userId: string;
  consultantName: string;
}

export const TimeTrackingModal: React.FC<TimeTrackingModalProps> = ({
  isOpen,
  onClose,
  projectId,
  milestoneId,
  userId,
  consultantName,
}) => {
  const [hours, setHours] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logTime({
        projectId,
        milestoneId,
        userId,
        consultantName,
        hours,
        description,
        date: new Date().toISOString(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to log time:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Log Time</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hours</label>
            <input 
              type="number" 
              min="0.5" 
              step="0.5" 
              value={hours} 
              onChange={e => setHours(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Time</>}
          </button>
        </form>
      </div>
    </div>
  );
};

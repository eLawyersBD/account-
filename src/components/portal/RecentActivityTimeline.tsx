import React from 'react';
import { ClientProject } from '../../types';
import { Activity } from 'lucide-react';

interface RecentActivityTimelineProps {
  projects: ClientProject[];
}

export const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({ projects }) => {
  const allUpdates = projects.flatMap(p => 
    p.recentUpdates?.map(update => ({ ...update, projectTitle: p.title })) || []
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Activity className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
      </div>
      <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
        {allUpdates.map((update, i) => (
          <div key={update.id} className="relative">
            <div className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-2 border-white ${i === 0 ? 'bg-blue-600' : 'bg-slate-300'}`} />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{update.text}</p>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>{update.author}</span>
                <span>•</span>
                <span>{update.projectTitle}</span>
                <span>•</span>
                <span>{update.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

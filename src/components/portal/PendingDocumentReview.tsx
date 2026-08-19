import React from 'react';
import { ClientDocument } from '../../types';
import { FileText, Clock, AlertCircle } from 'lucide-react';

interface PendingDocumentReviewProps {
  documents: ClientDocument[];
}

export const PendingDocumentReview: React.FC<PendingDocumentReviewProps> = ({ documents }) => {
  const pendingDocs = documents.filter(doc => doc.status === 'in_review');

  if (pendingDocs.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-amber-900">Pending Document Review</h3>
      </div>
      <div className="space-y-3">
        {pendingDocs.map(doc => (
          <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100">
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">{doc.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-amber-700">
              <Clock className="w-3 h-3" />
              <span>{doc.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

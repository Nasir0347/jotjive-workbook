import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WORKBOOK_CATALOG } from '../../config/workbookConfig';
import { generatePlaceholderCover } from '../../utils/coverGenerator';

export const CoverPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const workbook = WORKBOOK_CATALOG.find(w => w.id === id);

  if (!workbook) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Workbook Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find a workbook with ID: {id}</p>
        <button
          onClick={() => navigate('/select')}
          className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
        >
          Back to Selector
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen chalkboard-hero flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
        {/* Workbook Cover Image */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <img
            src={workbook.cover}
            alt={`${workbook.id} Cover`}
            className="w-full h-auto rounded-xl shadow-lg border-4 border-slate-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = generatePlaceholderCover(workbook.id);
            }}
          />
        </div>

        {/* Workbook ID */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
            {workbook.id}
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Digital Interactive Workbook
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/select')}
            className="flex-1 px-6 py-3 sm:py-4 rounded-xl border-2 border-slate-200 text-slate-700 text-base sm:text-lg font-bold hover:bg-slate-50 active:scale-95 transition-all"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate(`/workbook/${id}/viewer`)}
            className="flex-1 px-6 py-3 sm:py-4 rounded-xl bg-saas-blue text-white text-base sm:text-lg font-bold hover:bg-saas-blue/90 active:scale-95 transition-all shadow-lg shadow-saas-blue/30"
          >
            Start Learning →
          </button>
        </div>
      </div>
    </div>
  );
};

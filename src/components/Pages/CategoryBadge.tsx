import React from 'react';
import { detectCategory } from '../../config/categoryDetector';

interface CategoryBadgeProps {
  workbookId: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  workbookId,
  size = 'sm'
}) => {
  const category = detectCategory(workbookId);

  if (!category) return null;

  const sizeClasses = {
    sm: 'text-[8px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-1',
    lg: 'text-xs px-2.5 py-1.5'
  };

  // Simple mode badges - distinct colors per category
  if (category.mode === 'SIMPLE') {
    const colors: Record<string, string> = {
      'A': 'bg-purple-100 text-purple-700 border-purple-300',
      'R': 'bg-pink-100 text-pink-700 border-pink-300',
      'L': 'bg-green-100 text-green-700 border-green-300',
      'JJFR': 'bg-blue-100 text-blue-700 border-blue-300',
      'JJSEA': 'bg-amber-100 text-amber-700 border-amber-300'
    };

    const colorClass = colors[category.code] || 'bg-gray-100 text-gray-700 border-gray-300';

    return (
      <span className={`inline-block font-bold uppercase tracking-wide rounded border ${colorClass} ${sizeClasses[size]}`}>
        {category.name}
      </span>
    );
  }

  // Full mode badges - Grades 1-6
  return (
    <span className={`inline-block font-bold uppercase tracking-wide rounded border bg-slate-100 text-slate-700 border-slate-300 ${sizeClasses[size]}`}>
      {category.name}
    </span>
  );
};

export default CategoryBadge;

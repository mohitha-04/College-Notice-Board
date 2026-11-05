import React from 'react';
import { Department } from '../types/notice';
import { 
  Laptop, 
  Cpu, 
  Radio, 
  Zap, 
  Cog, 
  Building2, 
  GraduationCap, 
  LayoutGrid,
  RotateCcw
} from 'lucide-react';

interface DepartmentFilterProps {
  selectedDepartment: Department;
  onSelectDepartment: (dept: Department) => void;
  departmentCounts: Record<Department, number>;
}

interface DeptConfig {
  key: Department;
  label: string;
  fullName: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DEPARTMENTS: DeptConfig[] = [
  { key: 'All', label: 'All Departments', fullName: 'All Campus Notices', icon: LayoutGrid },
  { key: 'CSE', label: 'CSE', fullName: 'Computer Science & Engineering', icon: Laptop },
  { key: 'AIML', label: 'AIML', fullName: 'AI & Machine Learning', icon: Cpu },
  { key: 'ECE', label: 'ECE', fullName: 'Electronics & Communication', icon: Radio },
  { key: 'EEE', label: 'EEE', fullName: 'Electrical & Electronics', icon: Zap },
  { key: 'Mechanical', label: 'Mechanical', fullName: 'Mechanical Engineering', icon: Cog },
  { key: 'Civil', label: 'Civil', fullName: 'Civil Engineering', icon: Building2 },
  { key: 'General', label: 'General', fullName: 'Campus Administration & Exams', icon: GraduationCap }
];

export const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  selectedDepartment,
  onSelectDepartment,
  departmentCounts
}) => {
  return (
    <div className="mb-6">
      
      {/* Header and Reset Affordance */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Filter by Department
          </h2>
          <span className="text-xs text-slate-600 dark:text-slate-300">
            ({departmentCounts[selectedDepartment] || 0} notices)
          </span>
        </div>

        {selectedDepartment !== 'All' && (
          <button
            onClick={() => onSelectDepartment('All')}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to All</span>
          </button>
        )}
      </div>

      {/* Department Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DEPARTMENTS.map((dept) => {
          const isSelected = selectedDepartment === dept.key;
          const count = departmentCounts[dept.key] || 0;
          const Icon = dept.icon;

          return (
            <button
              key={dept.key}
              onClick={() => onSelectDepartment(dept.key)}
              title={dept.fullName}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm dark:bg-blue-600 dark:border-blue-500'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{dept.label}</span>
              <span
                className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-md ${
                  isSelected
                    ? 'bg-blue-700/60 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};

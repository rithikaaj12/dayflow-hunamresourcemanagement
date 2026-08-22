import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { AddEditTaskModal } from '../components/tasks/AddEditTaskModal';
import { StatsCard } from '../components/common/StatsCard';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  MoreVertical,
  Trash2,
  Edit2,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const Tasks: React.FC = () => {
  const { tasks, deleteTask, updateTask, moveTaskStatus } = useApp();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = departmentFilter === 'all' || t.department === departmentFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesDept && matchesPriority;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const reviewTasks = filteredTasks.filter((t) => t.status === 'review');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const totalEstHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const totalLoggedHours = tasks.reduce((sum, t) => sum + t.loggedHours, 0);
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setTaskToEdit(null);
  };

  const renderTaskCard = (task: Task) => {
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

    return (
      <div
        key={task.id}
        className="card-subtle p-5 rounded-2xl card-hover flex flex-col justify-between gap-3 group relative border border-slate-200/90"
      >
        <div>
          {/* Top meta */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <Badge variant="priority" value={task.priority} dot>
              {task.priority.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">{task.department}</span>
              <button
                onClick={() => handleEditTask(task)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-900 rounded-lg transition-opacity"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h4 className="text-xs font-black text-slate-900 leading-snug tracking-tight">{task.title}</h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
            {task.description}
          </p>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <img
              src={task.assignedTo.avatar}
              alt={task.assignedTo.name}
              title={task.assignedTo.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="text-[11px] font-bold text-slate-700 truncate max-w-[90px]">
              {task.assignedTo.name.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
                isOverdue ? 'text-rose-600' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-3 h-3 text-slate-400" />
              {task.dueDate}
            </span>

            {/* Quick Status Advance Button */}
            {task.status !== 'completed' && (
              <button
                onClick={() => {
                  const nextStatus: Record<TaskStatus, TaskStatus> = {
                    todo: 'in_progress',
                    in_progress: 'review',
                    review: 'completed',
                    completed: 'completed',
                  };
                  moveTaskStatus(task.id, nextStatus[task.status]);
                }}
                className="p-1 rounded-lg text-emerald-800 hover:bg-emerald-50 transition-colors"
                title="Advance to next workflow stage"
              >
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
            My Tasks & Workday Flow
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">
            Prioritize deliverables, track estimated hours, and maintain continuous delivery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center gap-1 text-xs font-black uppercase tracking-wider">
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-[11px] ${
                viewMode === 'board' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-slate-600 font-bold'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 stroke-[2.5]" /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-[11px] ${
                viewMode === 'list' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-slate-600 font-bold'
              }`}
            >
              <List className="w-3.5 h-3.5 stroke-[2.5]" /> List
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 text-emerald-300 stroke-[3]" /> Add Task
          </button>
        </div>
      </div>

      {/* Task Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks Active"
          value={tasks.length}
          subtitle={`${completedTasks.length} finished`}
          icon={CheckSquare}
          iconColor="text-indigo-700"
          iconBg="bg-indigo-50 border border-indigo-100"
          trend={{ value: `${completionPercentage}%`, isPositive: true, label: 'completion rate' }}
        />

        <StatsCard
          title="In Progress Sprint"
          value={inProgressTasks.length}
          subtitle="Actively flowing today"
          icon={Sparkles}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50 border border-emerald-100"
        />

        <StatsCard
          title="Total Logged Hours"
          value={`${totalLoggedHours}h / ${totalEstHours}h`}
          subtitle="Sprint velocity accuracy: 96%"
          icon={Clock}
          iconColor="text-teal-700"
          iconBg="bg-teal-50 border border-teal-100"
        />

        <StatsCard
          title="Urgent Deliverables"
          value={tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length}
          subtitle="Requiring immediate focus"
          icon={AlertCircle}
          iconColor="text-rose-700"
          iconBg="bg-rose-50 border border-rose-100"
          trend={{ value: 'Prioritized', isPositive: true }}
        />
      </div>

      {/* Filter Bar */}
      <div className="card-subtle p-4 lg:p-5 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by keyword, tag, or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl font-black uppercase tracking-wider text-[11px] text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Product">Product</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl font-black uppercase tracking-wider text-[11px] text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Column 1: To Do */}
          <div className="bg-slate-100/70 rounded-[32px] p-5 border border-slate-200/90 flex flex-col gap-3.5 min-h-[450px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">To Do</h3>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded-full">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {todoTasks.map(renderTaskCard)}
              {todoTasks.length === 0 && (
                <p className="text-center text-xs font-bold text-slate-400 py-10 uppercase tracking-wider">No tasks in backlog</p>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-slate-100/70 rounded-[32px] p-5 border border-slate-200/90 flex flex-col gap-3.5 min-h-[450px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">In Progress</h3>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded-full">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {inProgressTasks.map(renderTaskCard)}
              {inProgressTasks.length === 0 && (
                <p className="text-center text-xs font-bold text-slate-400 py-10 uppercase tracking-wider">No active tasks</p>
              )}
            </div>
          </div>

          {/* Column 3: In Review */}
          <div className="bg-slate-100/70 rounded-[32px] p-5 border border-slate-200/90 flex flex-col gap-3.5 min-h-[450px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Review & QA</h3>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                {reviewTasks.length}
              </span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {reviewTasks.map(renderTaskCard)}
              {reviewTasks.length === 0 && (
                <p className="text-center text-xs font-bold text-slate-400 py-10 uppercase tracking-wider">No tasks in review</p>
              )}
            </div>
          </div>

          {/* Column 4: Completed */}
          <div className="bg-slate-100/70 rounded-[32px] p-5 border border-slate-200/90 flex flex-col gap-3.5 min-h-[450px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Completed</h3>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full">
                {completedTasks.length}
              </span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {completedTasks.map(renderTaskCard)}
              {completedTasks.length === 0 && (
                <p className="text-center text-xs font-bold text-slate-400 py-10 uppercase tracking-wider">No completed tasks yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="card-subtle p-6 lg:p-7 rounded-[32px] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 rounded-l-2xl">Task Deliverable</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Assignee</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Logged / Est</th>
                <th className="py-3.5 px-4 rounded-r-2xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-black text-slate-900">{t.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">{t.description}</p>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-700">{t.department}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={t.assignedTo.avatar}
                        alt={t.assignedTo.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="font-bold text-slate-800">{t.assignedTo.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="priority" value={t.priority} dot>
                      {t.priority.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="status" value={t.status} dot>
                      {t.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-700">{t.dueDate}</td>
                  <td className="py-4 px-4 font-bold text-slate-800 font-mono">
                    {t.loggedHours}h / {t.estimatedHours}h
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEditTask(t)}
                        className="p-1.5 text-slate-400 hover:text-emerald-800 rounded-lg hover:bg-slate-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditTaskModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

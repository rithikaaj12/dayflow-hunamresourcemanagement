import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const { addTask, updateTask, employees } = useApp();

  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [department, setDepartment] = useState(taskToEdit?.department || 'Engineering');
  const [assigneeId, setAssigneeId] = useState(taskToEdit?.assignedTo?.id || 'emp-001');
  const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(taskToEdit?.status || 'todo');
  const [dueDate, setDueDate] = useState(taskToEdit?.dueDate || '2026-08-28');
  const [estimatedHours, setEstimatedHours] = useState(taskToEdit?.estimatedHours || 8);
  const [tagsInput, setTagsInput] = useState(taskToEdit?.tags?.join(', ') || 'Frontend, Architecture');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedEmployee = employees.find((emp) => emp.id === assigneeId) || employees[0];
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        description,
        department,
        assignedTo: {
          id: selectedEmployee.id,
          name: selectedEmployee.name,
          avatar: selectedEmployee.avatar,
          role: selectedEmployee.role,
        },
        priority,
        status,
        dueDate,
        estimatedHours: Number(estimatedHours),
        tags,
      });
    } else {
      addTask({
        title,
        description,
        department,
        assignedTo: {
          id: selectedEmployee.id,
          name: selectedEmployee.name,
          avatar: selectedEmployee.avatar,
          role: selectedEmployee.role,
        },
        priority,
        status,
        dueDate,
        estimatedHours: Number(estimatedHours),
        loggedHours: 0,
        tags,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task Alignment' : 'Create New Workday Task'}
      subtitle="Define actionable deliverables, flow priorities, and assignees."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement Webhook Dispatch Service"
            className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed requirements, acceptance criteria, or reference links..."
            className="w-full p-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="Engineering">Engineering</option>
              <option value="Design">Design & UX</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Product">Product Management</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Status Stage
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Est. Hours
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Backend, API, Security"
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-2xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#245741] active:bg-[#153427] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
          >
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

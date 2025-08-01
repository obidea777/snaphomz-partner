'use client';

import React, { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'To Do' | 'In Progress' | 'Completed';
};

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Initial outreach to new lead',
    description: 'Send welcome email and schedule intro call.',
    assignedTo: 'Agent John Doe',
    status: 'To Do',
  },
  {
    id: 'task-2',
    title: 'Follow up with client',
    description: 'Reach out to Acme Corp regarding Q3 updates.',
    assignedTo: 'Agent John Doe',
    status: 'In Progress',
  },
  {
    id: 'task-3',
    title: 'Prepare proposal draft',
    description: 'Draft proposal for CRM integration partnership.',
    assignedTo: 'Agent Jane Smith',
    status: 'In Progress',
  },
  {
    id: 'task-4',
    title: 'Send final proposal',
    description: 'Email final version to client and confirm receipt.',
    assignedTo: 'Agent Jane Smith',
    status: 'Completed',
  },
];

const PartnerTask = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'To Do' as Task['status'],
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo) return;
    const id = `task-${Date.now()}`;
    setTasks([...tasks, { ...newTask, id }]);
    setNewTask({ title: '', description: '', assignedTo: '', status: 'To Do' });
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const groupedTasks = {
    'To Do': tasks.filter((t) => t.status === 'To Do'),
    'In Progress': tasks.filter((t) => t.status === 'In Progress'),
    Completed: tasks.filter((t) => t.status === 'Completed'),
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-8">Partner Task Dashboard</h2>

        {/* New Task Input */}
        <div className="bg-white border rounded-xl shadow-md p-6 mb-12">
          <h3 className="text-lg font-medium text-[#333] mb-4">Assign New Task</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Task Title"
              className="border rounded-md px-3 py-2 text-sm text-gray-700"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Assigned To"
              className="border rounded-md px-3 py-2 text-sm text-gray-700"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            />
            <select
              className="border rounded-md px-3 py-2 text-sm text-gray-700"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task['status'] })}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <button
              onClick={handleCreateTask}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center justify-center text-sm px-4 py-2"
            >
              <FiPlus className="mr-2" /> Add Task
            </button>
          </div>
        </div>

        {/* Task Columns */}
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(groupedTasks).map(([status, tasks]) => {
            const columnBg =
              status === 'To Do'
                ? 'bg-[#fff9f2]'
                : status === 'In Progress'
                ? 'bg-[#f2f6ff]'
                : 'bg-[#f3fff5]';

            const headerColor =
              status === 'To Do'
                ? 'text-orange-600'
                : status === 'In Progress'
                ? 'text-blue-600'
                : 'text-green-600';

            return (
              <div key={status}>
                <div className={`rounded-xl shadow-md ${columnBg} p-4`}>
                  <h3 className={`text-md font-bold mb-4 ${headerColor}`}>{status}</h3>
                  <div className="space-y-5">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white border rounded-xl p-4 shadow-sm relative space-y-2"
                        >
                          <button
                            className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <FiTrash2 />
                          </button>
                          <input
                            type="text"
                            className="font-semibold text-[#111] text-sm w-full border-b"
                            value={task.title}
                            onChange={(e) =>
                              handleUpdateTask(task.id, { title: e.target.value })
                            }
                          />
                          <textarea
                            rows={2}
                            className="text-sm w-full text-gray-600 border px-2 py-1 rounded"
                            value={task.description}
                            onChange={(e) =>
                              handleUpdateTask(task.id, { description: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            className="text-sm w-full text-gray-500 border px-2 py-1 rounded"
                            value={task.assignedTo}
                            onChange={(e) =>
                              handleUpdateTask(task.id, { assignedTo: e.target.value })
                            }
                          />
                          <select
                            className="text-sm w-full border px-2 py-1 rounded"
                            value={task.status}
                            onChange={(e) =>
                              handleUpdateTask(task.id, {
                                status: e.target.value as Task['status'],
                              })
                            }
                          >
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                          </select>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">No tasks</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-14 text-sm text-gray-400 text-center italic">
          CRM integration in progress. This task dashboard is fully editable and live.
        </p>
      </div>
    </div>
  );
};

export default PartnerTask;

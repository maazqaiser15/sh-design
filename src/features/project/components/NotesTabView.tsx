import React, { useState } from 'react';
import { ProjectNote } from '../types/projectDetails';

interface NotesTabViewProps {
  notes: ProjectNote[];
  onAddNote: (content: string, isInternal: boolean) => void;
  onEditNote: (noteId: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const NotesTabView: React.FC<NotesTabViewProps> = ({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<ProjectNote | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  // Mock notes as requested
  const mockNotes: ProjectNote[] = [
    {
      id: 'note-1',
      content: 'Client requested additional security measures for the main entrance. Need to coordinate with security team for enhanced access control.',
      author: 'John Smith',
      timestamp: '2024-01-20T10:15:00Z',
      createdAt: '2024-01-20T10:15:00Z',
      updatedAt: '2024-01-20T10:15:00Z',
      projectId: 'proj-001',
      isInternal: true
    },
    {
      id: 'note-2',
      content: 'Site visit completed. All measurements confirmed. Building structure is solid and ready for installation.',
      author: 'Sarah Johnson',
      timestamp: '2024-01-19T16:45:00Z',
      createdAt: '2024-01-19T16:45:00Z',
      updatedAt: '2024-01-19T16:45:00Z',
      projectId: 'proj-001',
      isInternal: false
    },
    {
      id: 'note-3',
      content: 'Weather forecast looks good for the installation period. No delays expected due to weather conditions.',
      author: 'Mike Wilson',
      timestamp: '2024-01-18T14:30:00Z',
      createdAt: '2024-01-18T14:30:00Z',
      updatedAt: '2024-01-18T14:30:00Z',
      projectId: 'proj-001',
      isInternal: true
    },
    {
      id: 'note-4',
      content: 'Equipment delivery scheduled for early morning on Feb 1st. All tools and materials will be ready before team arrival.',
      author: 'Emily Davis',
      timestamp: '2024-01-17T09:20:00Z',
      createdAt: '2024-01-17T09:20:00Z',
      updatedAt: '2024-01-17T09:20:00Z',
      projectId: 'proj-001',
      isInternal: true
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const noteDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - noteDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return formatDate(dateString);
  };

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteContent.trim(), isInternal);
      setNewNoteContent('');
      setIsInternal(false);
      setShowAddModal(false);
    }
  };

  const handleEditNote = () => {
    if (editingNote && newNoteContent.trim()) {
      onEditNote(editingNote.id, newNoteContent.trim());
      setEditingNote(null);
      setNewNoteContent('');
      setIsInternal(false);
    }
  };

  const handleStartEdit = (note: ProjectNote) => {
    setEditingNote(note);
    setNewNoteContent(note.content);
    setIsInternal(note.isInternal);
    setShowAddModal(true);
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingNote(null);
    setNewNoteContent('');
    setIsInternal(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg text-[#101828] leading-7">Project Notes</h3>
            <p className="font-normal text-sm text-[#475467] leading-5">
              {mockNotes.length} notes added to this project
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0d76bf] text-white px-4 py-2 rounded-lg font-semibold text-sm leading-5 flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Note
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {mockNotes.map((note) => (
            <div key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  note.isInternal ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <span className={`text-xs font-semibold ${
                    note.isInternal ? 'text-blue-800' : 'text-green-800'
                  }`}>
                    {note.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold text-sm text-[#101828]">{note.author}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      note.isInternal 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {note.isInternal ? 'Internal' : 'Client'}
                    </span>
                    <span className="text-xs text-[#475467]">{getRelativeTime(note.timestamp)}</span>
                  </div>
                  <p className="text-sm text-[#344054] leading-5 mb-3">{note.content}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(note)}
                      className="text-xs text-[#0d76bf] hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <span className="text-xs text-[#475467]">•</span>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Note Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h4 className="font-semibold text-lg text-[#101828] mb-4">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#344054] mb-2">
                  Note Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={isInternal}
                      onChange={() => setIsInternal(true)}
                      className="mr-2"
                    />
                    <span className="text-sm text-[#344054]">Internal</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!isInternal}
                      onChange={() => setIsInternal(false)}
                      className="mr-2"
                    />
                    <span className="text-sm text-[#344054]">Client</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#344054] mb-2">
                  Note Content
                </label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Enter your note here..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-[#475467] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingNote ? handleEditNote : handleAddNote}
                  disabled={!newNoteContent.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0d76bf] rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingNote ? 'Update Note' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Summary */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-900">Notes Summary</h4>
              <p className="text-xs text-blue-700">
                {mockNotes.filter(n => n.isInternal).length} internal notes, {mockNotes.filter(n => !n.isInternal).length} client notes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesTabView;

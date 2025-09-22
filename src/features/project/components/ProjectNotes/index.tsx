import React, { useState } from 'react';
import { MessageSquare, Plus, Edit2, Trash2, User } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { ProjectNote } from '../../types/projectDetails';

interface ProjectNotesProps {
  notes: ProjectNote[];
  onAddNote: (content: string, isInternal: boolean) => void;
  onEditNote: (noteId: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

/**
 * ProjectNotes - Notes section for project communication
 * Handles internal note-taking and communication
 */
export const ProjectNotes: React.FC<ProjectNotesProps> = ({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote
}) => {
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim(), isInternal);
      setNewNote('');
    }
  };

  const handleEditNote = (note: ProjectNote) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingNote && editContent.trim()) {
      onEditNote(editingNote, editContent.trim());
      setEditingNote(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent('');
  };

  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Project Notes</h3>
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">{notes.length} notes</span>
        </div>
      </div>

      {/* Add Note Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            id="is-internal"
            checked={isInternal}
            onChange={(e) => setIsInternal(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is-internal" className="text-sm text-gray-700">
            Internal note (only visible to team)
          </label>
        </div>
        
        <div className="flex space-x-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note about this project..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="self-start"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Notes List */}
      {sortedNotes.length > 0 ? (
        <div className="space-y-4">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border-l-4 ${
                note.isInternal 
                  ? 'bg-blue-50 border-blue-500' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              {editingNote === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={!editContent.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-2">
                        {note.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{note.author}</span>
                        </div>
                        <span>{formatDate(note.timestamp)}</span>
                        {note.isInternal && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            Internal
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => handleEditNote(note)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No notes added yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add notes to track project updates and communication
          </p>
        </div>
      )}
    </Card>
  );
};

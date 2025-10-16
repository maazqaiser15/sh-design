import React, { useState } from 'react';
import { MessageSquare, Plus, Edit2, Trash2, User, Paperclip, Download, X, File, PlusCircle, PlusIcon, MinusIcon } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { AttachmentUpload } from '../../../../common/components/AttachmentUpload';
import { ProjectNote } from '../../types/projectDetails';
import { NoteAttachment } from '../../../../types';

interface ProjectNotesProps {
  notes: ProjectNote[];
  onAddNote: (content: string, isInternal: boolean, attachments?: NoteAttachment[]) => void;
  onEditNote: (noteId: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onAddAttachment?: (noteId: string, file: File) => void;
  onRemoveAttachment?: (noteId: string, attachmentId: string) => void;
  onDownloadAttachment?: (attachment: NoteAttachment) => void;
}

/**
 * ProjectNotes - Notes section for project communication
 * Handles internal note-taking and communication
 */
export const ProjectNotes: React.FC<ProjectNotesProps> = ({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onAddAttachment,
  onRemoveAttachment,
  onDownloadAttachment
}) => {
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [newNoteAttachments, setNewNoteAttachments] = useState<NoteAttachment[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);

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
      onAddNote(newNote.trim(), isInternal, newNoteAttachments);
      setNewNote('');
      setNewNoteAttachments([]);
    }
  };

  const handleAddAttachment = (file: File) => {
    const newAttachment: NoteAttachment = {
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User'
    };
    setNewNoteAttachments(prev => [...prev, newAttachment]);
  };

  const handleRemoveNewAttachment = (attachmentId: string) => {
    setNewNoteAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleDownloadNewAttachment = (attachment: NoteAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex flex-col text-gray-900">Project Notes
          <span className='text-xs text-gray-500'>{sortedNotes.length} notes</span>
        </h3>
        <button
          className="bg-white border border-[#d0d5dd] border-dashed text-[#475467] w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"

          onClick={() => { setShowAddNote(!showAddNote) }}>
          {!showAddNote ? <PlusIcon size={20} /> : <MinusIcon size={20} />}
        </button>
      </div>

      {/* Add Note Form */}
      {showAddNote && <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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

        <div className="space-y-3">
          <div className="flex space-x-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this project..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className='flex justify-end gap-2'>
            <AttachmentUpload
              attachments={newNoteAttachments}
              onAddAttachment={handleAddAttachment}
              onRemoveAttachment={handleRemoveNewAttachment}
              onDownloadAttachment={handleDownloadNewAttachment}
            />
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="self-start"
            >
              Submit
            </Button>
          </div>

        </div>
      </div>}


      {/* Notes List */}
      {sortedNotes.length > 0 ? (
        <div className="space-y-4">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 border-b border-gray-300 mb-3
                ${note.isInternal
                  ? ''
                  : ''
                }`
              }
            >
              {editingNote === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-transparent resize-none"
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
                      <div className='flex justify-between items-center'>
                        <h4 className="text-sm flex gap-2 font-bold text-gray-900 mb-0">
                          {note.author} <span className='font-normal'>{formatDate(note.createdAt)}</span>
                        </h4>
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
                      <p className='my-2'>{note.content}</p>
                      {/* Attachments */}
                      {note.attachments && note.attachments.length > 0 && (
                        <div className="mb-3">
                          <div className='flex justify-start items-center gap-2'>
                            {note.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="p-2 bg-gray-200 rounded-lg"
                              >
                                <div className=" flex">
                                  <div>
                                    <File size={40} className=" text-gray-400" />
                                  </div>
                                  <div className='flex flex-col'>
                                    <span className="text-gray-700 text-xs truncate">
                                      {attachment.name}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                      ({(attachment.size / 1024).toFixed(1)} KB)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


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

import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';

export interface NoteData {
  content: string;
  isInternal: boolean;
}

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (noteData: NoteData) => void;
  editingNote?: {
    id: string;
    content: string;
    isInternal: boolean;
  } | null;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingNote
}) => {
  const [content, setContent] = useState(editingNote?.content || '');
  const [isInternal, setIsInternal] = useState(editingNote?.isInternal ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        content: content.trim(),
        isInternal
      });
      
      // Reset form
      setContent('');
      setIsInternal(true);
      onClose();
    } catch (error) {
      console.error('Error submitting note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setIsInternal(true);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingNote ? "Edit Note" : "Add Note"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {/* Note Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="noteType"
                  value="internal"
                  checked={isInternal}
                  onChange={() => setIsInternal(true)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Internal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="noteType"
                  value="external"
                  checked={!isInternal}
                  onChange={() => setIsInternal(false)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">External</span>
              </label>
            </div>
          </div>

          {/* Note Content */}
          <div>
            <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <textarea
              id="noteContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your note here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length}/500 characters
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isSubmitting ? 'Saving...' : editingNote ? 'Update Note' : 'Add Note'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

import { useState, useEffect } from 'react';
import { SectorContent } from '../lib/types';
import { addSectorContent, updateSectorContent } from '../lib/sectorContent';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectorId: string;
  content?: SectorContent;
  onSave: () => void;
}

export default function ContentModal({ isOpen, onClose, sectorId, content, onSave }: ContentModalProps) {
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setContentText(content.content);
    } else {
      setTitle('');
      setContentText('');
    }
  }, [content]);

  const handleSave = async () => {
    if (!title.trim() || !contentText.trim()) return;

    setLoading(true);
    try {
      if (content) {
        await updateSectorContent(content.id, sectorId, title, contentText);
      } else {
        await addSectorContent(sectorId, title, contentText);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {content ? 'Edit Content' : 'Add Content'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter content"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim() || !contentText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

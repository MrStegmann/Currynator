import React, { useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

const TagInput: React.FC<TagInputProps> = ({ label, tags, onChange, placeholder = 'Añade y presiona coma o espacio...', error }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Si el último caracter es una coma, intentamos añadir el tag
    if (value.endsWith(',')) {
      addTag(value.slice(0, -1));
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = (tagText: string) => {
    const trimmed = tagText.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#8c909f] mb-1">{label}</label>
      <div
        className={`w-full min-h-20 bg-slate-900 border ${error ? 'border-red-500' : 'border-[#1E293B]'} rounded-md p-2 flex flex-wrap gap-2 focus-within:border-blue-500 transition-colors`}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 bg-[#102034] border border-[#1E293B] text-[#d3e4fe] px-2 py-1 rounded text-sm h-fit"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-[#8c909f] hover:text-red-400 focus:outline-none"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-30 bg-transparent border-none outline-none text-[#d3e4fe] resize-none h-8 p-1"
          rows={1}
        />
      </div>
      {error && <span className="text-red-400 text-xs mt-1 block">{error}</span>}
    </div>
  );
};

export default TagInput;

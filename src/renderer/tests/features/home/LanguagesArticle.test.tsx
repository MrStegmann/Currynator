import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguagesArticle } from '../../../src/features/home/LanguagesArticle/LanguagesArticle';
import { useResumeStore } from '../../../src/store/useResumeStore';

jest.mock('../../../src/store/useResumeStore');

describe('LanguagesArticle Component - Delete and Add Flow', () => {
  let mockStoreData: any;
  const mockAddArrayItem = jest.fn();
  const mockUpdateArrayItem = jest.fn();
  const mockDeleteArrayItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);

    mockStoreData = {
      languages: [
        { language: 'English', fluency: 'Native' },
        { language: 'Spanish', fluency: 'Fluent' }
      ]
    };

    (useResumeStore as unknown as jest.Mock).mockImplementation((selector: any) => {
      const state = {
        data: mockStoreData,
        addArrayItem: mockAddArrayItem.mockImplementation(async (section, item) => {
          mockStoreData.languages.push(item);
        }),
        updateArrayItem: mockUpdateArrayItem,
        deleteArrayItem: mockDeleteArrayItem.mockImplementation(async (section, index) => {
          mockStoreData.languages.splice(index, 1);
        })
      };
      return selector(state);
    });
  });

  it('allows adding a new language after deleting an existing language without blocking inputs', async () => {
    const { rerender } = render(<LanguagesArticle />);

    // 1. Enter Edit mode
    const editToggleBtn = screen.getByRole('button', { name: /edit languages/i });
    fireEvent.click(editToggleBtn);

    // 2. Delete the first language (English)
    const deleteButtons = screen.getAllByTitle('Delete');
    expect(deleteButtons.length).toBe(2);

    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    expect(mockDeleteArrayItem).toHaveBeenCalledWith('languages', 0);

    // Rerender to reflect updated store state
    rerender(<LanguagesArticle />);

    // 3. Click "Add Language" button
    const addLanguageBtn = screen.getByRole('button', { name: /add language/i });
    fireEvent.click(addLanguageBtn);

    // 4. Modal should be open with active, enabled input fields
    const languageInput = screen.getByPlaceholderText('e.g. English');
    const fluencyInput = screen.getByPlaceholderText('e.g. Native');

    expect(languageInput).toBeInTheDocument();
    expect(languageInput).not.toBeDisabled();
    expect(fluencyInput).not.toBeDisabled();

    // 5. Type into inputs
    fireEvent.change(languageInput, { target: { value: 'German' } });
    fireEvent.change(fluencyInput, { target: { value: 'Intermediate' } });

    expect((languageInput as HTMLInputElement).value).toBe('German');
    expect((fluencyInput as HTMLInputElement).value).toBe('Intermediate');

    // 6. Save new language
    const saveBtn = screen.getByRole('button', { name: /save language/i });
    expect(saveBtn).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(saveBtn);
    });

    expect(mockAddArrayItem).toHaveBeenCalledWith('languages', {
      language: 'German',
      fluency: 'Intermediate'
    });
  });
});

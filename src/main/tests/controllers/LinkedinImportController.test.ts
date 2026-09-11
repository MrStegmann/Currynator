import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { LinkedinImportController } from '../../controllers/LinkedinImportController.js';
import { ResumeStorage } from '../../models/ResumeStorage.js';

jest.mock('../../models/ResumeStorage.js');

describe('LinkedinImportController', () => {
  let controller: LinkedinImportController;
  let mockStorage: jest.Mocked<ResumeStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage = new ResumeStorage() as jest.Mocked<ResumeStorage>;
    controller = new LinkedinImportController(mockStorage);
  });

  it('should initialize and report hasExistingData status', () => {
    mockStorage.checkSavedData.mockReturnValue({ exists: true, data: { basics: { name: 'Existing', label: 'Dev', email: 'ex@test.com' } } });
    expect(controller.checkHasExistingData()).toBe(true);

    mockStorage.checkSavedData.mockReturnValue({ exists: false, data: null });
    expect(controller.checkHasExistingData()).toBe(false);
  });
});

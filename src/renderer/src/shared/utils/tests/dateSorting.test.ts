import {
  compareDatesDescending,
  sortChronologicalDescending,
  parseDateValue,
  isOngoingDate
} from '../dateSorting';
import { ChronologicalItem } from '../../types/sorting';

describe('dateSorting utilities', () => {
  describe('isOngoingDate', () => {
    it('returns true when endDate is empty or null and startDate is provided', () => {
      expect(isOngoingDate('', '2022-01')).toBe(true);
      expect(isOngoingDate(null, '2022-01')).toBe(true);
      expect(isOngoingDate(undefined, '2022-01')).toBe(true);
    });

    it('returns true when endDate contains ongoing keywords', () => {
      expect(isOngoingDate('Currently', '2020-01')).toBe(true);
      expect(isOngoingDate('present', '2020-01')).toBe(true);
      expect(isOngoingDate('Actual', '2020-01')).toBe(true);
      expect(isOngoingDate('actualmente', '2020-01')).toBe(true);
      expect(isOngoingDate('Hoy', '2020-01')).toBe(true);
    });

    it('returns false when a valid historical endDate is provided', () => {
      expect(isOngoingDate('2023-12', '2020-01')).toBe(false);
      expect(isOngoingDate('2021', '2020')).toBe(false);
      expect(isOngoingDate('2022-05-15', '2020-01-01')).toBe(false);
    });

    it('returns false when both startDate and endDate are empty', () => {
      expect(isOngoingDate('', '')).toBe(false);
      expect(isOngoingDate(null, null)).toBe(false);
    });
  });

  describe('parseDateValue', () => {
    it('parses full ISO date strings to timestamps', () => {
      const ts = parseDateValue('2023-05-10T00:00:00.000Z');
      expect(ts).toBe(new Date('2023-05-10T00:00:00.000Z').getTime());
    });

    it('parses standard YYYY-MM-DD date strings', () => {
      const ts = parseDateValue('2023-05-10');
      expect(ts).toBe(new Date('2023-05-10').getTime());
    });

    it('parses YYYY-MM strings correctly', () => {
      const ts = parseDateValue('2023-05');
      expect(ts).toBe(new Date('2023-05-01').getTime());
    });

    it('parses YYYY strings correctly', () => {
      const ts = parseDateValue('2023');
      expect(ts).toBe(new Date('2023-01-01').getTime());
    });

    it('returns null for invalid or empty dates', () => {
      expect(parseDateValue('')).toBeNull();
      expect(parseDateValue(null)).toBeNull();
      expect(parseDateValue(undefined)).toBeNull();
      expect(parseDateValue('invalid-date-string')).toBeNull();
    });
  });

  describe('compareDatesDescending', () => {
    it('ranks ongoing roles above completed roles', () => {
      const ongoing: ChronologicalItem = { name: 'Current Job', startDate: '2022-01', endDate: 'Currently' };
      const completed: ChronologicalItem = { name: 'Past Job', startDate: '2019-01', endDate: '2023-12' };

      expect(compareDatesDescending(ongoing, completed)).toBeLessThan(0);
      expect(compareDatesDescending(completed, ongoing)).toBeGreaterThan(0);
    });

    it('orders multiple ongoing roles descending by startDate', () => {
      const ongoingRecent: ChronologicalItem = { name: 'Ongoing Newer', startDate: '2023-06', endDate: '' };
      const ongoingOlder: ChronologicalItem = { name: 'Ongoing Older', startDate: '2021-01', endDate: '' };

      expect(compareDatesDescending(ongoingRecent, ongoingOlder)).toBeLessThan(0);
      expect(compareDatesDescending(ongoingOlder, ongoingRecent)).toBeGreaterThan(0);
    });

    it('orders completed entries descending by endDate', () => {
      const newer: ChronologicalItem = { name: 'Job 2023', startDate: '2020-01', endDate: '2023-10' };
      const older: ChronologicalItem = { name: 'Job 2021', startDate: '2019-01', endDate: '2021-05' };

      expect(compareDatesDescending(newer, older)).toBeLessThan(0);
      expect(compareDatesDescending(older, newer)).toBeGreaterThan(0);
    });

    it('breaks ties using startDate when endDates are identical', () => {
      const earlierStart: ChronologicalItem = { name: 'Started 2020', startDate: '2020-01', endDate: '2023-12' };
      const laterStart: ChronologicalItem = { name: 'Started 2022', startDate: '2022-01', endDate: '2023-12' };

      expect(compareDatesDescending(laterStart, earlierStart)).toBeLessThan(0);
      expect(compareDatesDescending(earlierStart, laterStart)).toBeGreaterThan(0);
    });

    it('supports single date property (e.g. certificates)', () => {
      const cert2024: ChronologicalItem = { name: 'Cert 2024', date: '2024-02-15' };
      const cert2022: ChronologicalItem = { name: 'Cert 2022', date: '2022-08-10' };

      expect(compareDatesDescending(cert2024, cert2022)).toBeLessThan(0);
      expect(compareDatesDescending(cert2022, cert2024)).toBeGreaterThan(0);
    });

    it('supports updated_at timestamp property (e.g. GitHub repos)', () => {
      const repoRecent: ChronologicalItem = { name: 'Repo A', updated_at: '2024-03-01T10:00:00Z' };
      const repoOlder: ChronologicalItem = { name: 'Repo B', updated_at: '2023-11-15T08:00:00Z' };

      expect(compareDatesDescending(repoRecent, repoOlder)).toBeLessThan(0);
      expect(compareDatesDescending(repoOlder, repoRecent)).toBeGreaterThan(0);
    });

    it('places undated items after dated items', () => {
      const dated: ChronologicalItem = { name: 'Dated', startDate: '2020-01', endDate: '2021-01' };
      const undated: ChronologicalItem = { name: 'Undated' };

      expect(compareDatesDescending(dated, undated)).toBeLessThan(0);
      expect(compareDatesDescending(undated, dated)).toBeGreaterThan(0);
      expect(compareDatesDescending(undated, { name: 'Also Undated' })).toBe(0);
    });
  });

  describe('sortChronologicalDescending', () => {
    it('sorts a mixed array of work experiences newest first', () => {
      const input: ChronologicalItem[] = [
        { name: 'Old Job', startDate: '2015-01', endDate: '2018-05' },
        { name: 'Current Role', startDate: '2023-01', endDate: '' },
        { name: 'Mid Job', startDate: '2019-06', endDate: '2022-12' },
        { name: 'Undated Role' }
      ];

      const sorted = sortChronologicalDescending(input);

      expect(sorted.map(i => i.name)).toEqual([
        'Current Role',
        'Mid Job',
        'Old Job',
        'Undated Role'
      ]);
    });

    it('does not mutate the source array', () => {
      const input: ChronologicalItem[] = [
        { name: 'Job A', startDate: '2018-01', endDate: '2019-01' },
        { name: 'Job B', startDate: '2022-01', endDate: '2023-01' }
      ];

      const originalCopy = [...input];
      const result = sortChronologicalDescending(input);

      expect(input).toEqual(originalCopy);
      expect(result).not.toBe(input);
      expect(result[0].name).toBe('Job B');
    });

    it('handles empty, null, or undefined gracefully', () => {
      expect(sortChronologicalDescending([])).toEqual([]);
      expect(sortChronologicalDescending(null)).toEqual([]);
      expect(sortChronologicalDescending(undefined)).toEqual([]);
    });

    it('sorts education entries newest first', () => {
      const education = [
        { institution: 'High School', startDate: '2010', endDate: '2014' },
        { institution: 'Master Degree', startDate: '2018-09', endDate: '2020-06' },
        { institution: 'Bachelor Degree', startDate: '2014-09', endDate: '2018-06' }
      ];

      const sorted = sortChronologicalDescending(education);
      expect(sorted.map(e => e.institution)).toEqual([
        'Master Degree',
        'Bachelor Degree',
        'High School'
      ]);
    });

    it('sorts certificates by single date property newest first', () => {
      const certs = [
        { name: 'AWS Certified 2021', date: '2021-04-10' },
        { name: 'Kubernetes 2024', date: '2024-01-15' },
        { name: 'React Cert 2022', date: '2022-11-20' }
      ];

      const sorted = sortChronologicalDescending(certs);
      expect(sorted.map(c => c.name)).toEqual([
        'Kubernetes 2024',
        'React Cert 2022',
        'AWS Certified 2021'
      ]);
    });
  });
});

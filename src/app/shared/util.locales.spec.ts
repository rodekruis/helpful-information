import { createLocaleAlternatives } from './util.locales';

describe('Util: Locales', () => {
  describe('createLocaleAlternatives', () => {
    it('should return empty-array if input is empty', () => {
      // Arrange
      const input = '';

      // Act
      const result = createLocaleAlternatives(input);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return an array of locale alternatives', () => {
      // Arrange
      const input = 'en:English,fr:Français,nl:Nederlands';

      // Act
      const result = createLocaleAlternatives(input);

      // Assert
      expect(result).toEqual([
        { key: 'en', label: 'English' },
        { key: 'fr', label: 'Français' },
        { key: 'nl', label: 'Nederlands' },
      ]);
    });

    it('should treat "*" as wildcard language-code', () => {
      // Arrange
      const input = 'nl:Nederlands, *:Other...';

      // Act
      const result = createLocaleAlternatives(input);

      // Assert
      expect(result).toEqual([
        { key: 'nl', label: 'Nederlands' },
        { key: '', label: 'Other...' },
      ]);
    });

    it('should ignore input that is not in the correct format', () => {
      // Arrange
      const inputs = [
        'nl:  Nederlands     ',
        'nl:Nederlands,',
        'nl:Nederlands,test',
        'nl:Nederlands,test:',
        'nl:Nederlands,:test',
        'nl:Nederlands,:',
      ];

      // Act
      inputs.forEach((input) => {
        const result = createLocaleAlternatives(input);

        // Assert
        expect(result).toEqual([{ key: 'nl', label: 'Nederlands' }]);
      });
    });
  });
});

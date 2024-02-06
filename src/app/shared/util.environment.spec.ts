import { getRegionLabel } from './util.environment';

describe('Util: Environment', () => {
  describe('getRegionLabel', () => {
    it('should return the correct label for a valid region from the environment', () => {
      // Arrange
      const input = 'test';
      const expectedOutput = 'Test';

      // Act
      const output = getRegionLabel(input);

      // Assert
      expect(output).toEqual(expectedOutput);
    });

    it('should return the uppercase region if no label is found', () => {
      // Arrange
      const input = 'unknown';
      const expectedOutput = 'UNKNOWN';

      // Act
      const output = getRegionLabel(input);

      // Assert
      expect(output).toEqual(expectedOutput);
    });

    it('should return an empty string if no region is provided', () => {
      // Arrange
      const input = '';
      const expectedOuput = '';

      // Act
      const output = getRegionLabel(input);

      // Assert
      expect(output).toEqual(expectedOuput);
    });
  });
});

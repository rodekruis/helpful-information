/**
 * Load the HIA-Config from package.json.
 *
 * @returns {object} - The HIA-Configuration
 */
export const loadConfig = () => {
  console.log('Loading config...');
  const packageJsonPath = resolve('../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const config = packageJson.config;

  if (!config) {
    throw new Error(`No HIA-Config found in: ${packageJsonPath}`);
  }

  return config;
};

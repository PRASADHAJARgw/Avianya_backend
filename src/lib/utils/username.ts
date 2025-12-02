/**
 * Generate a creative username based on the input name
 * Uses simple transformations to create variations
 */
export const generateCreativeUsername = async (name: string): Promise<string> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const prefixes = ['Super', 'Elite', 'Pro', 'The', 'Legendary', 'Epic', 'Master', 'Ultimate'];
  const suffixes = ['Bot', 'Guru', 'Expert', 'Pro', 'Star', 'Wizard', 'Ninja', 'Hero'];
  const numbers = Math.floor(Math.random() * 999) + 1;
  
  const variations = [
    `${name}${numbers}`,
    `${prefixes[Math.floor(Math.random() * prefixes.length)]}${name}`,
    `${name}${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
    `${name.toLowerCase().replace(/\s+/g, '_')}${numbers}`,
    `${prefixes[Math.floor(Math.random() * prefixes.length)]}${name}${numbers}`,
  ];
  
  return variations[Math.floor(Math.random() * variations.length)];
};

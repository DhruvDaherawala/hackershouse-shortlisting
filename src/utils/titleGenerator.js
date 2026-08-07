const FUN_TITLES = [
  'Chief Prompt Officer',
  'Node Ninja',
  'Full-Stack Alchemist',
  'AI Maverick',
  'Cyber Wizard',
  'Solana Surfer',
  'DeFi Degen',
  'ZK Phantom',
  'Rust Rebel',
  'CSS Craftsman',
  'Vibe Coder',
  'Byte Boss',
  'Bug Hunter Supreme',
  'Kernel Knight',
  'Prompt Whisperer',
  'Frontend Architect',
  'Smart Contract Guru',
  'Goa Hacker',
  'Web3 Pioneer',
  'Matrix Navigator'
];

const STACK_PRESETS = [
  'Full-Stack',
  'AI Engineer',
  'Designer',
  'Solana / Web3',
  'Rust / Systems',
  'Frontend Specialist',
  'Smart Contracts',
  'DevOps / Cloud'
];

export function getRandomTitle() {
  const randomIndex = Math.floor(Math.random() * FUN_TITLES.length);
  return FUN_TITLES[randomIndex];
}

export { STACK_PRESETS as PRESET_STACKS, FUN_TITLES };


import React from 'react';
import { useAppStore } from '../store/useAppStore';

export default function UserForm() {
  const {
    userName,
    setUserName,
    githubHandle,
    setGithubHandle,
    stackRole,
    setStackRole,
    preferredStack,
    setPreferredStack,
    builderTitle,
    setBuilderTitle,
    generateRandomTitle,
  } = useAppStore();

  const roles = [
    { id: 'Frontend', label: "'Frontend'" },
    { id: 'Backend', label: "'Backend'" },
    { id: 'Design', label: "'Design'" },
    { id: 'Fullstack', label: "'Fullstack'" },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Input: Builder Name */}
      <div className="relative flex flex-col group/input">
        <label className="text-sm font-light text-dark-gray mb-2">
          const builderName ={' '}
        </label>
        <div className="flex items-end border-b-2 border-black pb-2">
          <span className="text-black text-lg mr-3 opacity-100">&gt;</span>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="'John Doe'"
            className="bg-transparent text-black text-xl w-full border-none focus:ring-0 p-0 m-0 focus:outline-none placeholder:text-dark-gray placeholder:font-light"
            required
          />
        </div>
      </div>

      {/* Input: GitHub Handle */}
      <div className="relative flex flex-col group/input">
        <label className="text-sm font-light text-dark-gray mb-2">
          let githubHandle ={' '}
        </label>
        <div className="flex items-end border-b-2 border-black pb-2">
          <span className="text-black text-lg mr-3 opacity-100">&gt;</span>
          <input
            type="text"
            value={githubHandle}
            onChange={(e) => setGithubHandle(e.target.value)}
            placeholder="'johndoe_dev'"
            className="bg-transparent text-black text-xl w-full border-none focus:ring-0 p-0 m-0 focus:outline-none placeholder:text-dark-gray placeholder:font-light"
            required
          />
        </div>
      </div>

      {/* Input: Stack Role Selection (Brutalist Radio Toggles) */}
      <div className="flex flex-col">
        <label className="text-sm font-light text-dark-gray mb-4">
          let stackRole ={' '}
        </label>
        <div className="flex flex-wrap gap-3">
          {roles.map((r) => (
            <label key={r.id} className="cursor-pointer group">
              <input
                type="radio"
                name="role"
                value={r.id}
                checked={stackRole === r.id}
                onChange={() => setStackRole(r.id)}
                className="peer sr-only"
              />
              <div className="px-5 py-3 border border-black text-base text-black peer-checked:bg-black peer-checked:text-white transition-none hover:bg-black hover:text-white relative">
                <span className="absolute left-2 hidden group-hover:inline peer-checked:hidden">&gt;</span> {r.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Input: Preferred Stack */}
      <div className="relative flex flex-col group/input">
        <label className="text-sm font-light text-dark-gray mb-2">
          const preferredStack = [
        </label>
        <div className="flex items-end border-b-2 border-black pb-2">
          <span className="text-black text-lg mr-3 opacity-100">&gt;</span>
          <input
            type="text"
            value={preferredStack}
            onChange={(e) => setPreferredStack(e.target.value)}
            placeholder="'React', 'Node', 'Python'"
            className="bg-transparent text-black text-xl w-full border-none focus:ring-0 p-0 m-0 focus:outline-none placeholder:text-dark-gray placeholder:font-light"
          />
          <span className="text-black text-lg ml-3 opacity-100">]</span>
        </div>
      </div>

      {/* Input: Builder Title */}
      <div className="relative flex flex-col group/input">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-light text-dark-gray">
            let builderTitle ={' '}
          </label>
          <button
            type="button"
            onClick={generateRandomTitle}
            className="text-xs text-black font-bold hover:underline cursor-pointer"
          >
            [randomize Title]
          </button>
        </div>
        <div className="flex items-end border-b-2 border-black pb-2">
          <span className="text-black text-lg mr-3 opacity-100">&gt;</span>
          <input
            type="text"
            value={builderTitle}
            onChange={(e) => setBuilderTitle(e.target.value)}
            placeholder="'SYS.ARCHITECT'"
            className="bg-transparent text-black text-xl w-full border-none focus:ring-0 p-0 m-0 focus:outline-none placeholder:text-dark-gray placeholder:font-light"
          />
        </div>
      </div>
    </div>
  );
}

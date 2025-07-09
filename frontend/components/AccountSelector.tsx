'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface AccountSelectorProps {
  accounts: string[]
  selectedAccount: string
  onAccountChange: (account: string) => void
}

export default function AccountSelector({
  accounts,
  selectedAccount,
  onAccountChange,
}: AccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Account
      </label>
      <div className="relative">
        <button
          type="button"
          className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">
            {selectedAccount || 'Select an account...'}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {accounts.map((account) => (
              <button
                key={account}
                className={`${
                  selectedAccount === account
                    ? 'text-white bg-primary-600'
                    : 'text-gray-900'
                } cursor-default select-none relative py-2 pl-3 pr-9 w-full text-left hover:bg-gray-50`}
                onClick={() => {
                  onAccountChange(account)
                  setIsOpen(false)
                }}
              >
                <span className="block truncate">{account}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
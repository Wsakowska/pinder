import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-600">BeerFinder 🍻</h1>
          <p className="text-gray-600 mt-2">Znajdź kogoś do piwa!</p>
        </div>
        {children}
      </div>
    </div>
  );
}
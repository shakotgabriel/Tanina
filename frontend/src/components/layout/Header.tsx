import { User } from '@/types/auth.types'

interface HeaderProps {
  user?: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="w-full px-4 py-3 border-b">
      <nav className="flex items-center justify-between">
        <div className="text-xl font-bold">Tanina</div>
        {user && (
          <div className="flex items-center gap-4">
            <span>{user.username}</span>
          </div>
        )}
      </nav>
    </header>
  )
}

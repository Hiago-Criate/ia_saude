import { UsersTable } from '@/components/users/UsersTable'

export function Users() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-100">Usuários</h1>
        <p className="text-sm text-gray-500 mt-0.5">Pacientes cadastrados via WhatsApp</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <UsersTable />
      </div>
    </div>
  )
}

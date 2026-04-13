import { QuotesTable } from '@/components/quotes/QuotesTable'

export function Quotes() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-100">Cotações</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Histórico de pedidos de cotação — clique para ver o timeline por farmácia
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <QuotesTable />
      </div>
    </div>
  )
}

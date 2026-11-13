import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import Field, { inputClass } from '../../components/common/Field'
import Modal from '../../components/common/Modal'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useAuth } from '../../contexts/AuthContext'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { listMaterials, listMovements, listSuppliers, moveStock, saveMaterial, saveSupplier } from '../../services/inventory'
import { errorText, formatDate, formatMoney, num } from '../../utils/format'
import { labelOf, STOCK_MOVEMENTS } from '../../utils/labels'

const blankItem = { name: '', category: 'Chuma', unit: 'vipande', quantity_available: 0, minimum_stock: 0, purchase_price: 0, supplier_id: '' }

export default function InventoryPage() {
  const { role } = useAuth()
  const { settings } = useSettings()
  const [tick, setTick] = useState(0)
  const [form, setForm] = useState(null)
  const [movement, setMovement] = useState(null)
  const [history, setHistory] = useState(null)
  const [supplierName, setSupplierName] = useState('')
  const isAdmin = role === 'admin'
  const materials = useLoad(() => listMaterials(), [tick])
  const suppliers = useLoad(() => (isAdmin ? listSuppliers() : Promise.resolve([])), [tick, isAdmin])

  async function onSaveItem(event) {
    event.preventDefault()
    try {
      await saveMaterial(form)
      toast.success('Kifaa kimehifadhiwa')
      setForm(null)
      setTick((value) => value + 1)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  async function onMove(event) {
    event.preventDefault()
    try {
      await moveStock({
        itemId: movement.itemId,
        type: movement.type,
        quantity: movement.quantity,
        unitCost: movement.unitCost,
        supplierId: movement.supplierId,
        note: movement.note,
        recordExpense: movement.recordExpense,
      })
      toast.success('Stoo imesasishwa')
      setMovement(null)
      setTick((value) => value + 1)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  if (materials.loading) return <Spinner />

  return (
    <div>
      <PageHeader
        title="Hifadhi"
        text={isAdmin ? 'Stoo hubadilika kwa ununuzi, matumizi, au marekebisho, ili historia ibaki kamili.' : 'Andika vifaa kutoka mradi unaofanyia kazi. Bei hubaki kwa msimamizi.'}
        action={isAdmin && <Button type="button" onClick={() => setForm(blankItem)}>Ongeza kifaa</Button>}
      />
      {materials.error && <p className="mb-3 text-sm text-red-700">{errorText(materials.error)}</p>}
      <DataTable
        rows={materials.data || []}
        rowKey={(row) => row.id}
        empty="Bado hakuna vifaa"
        columns={[
          { key: 'name', header: 'Kifaa', cell: (row) => row.name },
          { key: 'category', header: 'Kundi', cell: (row) => row.category },
          {
            key: 'qty',
            header: 'Inapatikana',
            cell: (row) => (
              <span className={num(row.quantity_available) <= num(row.minimum_stock) ? 'text-red-700' : ''}>
                {num(row.quantity_available)} {row.unit}
              </span>
            ),
          },
          { key: 'min', header: 'Kiwango cha chini', cell: (row) => `${num(row.minimum_stock)} ${row.unit}` },
          ...(isAdmin
            ? [{ key: 'price', header: 'Bei ya mwisho', cell: (row) => formatMoney(row.purchase_price, settings.currency_code) }]
            : []),
          {
            key: 'actions',
            header: '',
            cell: (row) =>
              isAdmin ? (
                <span className="flex gap-2">
                  <button type="button" className="text-accent" onClick={() => setMovement({ itemId: row.id, type: 'purchase', quantity: '', unitCost: row.purchase_price || '', supplierId: row.supplier_id || '', note: '', recordExpense: true })}>Nunua</button>
                  <button type="button" className="text-muted" onClick={() => setMovement({ itemId: row.id, type: 'adjustment', quantity: '', unitCost: 0, note: '', recordExpense: false })}>Rekebisha</button>
                  <button type="button" className="text-muted" onClick={async () => setHistory(await listMovements(row.id))}>Historia</button>
                </span>
              ) : (
                formatDate(row.updated_at)
              ),
          },
        ]}
      />

      {isAdmin && (
        <form
          className="mt-6 flex flex-wrap gap-2"
          onSubmit={async (event) => {
            event.preventDefault()
            try {
              await saveSupplier({ name: supplierName })
              setSupplierName('')
              setTick((value) => value + 1)
              toast.success('Muuzaji ameongezwa')
            } catch (error) {
              toast.error(errorText(error))
            }
          }}
        >
          <input className={`${inputClass} max-w-xs`} placeholder="Muuzaji mpya" value={supplierName} onChange={(event) => setSupplierName(event.target.value)} required />
          <Button type="submit" variant="surface">Ongeza muuzaji</Button>
          <p className="w-full text-xs text-muted">{(suppliers.data || []).map((supplier) => supplier.name).join(', ') || 'Bado hakuna wauzaji.'}</p>
        </form>
      )}

      <Modal open={Boolean(form)} title="Kifaa" onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={onSaveItem} className="grid gap-3">
            <Field label="Jina"><input className={inputClass} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Kundi"><input className={inputClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></Field>
            <Field label="Kipimo"><input className={inputClass} value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} /></Field>
            {!form.id && (
              <Field label="Idadi ya kuanzia" hint="Hii huandika mwendo wa stoo ya kuanzia.">
                <input className={inputClass} type="number" min="0" value={form.quantity_available} onChange={(event) => setForm({ ...form, quantity_available: event.target.value })} />
              </Field>
            )}
            <Field label="Stoo ya chini"><input className={inputClass} type="number" min="0" value={form.minimum_stock} onChange={(event) => setForm({ ...form, minimum_stock: event.target.value })} /></Field>
            <Field label="Bei ya ununuzi"><input className={inputClass} type="number" min="0" value={form.purchase_price} onChange={(event) => setForm({ ...form, purchase_price: event.target.value })} /></Field>
            <Field label="Muuzaji">
              <select className={inputClass} value={form.supplier_id || ''} onChange={(event) => setForm({ ...form, supplier_id: event.target.value })}>
                <option value="">Hakuna</option>
                {(suppliers.data || []).map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
              </select>
            </Field>
            <Button type="submit">Hifadhi</Button>
          </form>
        )}
      </Modal>

      <Modal open={Boolean(movement)} title={movement?.type === 'purchase' ? 'Andika ununuzi' : 'Rekebisha stoo'} onClose={() => setMovement(null)}>
        {movement && (
          <form onSubmit={onMove} className="grid gap-3">
            <Field label={movement.type === 'adjustment' ? 'Mabadiliko ya idadi (tumia alama ya kuondoa ili kupunguza)' : 'Idadi'}>
              <input className={inputClass} required type="number" step="0.01" value={movement.quantity} onChange={(event) => setMovement({ ...movement, quantity: event.target.value })} />
            </Field>
            {movement.type === 'purchase' && (
              <>
                <Field label="Bei ya kipimo"><input className={inputClass} type="number" min="0" value={movement.unitCost} onChange={(event) => setMovement({ ...movement, unitCost: event.target.value })} /></Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={movement.recordExpense} onChange={(event) => setMovement({ ...movement, recordExpense: event.target.checked })} />
                  Andika pia kama matumizi ya vifaa
                </label>
              </>
            )}
            <Field label="Maelezo"><input className={inputClass} value={movement.note} onChange={(event) => setMovement({ ...movement, note: event.target.value })} /></Field>
            <Button type="submit">Sasisha stoo</Button>
          </form>
        )}
      </Modal>

      <Modal open={Boolean(history)} title="Historia ya stoo" onClose={() => setHistory(null)}>
        <div className="space-y-2 text-sm">
          {(history || []).map((row) => (
            <p key={row.id} className="flex justify-between gap-3 border-b border-line py-2">
              <span>{formatDate(row.created_at)} · {labelOf(STOCK_MOVEMENTS, row.movement_type)}</span>
              <span>{num(row.quantity)} · {row.note}</span>
            </p>
          ))}
          {!history?.length && <p className="text-muted">Hakuna mienendo.</p>}
        </div>
      </Modal>
    </div>
  )
}

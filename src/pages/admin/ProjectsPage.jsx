import { Link } from 'react-router-dom'
import DataTable from '../../components/common/DataTable'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import { useLoad } from '../../hooks/useLoad'
import { listProjects } from '../../services/projects'
import { errorText, formatDate } from '../../utils/format'
import { PROJECT_STATUSES } from '../../utils/labels'

export default function ProjectsPage() {
  const { data, loading, error } = useLoad(() => listProjects(), [])
  if (loading) return <Spinner />
  if (error) return <p className="text-sm text-red-700">{errorText(error)}</p>

  return (
    <div>
      <PageHeader title="Miradi" text="Kazi za uundaji na hatua zilizo." />
      <DataTable
        rows={data || []}
        rowKey={(row) => row.id}
        empty="Bado hakuna miradi"
        columns={[
          { key: 'no', header: 'Mradi', cell: (row) => <Link className="text-accent" to={`/admin/projects/${row.id}`}>{row.project_number}</Link> },
          { key: 'who', header: 'Mteja', cell: (row) => row.customers?.full_name },
          { key: 'who2', header: 'Aliyepangiwa', cell: (row) => row.employees?.full_name || 'Hajapangiwa' },
          { key: 'due', header: 'Mwisho', cell: (row) => formatDate(row.expected_completion_date) },
          { key: 'progress', header: 'Maendeleo', cell: (row) => `${row.progress_percent}%` },
          { key: 'status', header: 'Hali', cell: (row) => <StatusBadge status={row.status} list={PROJECT_STATUSES} /> },
        ]}
      />
    </div>
  )
}

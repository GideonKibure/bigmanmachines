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
      <PageHeader title="Projects" text="Fabrication jobs and the stage they are in." />
      <DataTable
        rows={data || []}
        rowKey={(row) => row.id}
        empty="No projects yet"
        columns={[
          { key: 'no', header: 'Project', cell: (row) => <Link className="text-accent" to={`/admin/projects/${row.id}`}>{row.project_number}</Link> },
          { key: 'who', header: 'Customer', cell: (row) => row.customers?.full_name },
          { key: 'who2', header: 'Assigned', cell: (row) => row.employees?.full_name || 'Unassigned' },
          { key: 'due', header: 'Due', cell: (row) => formatDate(row.expected_completion_date) },
          { key: 'progress', header: 'Progress', cell: (row) => `${row.progress_percent}%` },
          { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} list={PROJECT_STATUSES} /> },
        ]}
      />
    </div>
  )
}

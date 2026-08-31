import AdminResourcePage from "./AdminResourcePage";
export default function Jobs(){return <AdminResourcePage title="Jobs" endpoint="/admin/jobs" collectionKey="jobs" allowDelete columns={[{key:"title",label:"Title"},{key:"company",label:"Company",render:i=>i.company?.name||"—"},{key:"location",label:"Location"},{key:"status",label:"Status"},{key:"applicationsCount",label:"Applications"}]}/>}

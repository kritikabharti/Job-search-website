import AdminResourcePage from "./AdminResourcePage";

export default function Applications() {
  return (
    <AdminResourcePage
      title="Applications"
      endpoint="/admin/applications"
      collectionKey="applications"
      columns={[
        {
          key: "candidate",
          label: "Candidate",
          render: (item) =>
            item.candidate?.name ||
            item.candidate?.title ||
            item.jobseeker?.name ||
            "—",
        },
        {
          key: "job",
          label: "Job",
          render: (item) =>
            item.job?.title ||
            item.job?.name ||
            "—",
        },
        {
          key: "status",
          label: "Status",
          render: (item) => item.status || "Pending",
        },
        {
          key: "createdAt",
          label: "Applied",
          render: (item) =>
            item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—",
        },
      ]}
    />
  );
}
import AdminResourcePage from "./AdminResourcePage";

export default function Jobs() {
  return (
    <AdminResourcePage
      title="Jobs"
      endpoint="/admin/jobs"
      collectionKey="jobs"
      columns={[
        {
          key: "title",
          label: "Title",
        },
        {
          key: "location",
          label: "Location",
        },
        {
          key: "status",
          label: "Status",
        },
        {
          key: "applicationsCount",
          label: "Applications",
          render: (item) =>
            item.applicationsCount ?? 0,
        },
      ]}
    />
  );
}
import AdminResourcePage from "./AdminResourcePage";

export default function Companies() {
  return (
    <AdminResourcePage
      title="Companies"
      endpoint="/admin/companies"
      collectionKey="companies"
      columns={[
        {
          key: "name",
          label: "Name",
        },
        {
          key: "industry",
          label: "Industry",
        },
        {
          key: "location",
          label: "Location",
        },
        {
          key: "isVerified",
          label: "Verified",
          render: (item) =>
            item.isVerified ? "Yes" : "No",
        },
      ]}
    />
  );
}
import AdminResourcePage from "./AdminResourcePage";

export default function Users() {
  return (
    <AdminResourcePage
      title="Users"
      endpoint="/admin/users"
      collectionKey="users"
      columns={[
        {
          key: "name",
          label: "Name",
        },
        {
          key: "email",
          label: "Email",
        },
        {
          key: "role",
          label: "Role",
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
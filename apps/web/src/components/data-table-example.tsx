import { useState } from "react";
import { DataTable, type DataTableCallbacks, type EditableColumnDef } from "./data-table";

// Example data type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Example usage of the enhanced DataTable
export function DataTableExample() {
  const [data, setData] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "User" },
  ]);

  const [searchValue, setSearchValue] = useState("");

  // Define columns with editable property
  const columns: EditableColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      editable: true, // This column can be edited
    },
    {
      accessorKey: "email", 
      header: "Email",
      editable: true, // This column can be edited
    },
    {
      accessorKey: "role",
      header: "Role",
      editable: true, // This column can be edited
    },
  ];

  // Handle batch save - receives array of updated items
  const handleBatchSave: DataTableCallbacks<User>["onBatchSave"] = (updatedItems) => {
    console.log("Batch save triggered with:", updatedItems);
    
    // Update the data with the changes
    const newData = [...data];
    updatedItems.forEach(({ row, changes }) => {
      const index = newData.findIndex(item => item.id === row.id);
      if (index !== -1) {
        newData[index] = { ...newData[index], ...changes };
      }
    });
    setData(newData);
    
    // Here you would typically make an API call to save the changes
    // await saveUserChanges(updatedItems);
  };

  const callbacks: DataTableCallbacks<User> = {
    onSearchChange: setSearchValue,
    onBatchSave: handleBatchSave,
    onRowReorder: ({ from, to, position }) => {
      console.log("Row reorder:", { from, to, position });
      // Handle row reordering logic here
    },
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Enhanced Data Table Example</h1>
      
      <DataTable
        columns={columns}
        data={data}
        searchValue={searchValue}
        enableCellEditing={true}
        enableRowReorder={true}
        callbacks={callbacks}
        searchPlaceholder="Search users..."
        emptyMessage="No users found"
      />
    </div>
  );
}


"use client";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus } from "lucide-react";
import { Dialog, DialogContent,DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import UserForm from "./userform";
import { DataTable } from "../../table/data-table";




interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
  // laboratory: string[];
  laboratory: [string, ...string[]]
}

export default function UsersPagesInfo() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", role: "Admin", designation: "Labs Manager", laboratory: ["BioTech Labs"] },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", role: "Technician", designation: "Labs Assistant", laboratory: ["MedLab"] },
    { id: 3, name: "Alice Brown", email: "alice@example.com", phone: "456-789-0123", role: "Researcher", designation: "Senior Scientist", laboratory: ["ChemLab"] },
  ]);

  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const roles = ["Admin", "Technician", "Researcher"];
  const laboratories = ["BioTech Labs", "MedLab", "ChemLab"];

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "laboratory", header: "Laboratory", cell: ({ row }) => row.original.laboratory.join(", ") },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openEditDialog(row.original)}>
            <Pencil size={14} className="mr-2" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}>
            <Trash size={14} className="mr-2" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleSaveUser = (user: User) => {
    if (user.id) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, { ...user, id: users.length + 1 }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Users</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2" size={16} /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
            
            <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>Modify the test details.</DialogDescription>
            </DialogHeader>
            <UserForm initialData={selectedUser} onSubmit={handleSaveUser} roles={roles} laboratories={laboratories} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable data={users} columns={columns} searchValue={searchValue} onSearchChange={setSearchValue} />
    </div>
  );
}

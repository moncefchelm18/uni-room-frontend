import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  AlertTriangle,
  Home,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming you have this

// Mock Image Placeholders (same as student pages for consistency for now)
import r1 from "@/assets/images/residencies/r1.png";
import r2 from "@/assets/images/residencies/r2.png";
import r3 from "@/assets/images/residencies/r3.png";
const placeholderImages = [r1, r2, r3];
const getRandomPlaceholderImage = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return placeholderImages[Math.abs(hash) % placeholderImages.length];
};

const initialResidencies = [
  // Same mock data as in StudentResidenciesPage
  {
    id: "r-001",
    _id: "r-001",
    title: "Cité El Alia - Alger Centre",
    wilaya: "Alger",
    type: "Multiple Room Types",
    price: 1500,
    amenities: ["WiFi", "Kitchen", "Laundry"],
    status: "approved",
    description: "Vibrant residence...",
    images: [getRandomPlaceholderImage("r-001")],
    capacity: 200,
    floorCount: 5,
    roomTypesAvailable: ["Single", "Shared (2-person)"],
  },
  {
    id: "r-002",
    _id: "r-002",
    title: "Résidence Taleb Abderrahmane - Oran",
    wilaya: "Oran",
    type: "Studios & Single",
    price: 2500,
    amenities: ["Kitchenette", "WiFi", "Security"],
    status: "pending",
    description: "Modern studios in Oran...",
    images: [getRandomPlaceholderImage("r-002")],
    capacity: 150,
    floorCount: 3,
    roomTypesAvailable: ["Studio", "Single"],
  },
  // Add more...
];

const initialFormData = {
  title: "",
  wilaya: "",
  type: "Multiple",
  price: 0,
  amenities: "",
  description: "",
  images: "",
  status: "pending",
  capacity: 0,
  floorCount: 0,
  roomTypesAvailable: "",
};
const mockWilayas = [
  "Alger",
  "Oran",
  "Constantine",
  "Annaba",
  "Sétif",
  "Blida",
]; // From student page
const residencyStatuses = ["pending", "approved", "rejected", "maintenance"];

export default function ServiceManageResidency() {
  const { toast } = useToast();
  const [residencies, setResidencies] = useState(initialResidencies);
  const [isLoading, setIsLoading] = useState(false); // False for mock
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingResidency, setEditingResidency] = useState(null); // null for Add, object for Edit
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(null);

  // Client-side filtering
  const filteredResidencies = residencies.filter(
    (res) =>
      res.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      res.wilaya.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleOpenFormDialog = (residencyToEdit = null) => {
    setError(null); // Clear previous errors
    setFormError(null);
    if (residencyToEdit) {
      setEditingResidency(residencyToEdit);
      setFormData({
        // Populate form for editing
        ...residencyToEdit,
        amenities: Array.isArray(residencyToEdit.amenities)
          ? residencyToEdit.amenities.join(", ")
          : "", // Convert array to string for input
        images: Array.isArray(residencyToEdit.images)
          ? residencyToEdit.images.join(", ")
          : "",
        roomTypesAvailable: Array.isArray(residencyToEdit.roomTypesAvailable)
          ? residencyToEdit.roomTypesAvailable.join(", ")
          : "",
      });
    } else {
      setEditingResidency(null);
      setFormData(initialFormData);
    }
    setIsFormDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };
  const handleFormSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    // Convert comma-separated strings back to arrays
    const submissionData = {
      ...formData,
      amenities: formData.amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: formData.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean), // For mock, just strings. Real app: file upload
      roomTypesAvailable: formData.roomTypesAvailable
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingResidency) {
      // Mock Edit
      console.log(
        "Mock: Updating residency",
        editingResidency.id,
        submissionData
      );
      setResidencies((prev) =>
        prev.map((r) =>
          r.id === editingResidency.id
            ? {
                ...r,
                ...submissionData,
                id: editingResidency.id,
                _id: editingResidency._id,
              }
            : r
        )
      );
      toast({ title: "Residency Updated (Mock)" });
    } else {
      // Mock Add
      const newId = `r-mock-${Date.now()}`;
      console.log("Mock: Adding new residency", {
        id: newId,
        ...submissionData,
      });
      setResidencies((prev) => [
        { id: newId, _id: newId, ...submissionData },
        ...prev,
      ]);
      toast({ title: "Residency Added (Mock)" });
    }
    setIsFormDialogOpen(false);
  };

  const handleDeleteResidency = (residencyId) => {
    if (!window.confirm("Are you sure you want to delete this residency?"))
      return;
    console.log("Mock: Deleting residency", residencyId);
    setResidencies((prev) => prev.filter((r) => r.id !== residencyId));
    toast({ title: "Residency Deleted (Mock)", variant: "destructive" });
  };

  return (
    <DashboardShell role="service">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Manage Residencies
        </h1>
        <Button
          className="bg-rose-500 hover:bg-rose-600"
          onClick={() => handleOpenFormDialog()}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Residency
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">
        Add, edit, or remove university residencies.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Residency List</CardTitle>
          <div className="pt-2">
            <Input
              type="search"
              placeholder="Search by title or wilaya..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Wilaya</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && error && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-24 text-destructive"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !error && filteredResidencies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No residencies found.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  !error &&
                  filteredResidencies.map((res) => (
                    <TableRow key={res.id}>
                      <TableCell className="font-medium">{res.title}</TableCell>
                      <TableCell>{res.wilaya}</TableCell>
                      <TableCell>{res.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            res.status === "approved"
                              ? "success"
                              : res.status === "pending"
                              ? "warning"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {res.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleOpenFormDialog(res)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteResidency(res.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {/* Placeholder: Pagination */}
        </CardContent>
      </Card>

      {/* Add/Edit Residency Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResidency ? "Edit" : "Add New"} Residency
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the university residency.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="wilaya">Wilaya*</Label>
                <Select
                  name="wilaya"
                  value={formData.wilaya}
                  onValueChange={(val) => handleFormSelectChange("wilaya", val)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWilayas.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type (e.g., Multiple, Studios)</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="price">Base Price (DZD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Total Capacity (beds)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="floorCount">Number of Floors</Label>
                <Input
                  id="floorCount"
                  name="floorCount"
                  type="number"
                  value={formData.floorCount}
                  onChange={handleFormChange}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(val) => handleFormSelectChange("status", val)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {residencyStatuses.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleFormChange}
                  placeholder="WiFi, Laundry, Kitchen..."
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="roomTypesAvailable">
                  Room Types Offered (comma-separated)
                </Label>
                <Input
                  id="roomTypesAvailable"
                  name="roomTypesAvailable"
                  value={formData.roomTypesAvailable}
                  onChange={handleFormChange}
                  placeholder="Single, Shared (2-person)..."
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="images">
                  Image URLs (comma-separated, placeholder for now)
                </Label>
                <Textarea
                  id="images"
                  name="images"
                  value={formData.images}
                  onChange={handleFormChange}
                  placeholder="http://example.com/img1.jpg, ..."
                  rows={2}
                />
              </div>
            </div>
            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-rose-500 hover:bg-rose-600">
                {editingResidency ? "Save Changes" : "Add Residency"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </DashboardShell>
  );
}

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { Input } from "@/components/ui/input"; // For Search
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // For Filters
import { Label } from "@/components/ui/label"; // For Filter Labels
import DashboardShell from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Hourglass,
  AlertTriangle,
  RefreshCw,
  Search as SearchIcon,
  Filter as FilterIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming you have this

// Helper function to format dates
const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, "dd/MM/yyyy HH:mm");
};

// Mock Data (Student Booking Requests - more diverse statuses and residencies)
const initialBookingRequests = [
  {
    id: "bk001",
    _id: "bk001",
    studentName: "Wassim Oubaziz",
    studentId: "user_68192325",
    residencyTitle: "Cité El Alia - Alger Centre",
    residencyId: "r-001",
    requestedRoomNumber: "A-101",
    requestedRoomType: "Single",
    applicationDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    notes: "Priority student for medical reasons.",
  },
  {
    id: "bk002",
    _id: "bk002",
    studentName: "Ikhekfoune Asil",
    studentId: "user_6819239a",
    residencyTitle: "Résidence Taleb Abderrahmane - Oran",
    residencyId: "r-002",
    requestedRoomNumber: "Studio 01",
    requestedRoomType: "Studio",
    applicationDate: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: "pending",
    notes: "",
  },
  {
    id: "bk003",
    _id: "bk003",
    studentName: "Alice Johnson",
    studentId: "user_abc1",
    residencyTitle: "Cité El Alia - Alger Centre",
    residencyId: "r-001",
    requestedRoomNumber: "B-203",
    requestedRoomType: "Shared (2-person)",
    applicationDate: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: "approved",
    assignedRoom: "B-203",
    notes: "Payment confirmed.",
  },
  {
    id: "bk004",
    _id: "bk004",
    studentName: "Bob Williams",
    studentId: "user_def2",
    residencyTitle: "Cité Ouled Fayet - Alger Ouest",
    residencyId: "r-003",
    requestedRoomNumber: "Any Double",
    requestedRoomType: "Double Room",
    applicationDate: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: "rejected",
    rejectionReason: "No double rooms available currently.",
  },
  {
    id: "bk005",
    _id: "bk005",
    studentName: "Charlie Davis",
    studentId: "user_ghi3",
    residencyTitle: "Résidence Universitaire Constantine",
    residencyId: "r-004",
    requestedRoomNumber: "Single C1",
    requestedRoomType: "Single",
    applicationDate: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: "pending",
    notes: "Needs ground floor access if possible.",
  },
];

// Extract unique residency titles for filter dropdown
const uniqueResidencyTitles = [
  "all",
  ...new Set(initialBookingRequests.map((req) => req.residencyTitle)),
];
const requestStatuses = ["all", "pending", "approved", "rejected"];
// --- End Mock Data ---

export default function ServiceBookingRequests() {
  const { toast } = useToast();
  const [allBookingRequests, setAllBookingRequests] = useState(
    initialBookingRequests
  ); // Store all for client-side filtering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Filter & Search States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("pending"); // Default to 'pending'
  const [selectedResidencyFilter, setSelectedResidencyFilter] = useState("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // --- Simulate Fetching Booking Requests (mock) ---
  const fetchBookingRequestsMock = useCallback(() => {
    setIsLoading(true);
    setError(null);
    console.log("Simulating: Fetching booking requests...");
    setTimeout(() => {
      // With API: this function would fetch based on server-side filters.
      // For mock: we just use the `allBookingRequests` state.
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchBookingRequestsMock();
  }, [fetchBookingRequestsMock]);

  // --- Client-Side Filtering Logic ---
  const filteredBookingRequests = useMemo(() => {
    return allBookingRequests.filter((req) => {
      const searchTermLower = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        !debouncedSearchTerm ||
        req.studentName.toLowerCase().includes(searchTermLower) ||
        req.residencyTitle.toLowerCase().includes(searchTermLower) ||
        (req.requestedRoomNumber &&
          req.requestedRoomNumber.toLowerCase().includes(searchTermLower));
      const matchesStatus =
        selectedStatusFilter === "all" || req.status === selectedStatusFilter;
      const matchesResidency =
        selectedResidencyFilter === "all" ||
        req.residencyTitle === selectedResidencyFilter;
      return matchesSearch && matchesStatus && matchesResidency;
    });
  }, [
    allBookingRequests,
    debouncedSearchTerm,
    selectedStatusFilter,
    selectedResidencyFilter,
  ]);

  // --- Action Handlers (Mocked: modify 'allBookingRequests' state) ---
  const handleApproveBooking = (requestId, studentName) => {
    console.log(`Mock: Approving booking ${requestId} for ${studentName}`);
    setAllBookingRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "approved",
              assignedRoom: req.requestedRoomNumber, // Mock assignment
              notes: `Approved on ${new Date().toLocaleDateString()}. Payment details sent.`,
            }
          : req
      )
    );
    toast({
      title: "Booking Approved (Mock)",
      description: `Request for ${studentName} approved.`,
    });
  };

  const handleRejectBooking = (requestId, studentName) => {
    const reason = prompt(
      `Enter reason for rejecting booking for ${studentName}:`
    );
    if (reason === null) return;
    if (!reason.trim()) {
      toast({ title: "Reason Required", variant: "destructive" });
      return;
    }
    console.log(
      `Mock: Rejecting booking ${requestId} for ${studentName} with reason: ${reason}`
    );
    setAllBookingRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: "rejected", rejectionReason: reason }
          : req
      )
    );
    toast({ title: "Booking Rejected (Mock)", variant: "destructive" });
  };

  // --- Render Logic ---
  return (
    <DashboardShell role="service">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Student Booking Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage student applications for rooms.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchBookingRequestsMock}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh List
        </Button>
      </div>

      {/* --- Filters Card --- */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <Label htmlFor="booking-search">Search</Label>
              <div className="relative mt-1">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  id="booking-search"
                  placeholder="Student, residency, room..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* Filter by Status */}
            <div>
              <Label htmlFor="booking-status-filter">Filter by Status</Label>
              <Select
                value={selectedStatusFilter}
                onValueChange={setSelectedStatusFilter}
              >
                <SelectTrigger
                  id="booking-status-filter"
                  className="w-full mt-1"
                >
                  <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {requestStatuses.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Filter by Residency */}
            <div>
              <Label htmlFor="booking-residency-filter">
                Filter by Residency
              </Label>
              <Select
                value={selectedResidencyFilter}
                onValueChange={setSelectedResidencyFilter}
              >
                <SelectTrigger
                  id="booking-residency-filter"
                  className="w-full mt-1"
                >
                  <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                  <SelectValue placeholder="All Residencies" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueResidencyTitles.map((title) => (
                    <SelectItem
                      key={title}
                      value={title}
                      className="capitalize"
                    >
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* --- End Filters Card --- */}

      <Card>
        <CardHeader>
          <CardTitle>Booking Applications</CardTitle>
          <CardDescription>
            List of student requests based on selected filters.
          </CardDescription>
          {error && !isLoading && (
            <div className="text-destructive text-sm mt-2">{error}</div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Residency</TableHead>
                  <TableHead>Room/Type</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  [...Array(5)].map((_, i) => (
                    <TableRow key={`skel-bk-${i}`}>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Skeleton className="h-8 w-20 inline-block" />
                        <Skeleton className="h-8 w-20 inline-block" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading && error && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-destructive"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  !error &&
                  filteredBookingRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No booking requests match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                {!isLoading &&
                  !error &&
                  filteredBookingRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">
                        {req.studentName}
                      </TableCell>
                      <TableCell>{req.residencyTitle}</TableCell>
                      <TableCell>
                        {req.requestedRoomNumber || req.requestedRoomType}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(req.applicationDate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            req.status === "pending"
                              ? "warning"
                              : req.status === "approved"
                              ? "success"
                              : req.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {req.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:bg-green-100 hover:text-green-700"
                              onClick={() =>
                                handleApproveBooking(req.id, req.studentName)
                              }
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-100 hover:text-red-700"
                              onClick={() =>
                                handleRejectBooking(req.id, req.studentName)
                              }
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {(req.status === "approved" ||
                          req.status === "rejected") && (
                          <span className="text-xs italic text-muted-foreground">
                            Processed
                          </span>
                        )}
                        {/* Add View Details button later if needed */}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {/* Placeholder: Add Pagination if your booking requests API supports it */}
        </CardContent>
      </Card>
      <Toaster />
    </DashboardShell>
  );
}

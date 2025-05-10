import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For status messages
import DashboardShell from "@/components/layout/DashboardShell";
import { Link } from "react-router-dom";
import {
  FileText,
  Hourglass,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Home,
  Banknote,
  SearchCode,
  Printer,
} from "lucide-react"; // Icons
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to format dates or return placeholder
const formatDate = (dateString, outputFormat = "MMM dd, yyyy, HH:mm") => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.error("Error parsing date:", dateString, e);
    return "Invalid Date";
  }
};

// --- Mock Data for different request states ---
const mockRequestData = {
  noRequest: null,
  pendingResponse: {
    id: "req-pending-123",
    residencyTitle: "Cité El Alia - Alger Centre",
    requestedRoomNumber: "A-101 (Single)",
    requestedRoomType: "Single",
    applicationDate: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ).toISOString(), // 2 days ago
    status: "Pending Review",
    notes:
      "Your application is currently under review by the administration. You will be notified of the outcome soon.",
  },
  pendingPayment: {
    id: "req-payment-456",
    residencyTitle: "Résidence Taleb Abderrahmane - Oran",
    requestedRoomNumber: "Studio 01",
    requestedRoomType: "Studio",
    applicationDate: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: "Approved - Awaiting Payment",
    notes:
      "Congratulations! Your room request has been approved. To finalize your booking, please proceed to the university administration office to complete the payment within 3 working days.",
    paymentDeadline: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
    assignedRoomNumber: "Studio 01", // Confirmed room after approval
  },
  paidAndConfirmed: {
    id: "req-confirmed-789",
    residencyTitle: "Cité Ouled Fayet - Alger Ouest",
    assignedRoomNumber: "B-205", // Actual assigned room
    roomType: "Double Room",
    pavilion: "B",
    floor: 2,
    applicationDate: new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000
    ).toISOString(),
    confirmationDate: new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: "Confirmed & Paid",
    notes:
      "Your booking is confirmed! Welcome to your new room. You can find more details about your move-in process on the university portal.",
    moveInDate: "2025-09-01", // Example
    contractEndDate: "2026-06-30", // Example
  },
  rejectedRequest: {
    id: "req-rejected-010",
    residencyTitle: "Résidence Universitaire Constantine",
    requestedRoomType: "Single Room",
    applicationDate: new Date(
      Date.now() - 4 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: "Rejected",
    rejectionReason:
      "Unfortunately, all rooms of the requested type are currently occupied. We encourage you to explore other available residences or re-apply next semester.",
    notes:
      "We regret to inform you that your room request could not be fulfilled at this time.",
  },
};

// --- Test State Options ---
const requestStates = [
  { value: "noRequest", label: "1. No Active Request" },
  { value: "pendingResponse", label: "2. Pending Admin Response" },
  { value: "pendingPayment", label: "3. Approved - Awaiting Payment" },
  { value: "paidAndConfirmed", label: "4. Confirmed & Room Assigned" },
  { value: "rejectedRequest", label: "5. Request Rejected" },
];

export default function StudentRoomRequest() {
  const { toast } = useToast(); // Assuming useToast is set up

  const [currentRequestStateKey, setCurrentRequestStateKey] =
    useState("noRequest");
  const [currentRequest, setCurrentRequest] = useState(
    mockRequestData.noRequest
  );
  const [isLoading, setIsLoading] = useState(false); // For future API calls

  // Simulate fetching data based on selected state
  useEffect(() => {
    setIsLoading(true);
    // In a real app, you'd fetch the user's actual request(s) from the backend.
    // For now, we just set it from mock data.
    setTimeout(() => {
      setCurrentRequest(mockRequestData[currentRequestStateKey]);
      setIsLoading(false);
    }, 300); // Simulate a short delay
  }, [currentRequestStateKey]);

  const handleCancelRequest = (requestId) => {
    // Placeholder for API call
    console.log(`Placeholder: Cancelling request ${requestId}`);
    toast({
      title: "Request Cancellation (Placeholder)",
      description: `Request ${requestId} cancellation initiated.`,
    });
    // Simulate state change after cancellation
    setCurrentRequestStateKey("noRequest");
  };

  const renderRequestDetails = (request) => {
    if (!request) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {request.status === "Confirmed & Paid" ? (
              <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
            ) : request.status === "Pending Review" ||
              request.status === "Approved - Awaiting Payment" ? (
              <Hourglass className="mr-2 h-6 w-6 text-yellow-500" />
            ) : request.status === "Rejected" ? (
              <XCircle className="mr-2 h-6 w-6 text-destructive" />
            ) : (
              <FileText className="mr-2 h-6 w-6 text-primary" />
            )}
            Room Booking Request: {request.id}
          </CardTitle>
          <CardDescription>
            Status:{" "}
            <Badge
              variant={
                request.status === "Confirmed & Paid"
                  ? "success"
                  : request.status === "Pending Review"
                  ? "warning"
                  : request.status === "Approved - Awaiting Payment"
                  ? "default" // Or a specific 'info' variant
                  : request.status === "Rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {request.status}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Residency:</p>
              <p className="text-muted-foreground">{request.residencyTitle}</p>
            </div>
            {request.requestedRoomNumber && !request.assignedRoomNumber && (
              <div>
                <p className="font-medium">Requested Room/Type:</p>
                <p className="text-muted-foreground">
                  {request.requestedRoomNumber || request.requestedRoomType}
                </p>
              </div>
            )}
            {request.assignedRoomNumber && (
              <div>
                <p className="font-medium">Assigned Room:</p>
                <p className="text-lg font-semibold text-primary">
                  {request.assignedRoomNumber}
                </p>
              </div>
            )}
            {request.roomType && request.status === "Confirmed & Paid" && (
              <div>
                <p className="font-medium">Room Type:</p>
                <p className="text-muted-foreground">{request.roomType}</p>
              </div>
            )}
            <div>
              <p className="font-medium">Application Date:</p>
              <p className="text-muted-foreground">
                {formatDate(request.applicationDate)}
              </p>
            </div>
            {request.status === "Approved - Awaiting Payment" &&
              request.paymentDeadline && (
                <div>
                  <p className="font-medium text-destructive">
                    Payment Deadline:
                  </p>
                  <p className="text-muted-foreground text-destructive">
                    {formatDate(request.paymentDeadline)}
                  </p>
                </div>
              )}
            {request.status === "Confirmed & Paid" && (
              <>
                <div>
                  <p className="font-medium">Confirmation Date:</p>
                  <p className="text-muted-foreground">
                    {formatDate(request.confirmationDate)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Pavilion/Block:</p>
                  <p className="text-muted-foreground">
                    {request.pavilion || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Floor:</p>
                  <p className="text-muted-foreground">
                    {request.floor || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Move-in Date:</p>
                  <p className="text-muted-foreground">
                    {formatDate(request.moveInDate, "PPP")}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Contract End:</p>
                  <p className="text-muted-foreground">
                    {formatDate(request.contractEndDate, "PPP")}
                  </p>
                </div>
              </>
            )}
          </div>
          {request.notes && (
            <Alert
              className={
                request.status === "Approved - Awaiting Payment"
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : ""
              }
            >
              <AlertTriangle
                className={`h-4 w-4 ${
                  request.status === "Approved - Awaiting Payment"
                    ? "!text-blue-700"
                    : ""
                }`}
              />
              <AlertTitle
                className={`${
                  request.status === "Approved - Awaiting Payment"
                    ? "text-blue-700"
                    : ""
                }`}
              >
                Important Notice
              </AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">
                {request.notes}
              </AlertDescription>
            </Alert>
          )}
          {request.status === "Rejected" && request.rejectionReason && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Reason for Rejection</AlertTitle>
              <AlertDescription>{request.rejectionReason}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {(request.status === "Pending Review" ||
            request.status === "Approved - Awaiting Payment") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancelRequest(request.id)}
            >
              Cancel Request
            </Button>
          )}
          {request.status === "Approved - Awaiting Payment" && (
            <Button className="bg-green-600 hover:bg-green-700">
              <Banknote className="mr-2 h-4 w-4" /> Proceed to Administration
              for Payment
            </Button>
          )}
          {request.status === "Confirmed & Paid" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                alert(
                  `Printing details for Room: ${request.assignedRoomNumber}`
                )
              }
            >
              <Printer className="mr-2 h-4 w-4" /> Print Room Details
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  // --- Render ---
  return (
    <DashboardShell role="student">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Room Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your housing applications.
          </p>
        </div>
        {/* --- Test State Selector --- */}
        <div className="mt-4 sm:mt-0">
          <Label
            htmlFor="requestStateSelector"
            className="text-xs text-muted-foreground"
          >
            Test Request State:
          </Label>
          <Select
            value={currentRequestStateKey}
            onValueChange={setCurrentRequestStateKey}
          >
            <SelectTrigger
              id="requestStateSelector"
              className="w-full sm:w-[280px]"
            >
              <SelectValue placeholder="Select request state..." />
            </SelectTrigger>
            <SelectContent>
              {requestStates.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!isLoading && currentRequestStateKey === "noRequest" && (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
              <SearchCode className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>No Active Room Requests</CardTitle>
            <CardDescription>
              You haven't submitted any room requests yet, or your previous
              requests are completed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Looking for a place to stay? Browse available university
              residencies.
            </p>
            <Button asChild className="bg-rose-500 hover:bg-rose-600">
              <Link to="/dashboard/student/residencies">
                <Home className="mr-2 h-4 w-4" /> Explore Residencies
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading &&
        currentRequestStateKey !== "noRequest" &&
        currentRequest &&
        renderRequestDetails(currentRequest)}
      {!isLoading &&
        currentRequestStateKey !== "noRequest" &&
        !currentRequest && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Could not load request details for the selected state.
            </CardContent>
          </Card>
        )}

      <Toaster />
    </DashboardShell>
  );
}

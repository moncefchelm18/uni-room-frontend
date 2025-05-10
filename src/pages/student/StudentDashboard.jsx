import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios"; // Keep for future API integration
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardShell from "@/components/layout/DashboardShell"; // Ensure path is correct
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Eye } from "lucide-react"; // Icons
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"; // Ensure path is correct
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

import r1 from "@/assets/images/residencies/r1.png";
import r2 from "@/assets/images/residencies/r2.png";
import r3 from "@/assets/images/residencies/r3.png";

// import { Badge } from "@/components/ui/badge"; // May not be needed for accommodation cards here

// --- Mock Data (Replace with API Fetch later) ---
const mockAccommodations = [
  {
    id: "acc001",
    _id: "acc001",
    title: "Cité Universitaire El Alia", // Assuming 'title' for name
    roomNumber: "Bloc A - 101", // Or more general like "Multiple rooms available"
    type: "Shared Room",
    price: 1500, // Example price
    wilaya: "Alger", // Location filter
    images: [r1], // Placeholder image path
    amenities: ["WiFi", "Shared Kitchen", "Laundry"],
    status: "approved",
    description:
      "Comfortable shared rooms in a central location, close to campus facilities.",
  },
  {
    id: "acc002",
    _id: "acc002",
    title: "Résidence Taleb Abderrahmane",
    roomNumber: "Studio Individuel",
    type: "Studio",
    price: 2500,
    wilaya: "Oran",
    images: [r2],
    amenities: ["Private Kitchenette", "WiFi", "Security"],
    status: "approved",
    description: "Modern studio apartments perfect for focused study.",
  },
  {
    id: "acc003",
    _id: "acc003",
    title: "Cité Universitaire Ouled Fayet",
    roomNumber: "Chambre Double",
    type: "Double Room",
    price: 1800,
    wilaya: "Alger",
    images: [r3],
    amenities: ["Study Area", "Cafeteria", "Gym Access"],
    status: "approved",
    description:
      "Spacious double rooms with access to excellent university amenities.",
  },
  {
    id: "acc004",
    _id: "acc004",
    title: "Résidence Universitaire Constantine",
    roomNumber: "Multiple Types",
    type: "Various",
    price: 2000, // Average or starting price
    wilaya: "Constantine",
    images: ["/placeholder-building1.jpg"],
    amenities: ["Library", "Transport Links", "Common Room"],
    status: "approved",
    description:
      "A variety of room types available in this well-connected residence.",
  },
];

// Mock list of Wilayas (Provinces/States) for the filter
const mockWilayas = [
  "All",
  "Alger",
  "Oran",
  "Constantine",
  "Annaba",
  "Sétif",
  "Blida",
];
// --- End Mock Data ---

// Helper function to get initials (if needed for user avatar somewhere else)
const getInitials = (name = "") => {
  /* Keep your getInitials function */
};

// --- StudentDashboard Component ---
export default function StudentDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate(); // For "See More" button
  const [userData, setUserData] = useState(null); // For welcome message
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("All"); // Default to "All"

  // Load user data from localStorage for the welcome message
  useEffect(() => {
    setIsLoading(true); // Set loading for initial data fetch
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    // Simulate fetching accommodations
    // In a real app, this useEffect would also fetch initial accommodations
    setTimeout(() => {
      setAccommodations(mockAccommodations.slice(0, 3)); // Show initial 3
      setIsLoading(false);
    }, 1000); // Simulate API delay
  }, []);

  // Handle filtering and searching (Client-side for mock data)
  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesWilaya =
      selectedWilaya === "All" || acc.wilaya === selectedWilaya;
    const matchesSearch =
      !searchQuery ||
      (acc.title &&
        acc.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesWilaya && matchesSearch;
  });

  // --- Render Loading ---
  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <Skeleton className="h-48 w-full rounded-t-lg" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <DashboardShell role="student">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {userData?.name || "Student"}!
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Find your ideal university accommodation here.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Find a Residence</CardTitle>
          <CardDescription>
            Search and filter available accommodations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by Name */}
            <div className="md:col-span-2">
              <Label htmlFor="search" className="sr-only">
                Search by Name
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  id="search"
                  placeholder="Search by residence name..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {/* Filter by Wilaya */}
            <div>
              <Label htmlFor="wilaya-filter" className="sr-only">
                Filter by Wilaya
              </Label>
              <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
                <SelectTrigger id="wilaya-filter" className="w-full">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Wilaya" />
                </SelectTrigger>
                <SelectContent>
                  {mockWilayas.map((wilaya) => (
                    <SelectItem key={wilaya} value={wilaya}>
                      {wilaya}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        {/*
        <CardFooter>
             <Button onClick={handleApplyFilters}>Apply Filters (Not implemented)</Button>
        </CardFooter>
        */}
      </Card>

      {/* Featured Residencies Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Featured Residencies</h2>
          <Button
            variant="link"
            asChild
            className="text-rose-600 hover:text-rose-700"
          >
            <Link to="/student/residencies">
              {" "}
              {/* Link to full residencies page */}
              See More <Eye className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading && renderLoadingSkeletons()}

        {!isLoading && fetchError && (
          <div className="text-center py-10 text-destructive">{fetchError}</div>
        )}

        {!isLoading && !fetchError && filteredAccommodations.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No accommodations match your current filters.
          </div>
        )}

        {!isLoading && !fetchError && filteredAccommodations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccommodations.slice(0, 3).map(
              (
                acc // Show first 3 results after filtering
              ) => (
                <Card key={acc.id} className="flex flex-col">
                  {/* Placeholder for Image - replace src */}
                  <div className="aspect-[16/9] bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={
                        acc.images && acc.images[0]
                          ? acc.images[0]
                          : "/placeholder-generic-building.jpg"
                      }
                      alt={acc.title || "Residence Image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg truncate">
                      {acc.title || "Unnamed Residence"}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <MapPin className="mr-1 h-3 w-3" />{" "}
                      {acc.wilaya || "N/A Location"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground flex-grow">
                    <p className="line-clamp-3">
                      {acc.description || "No description available."}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      className="w-full bg-rose-500 hover:bg-rose-600"
                      asChild
                    >
                      {/* Link to a specific residence details page (e.g., /student/residency/acc001) */}
                      <Link to={`/student/residency/${acc.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            )}
          </div>
        )}
      </section>

      <Toaster />
    </DashboardShell>
  );
}

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { format, parseISO } from "date-fns"; // For date formatting (optional)
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import DashboardShell from "@/components/layout/DashboardShell"; // Ensure path is correct
// import { Building, FileText, User, AlertCircle } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast"; // Ensure path is correct
// import { Toaster } from "@/components/ui/toaster";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge"; // Import Badge

// // --- Configuration ---
// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // Default fallback

// // Helper function to create Axios config with Auth header
// const createAxiosConfig = (token) => {
//   if (!token) {
//     console.error("Authentication token is missing."); // Log error instead of throwing in helper
//     return null; // Return null to indicate missing token
//   }
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// // Helper function to format dates or return placeholder
// const formatDate = (dateString) => {
//   if (!dateString) return "N/A";
//   try {
//     // Example format, adjust as needed (e.g., 'PP' for localized date)
//     return format(parseISO(dateString), "MMM dd, yyyy");
//   } catch (e) {
//     console.error("Error parsing date:", dateString, e);
//     return "Invalid Date";
//   }
// };

// export default function StudentDashboard() {
//   const { toast } = useToast();
//   const [userData, setUserData] = useState(null);
//   const [residentInfo, setResidentInfo] = useState(null); // Holds the resident record
//   const [isLoading, setIsLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);

//   // --- Fetching Function ---
//   const fetchDashboardData = useCallback(async () => {
//     setIsLoading(true);
//     setFetchError(null);
//     setUserData(null); // Reset states on fetch
//     setResidentInfo(null);
//     console.log("Fetching student dashboard data...");

//     const token = localStorage.getItem("token");
//     if (!token) {
//       const errMsg = "Authentication token not found. Please log in.";
//       setFetchError(errMsg);
//       setIsLoading(false);
//       toast({
//         title: "Authentication Error",
//         description: errMsg,
//         variant: "destructive",
//       });
//       // Optionally redirect to login page here
//       // history.push('/login');
//       return;
//     }

//     const config = createAxiosConfig(token); // Now we know token exists here

//     try {
//       // 1. Fetch User Data
//       console.log("Fetching /api/auth/me");
//       const userResponse = await axios.get(
//         `${API_BASE_URL}/api/auth/me`,
//         config
//       );
//       console.log("User Data Response:", userResponse.data);

//       if (
//         !(
//           userResponse.data &&
//           userResponse.data.success &&
//           userResponse.data.user
//         )
//       ) {
//         throw new Error("User data not found in response.");
//       }
//       const currentUserData = userResponse.data.user;
//       setUserData(currentUserData); // Set user data immediately

//       // 2. Fetch Resident Data using the new endpoint (assuming backend is updated)
//       try {
//         console.log("Fetching /api/residents/my-record");
//         const residentResponse = await axios.get(
//           `${API_BASE_URL}/api/residents/my-record`,
//           config
//         );
//         console.log("Resident Data Response:", residentResponse.data);

//         if (
//           residentResponse.data &&
//           residentResponse.data.success &&
//           residentResponse.data.resident
//         ) {
//           // Ensure _id is mapped to id if needed by components downstream
//           const fetchedResident = {
//             ...residentResponse.data.resident,
//             id: residentResponse.data.resident._id,
//           };
//           setResidentInfo(fetchedResident);
//           console.log("Resident info set:", fetchedResident);
//         } else {
//           // Handle case where success is true, but resident is null (no record found)
//           console.log("No resident record found for this user.");
//           setResidentInfo(null); // Explicitly null if no record
//         }
//       } catch (residentErr) {
//         // Don't treat failure to get resident info as a fatal dashboard error
//         console.warn(
//           "Could not fetch resident details:",
//           residentErr.response?.data || residentErr.message
//         );
//         setResidentInfo(null);
//         // Optional: Show a non-critical toast if needed
//         // toast({ title: "Housing Info", description: "Could not load accommodation details.", variant: "default" });
//       }
//     } catch (err) {
//       // Handle errors primarily from fetching user data (more critical)
//       console.error("Failed to fetch dashboard data:", err);
//       let message = "Could not load your dashboard data.";
//       if (err.response) {
//         message =
//           err.response.data?.message || `Server error: ${err.response.status}`;
//         if (err.response.status === 401)
//           message = "Unauthorized. Please log in again.";
//       } else if (err.request) {
//         message = "No response from server.";
//       } else {
//         message = err.message;
//       } // Handle non-Axios errors

//       setFetchError(message);
//       setUserData(null); // Clear potentially partial data
//       setResidentInfo(null);
//       toast({
//         title: "Loading Error",
//         description: message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast]); // Add toast as dependency

//   // --- Initial Fetch ---
//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]); // Correct dependency array

//   // --- Render Loading State ---
//   const renderLoadingState = () => (
//     <DashboardShell role="student">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
//       </div>
//       <div className="mt-2 mb-6">
//         <Skeleton className="h-5 w-3/4" />
//       </div>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
//         {/* Skeleton for Accommodation Card */}
//         <Card>
//           <CardHeader className="pb-2">
//             <Skeleton className="h-4 w-3/4 mb-2" />
//             <Skeleton className="h-4 w-1/2" />
//           </CardHeader>
//           <CardContent>
//             <Skeleton className="h-7 w-2/5 mb-1" />
//             <Skeleton className="h-4 w-1/3" />
//           </CardContent>
//           <CardFooter>
//             <Skeleton className="h-9 w-full" />
//           </CardFooter>
//         </Card>
//         {/* Skeleton for Profile Card */}
//         <Card>
//           <CardHeader className="pb-2">
//             <Skeleton className="h-4 w-1/4 mb-2" />
//             <Skeleton className="h-4 w-1/6" />
//           </CardHeader>
//           <CardContent>
//             <Skeleton className="h-7 w-3/5 mb-1" />
//             <Skeleton className="h-4 w-1/2" />
//           </CardContent>
//           <CardFooter>
//             <Skeleton className="h-9 w-full" />
//           </CardFooter>
//         </Card>
//         {/* Skeleton for Help Card */}
//         <Card>
//           <CardHeader className="pb-2">
//             <Skeleton className="h-4 w-1/3 mb-2" />
//             <Skeleton className="h-4 w-1/4" />
//           </CardHeader>
//           <CardContent>
//             <Skeleton className="h-4 w-full mb-1" />
//             <Skeleton className="h-4 w-5/6" />
//           </CardContent>
//           <CardFooter>
//             <Skeleton className="h-9 w-full" />
//           </CardFooter>
//         </Card>
//       </div>
//       {/* Skeleton for Notifications */}
//       <div className="mt-8">
//         <Card>
//           <CardHeader>
//             <Skeleton className="h-6 w-48 mb-2" />
//             <Skeleton className="h-4 w-64" />
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <Skeleton className="h-12 w-full" />
//               <Skeleton className="h-12 w-full" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardShell>
//   );

//   // --- Render Error State ---
//   const renderErrorState = () => (
//     <DashboardShell role="student">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold tracking-tight text-destructive">
//           Error
//         </h1>
//       </div>
//       <div className="mt-6">
//         <Card className="border-destructive/50 bg-destructive/10">
//           <CardHeader className="flex flex-row items-center space-x-3 space-y-0 pb-2">
//             <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
//             <CardTitle className="text-destructive">
//               Could not load dashboard
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-destructive/90">
//               {fetchError || "An unknown error occurred."}
//             </p>
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={fetchDashboardData}
//               className="mt-4"
//             >
//               Retry
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardShell>
//   );

//   // --- Check Loading/Error ---
//   if (isLoading) return renderLoadingState();
//   // Handle critical case where user data fetch failed
//   if (!isLoading && fetchError && !userData) return renderErrorState();
//   // Handle unexpected case where user fetch succeeded but data is missing
//   if (!isLoading && !userData)
//     return (
//       <div>
//         Error: User data could not be loaded. Please try logging in again.
//       </div>
//     );

//   // --- Render Main Content (Data is available) ---
//   return (
//     <DashboardShell role="student">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
//       </div>
//       <div className="mt-2">
//         <p className="text-muted-foreground">
//           Welcome back, {userData?.name || "Student"}. Manage your housing
//           information and requests.
//         </p>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
//         {/* Accommodation Info Card (Uses residentInfo) */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               My Accommodation
//             </CardTitle>
//             <Building className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             {residentInfo ? (
//               <>
//                 <div className="text-2xl font-bold">
//                   Room {residentInfo.roomNumber || "N/A"}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Status:{" "}
//                   <Badge
//                     variant={
//                       residentInfo.status === "active" ? "success" : "secondary"
//                     }
//                   >
//                     {residentInfo.status}
//                   </Badge>
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Resident Since:{" "}
//                   {residentInfo.enrollmentDate
//                     ? formatDate(residentInfo.enrollmentDate)
//                     : "N/A"}
//                 </p>
//               </>
//             ) : (
//               <>
//                 {/* Case where API returned success but resident: null */}
//                 <div className="text-md font-medium text-muted-foreground">
//                   No Record Found
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Your housing assignment details are not currently available.
//                 </p>
//               </>
//             )}
//           </CardContent>
//           <CardFooter>
//             <Button variant="outline" size="sm" className="w-full" asChild>
//               <Link to="/dashboard/student/room">View Housing</Link>
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* Profile Card (Uses User Data) */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">My Profile</CardTitle>
//             <User className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-xl font-bold">{userData.name}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               {userData.email}
//             </p>
//             <p className="text-xs text-muted-foreground mt-1 capitalize">
//               Role: {userData.role}
//             </p>
//           </CardContent>
//           <CardFooter>
//             <Button variant="outline" size="sm" className="w-full" asChild>
//               <Link to="/dashboard/student/profile">Update Profile</Link>
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* Contact Card (Static/Placeholder) */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
//             <FileText className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm text-muted-foreground">
//               Contact support or administration for any housing inquiries or
//               issues.
//             </p>
//           </CardContent>
//           <CardFooter>
//             {/* You could make this link to a contact page or trigger a modal */}
//             <Button variant="outline" size="sm" className="w-full">
//               <Link to="/dashboard/student/contact">Contact Support</Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//       {/* student can filter residenciies , by wilaya and search by name*/}
//       {/* remove recent notification*/}
//       {/* when he click a resident or book room in residence:
//             1- he sees photos of i9amaa kbira and some of chambre and details
//             2- he find contact i9ama
//             3- book a room
//             4- he choose dispo chambre and  provide details
//                 (matriccule bac, anne bac, sex, date necainse, filier, anne etude, wilaya residence)
//             5-valide
//           requsts, he see his requests,
//           after bilal approve , he see approved, and msg display you need to go i9ama for payment
//           after paying, msg displayed have been payed
//           now he can print receipt
//       */}

//       <Toaster />
//     </DashboardShell>
//   );
// }

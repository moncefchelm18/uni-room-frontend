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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Added
import { Search, MapPin, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate for navigation
import DashboardShell from "@/components/layout/DashboardShell"; // Ensure path is correct
import { Skeleton } from "@/components/ui/skeleton"; // For loading
import { Toaster } from "@/components/ui/toaster"; // Added
import { useToast } from "@/hooks/use-toast"; // Added

// --- Placeholder Image Imports ---
import r1 from "@/assets/images/residencies/r1.png";
import r2 from "@/assets/images/residencies/r2.png";
import r3 from "@/assets/images/residencies/r3.png";

const placeholderImages = [r1, r2, r3];
const getRandomPlaceholderImage = (id) => {
  // Simple hash function to get a consistent image per ID (very basic)
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return placeholderImages[Math.abs(hash) % placeholderImages.length];
};
// --- End Placeholder Image Imports ---

// --- Mock Data (Full List - Replace with API Fetch) ---
const allMockAccommodations = [
  {
    id: "r-001",
    _id: "r-001",
    title: "Cité El Alia - Alger Centre",
    wilaya: "Alger",
    type: "Shared Room",
    price: 1500,
    amenities: ["WiFi", "Shared Kitchen", "Laundry"],
    status: "approved",
    description:
      "Vibrant student residence in the heart of Algiers, offering shared rooms and easy access to multiple university campuses. Features common study areas and a lively student community.",
    images: [r1, r2],
    roomImages: [r3, r1] /* placeholder for room-specific images */,
  },
  {
    id: "r-002",
    _id: "r-002",
    title: "Résidence Taleb Abderrahmane - Oran",
    wilaya: "Oran",
    type: "Studio",
    price: 2500,
    amenities: ["Private Kitchenette", "WiFi", "Security"],
    status: "approved",
    description:
      "Modern studio apartments in Oran, designed for students seeking privacy and comfort. Each unit includes a kitchenette and study space. Close to public transport.",
    images: [r2, r3],
    roomImages: [r1, r2],
  },
  {
    id: "r-003",
    _id: "r-003",
    title: "Cité Ouled Fayet - Alger Ouest",
    wilaya: "Alger",
    type: "Double Room",
    price: 1800,
    amenities: ["Study Area", "Cafeteria", "Gym Access"],
    status: "approved",
    description:
      "Located in Ouled Fayet, this residence offers spacious double rooms with access to excellent university amenities, including a cafeteria and sports facilities.",
    images: [r3, r1],
    roomImages: [r2, r3],
  },
  {
    id: "r-004",
    _id: "r-004",
    title: "Résidence Universitaire Constantine",
    wilaya: "Constantine",
    type: "Various",
    price: 2000,
    amenities: ["Library", "Transport Links", "Common Room"],
    status: "approved",
    description:
      "A large complex in Constantine providing a variety of room types to suit different needs. Features include an on-site library and excellent transport connections.",
    images: [r1, r3],
    roomImages: [r2, r1],
  },
  {
    id: "r-005",
    _id: "r-005",
    title: "Campus Sétif - El Bez",
    wilaya: "Sétif",
    type: "Single Room",
    price: 2200,
    amenities: ["Ensuite Bathroom", "WiFi", "Parking"],
    status: "approved",
    description:
      "Single rooms with ensuite facilities at the El Bez campus in Sétif. Ideal for students looking for quiet and independence. Parking available.",
    images: [r2, r1],
    roomImages: [r3, r2],
  },
  {
    id: "r-006",
    _id: "r-006",
    title: "Cité Universitaire Annaba - Sidi Amar",
    wilaya: "Annaba",
    type: "Shared (3-person)",
    price: 1200,
    amenities: ["Large Common Area", "Balcony", "Kitchenette"],
    status: "approved",
    description:
      "Affordable three-person shared rooms at the Sidi Amar campus in Annaba. Each unit features a balcony and access to shared kitchenette facilities.",
    images: [r3, r2],
    roomImages: [r1, r3],
  },
  {
    id: "r-007",
    _id: "r-007",
    title: "Résidence des Frères Mentouri - Constantine",
    wilaya: "Constantine",
    type: "Studio Plus",
    price: 2800,
    amenities: ["Modern Design", "All Bills Included", "Gym"],
    status: "approved",
    description:
      "Premium studio apartments at Frères Mentouri University. Modern design, all utility bills included, and access to a state-of-the-art gym.",
    images: [r1, r2, r3],
    roomImages: [r2, r1, r3],
  },
];

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

const ITEMS_PER_PAGE = 6; // Show more items per page on this list

export default function StudentResidencies() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Placeholder: Simulate fetching all accommodations
  useEffect(() => {
    setIsLoading(true);
    console.log("Simulating fetch ALL accommodations...");
    setTimeout(() => {
      setAccommodations(allMockAccommodations); // Use the full mock list
      setIsLoading(false);
    }, 500); // Simulate API delay
  }, []);

  // Client-side filtering and searching for mock data
  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesWilaya =
      selectedWilaya === "All" || acc.wilaya === selectedWilaya;
    const matchesSearch =
      !searchQuery ||
      (acc.title &&
        acc.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesWilaya && matchesSearch;
  });

  // Client-side pagination
  const totalPages =
    Math.ceil(filteredAccommodations.length / ITEMS_PER_PAGE) || 1;
  const paginatedAccommodations = filteredAccommodations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleWilayaChange = (value) => {
    setSelectedWilaya(value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Navigate to detail page
  const handleViewDetails = (residencyId) => {
    navigate(`/dashboard/student/residencies/${residencyId}`); // Use student-specific route
  };

  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(ITEMS_PER_PAGE)].map(
        (
          _,
          i // Use ITEMS_PER_PAGE for skeletons
        ) => (
          <Card key={`skel-${i}`}>
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
        )
      )}
    </div>
  );

  return (
    <DashboardShell role="student">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          University Residencies
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Browse and discover available accommodations.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Residencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search-residencies" className="sr-only">
                Search by Name
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  id="search-residencies"
                  placeholder="Search by residence name or city..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="wilaya-filter-page" className="sr-only">
                Filter by Wilaya
              </Label>
              <Select value={selectedWilaya} onValueChange={handleWilayaChange}>
                <SelectTrigger id="wilaya-filter-page" className="w-full">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                  <SelectValue placeholder="Filter by Wilaya" />
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
          </div>
        </CardContent>
      </Card>

      {/* Residencies Grid */}
      <section>
        {isLoading && renderLoadingSkeletons()}
        {!isLoading && fetchError && (
          <div className="text-center py-10 text-destructive">{fetchError}</div>
        )}
        {!isLoading && !fetchError && paginatedAccommodations.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            {" "}
            No accommodations found matching your criteria.{" "}
          </div>
        )}

        {!isLoading && !fetchError && paginatedAccommodations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAccommodations.map((acc) => (
              <Card
                key={acc.id}
                className="flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/9] bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={getRandomPlaceholderImage(acc.id)}
                    alt={acc.title || "Residence"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg truncate">
                    {acc.title || "Unnamed Residence"}
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    {" "}
                    <MapPin className="mr-1 h-3 w-3" /> {acc.wilaya || "N/A"}{" "}
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
                    onClick={() => handleViewDetails(acc.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" /> View Details & Book
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 py-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {" "}
              Page {currentPage} of {totalPages}{" "}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </section>
      <Toaster />
    </DashboardShell>
  );
}

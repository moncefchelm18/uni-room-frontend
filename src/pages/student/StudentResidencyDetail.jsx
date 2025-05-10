import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import DashboardShell from "@/components/layout/DashboardShell";
import {
  ArrowLeft,
  MessageCircle,
  BedDouble,
  CalendarDays,
  MapPin,
  CheckCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// --- Placeholder Image Imports (Same as Listing Page) ---
import r1 from "@/assets/images/residencies/r1.png";
import r2 from "@/assets/images/residencies/r2.png";
import r3 from "@/assets/images/residencies/r3.png";

const placeholderImages = [r1, r2, r3];
const getRandomPlaceholderImage = (id = "default") => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return placeholderImages[Math.abs(hash) % placeholderImages.length];
};
// --- End Placeholder Image Imports ---

// --- Mock Data (to find a specific residency by ID) ---
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
// --- End Mock Data ---

// --- Form State for Booking Dialog ---
const initialBookingFormData = {
  matriculeBac: "",
  anneeBac: "",
  sex: "", // male, female
  dateNaissance: "", // YYYY-MM-DD
  filiere: "", // Your major/field of study
  anneeEtude: "", // 1st year, 2nd year, etc.
  wilayaResidence: "", // Wilaya of the student's origin
};

// --- Available Rooms Mock Data (for selected residency) ---
// This would be fetched based on selectedResidency.id
const mockAvailableRooms = [
  {
    id: "roomA101",
    roomNumber: "A-101",
    type: "Single",
    floor: 1,
    capacity: 1,
    price: 2200,
  },
  {
    id: "roomB203",
    roomNumber: "B-203",
    type: "Shared (2-person)",
    floor: 2,
    capacity: 2,
    price: 1500,
  },
  {
    id: "roomC305",
    roomNumber: "C-305",
    type: "Shared (3-person)",
    floor: 3,
    capacity: 3,
    price: 1200,
  },
];

export default function StudentResidencyDetail() {
  const { residencyId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const { toast } = useToast();

  const [residency, setResidency] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(""); // ID of the chosen room
  const [bookingFormData, setBookingFormData] = useState(
    initialBookingFormData
  );

  // Simulate fetching residency details
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    console.log("Simulating fetch residency details for ID:", residencyId);
    setTimeout(() => {
      const foundResidency = allMockAccommodations.find(
        (acc) => acc.id === residencyId
      );
      if (foundResidency) {
        setResidency(foundResidency);
      } else {
        setError("Residency not found.");
        toast({
          title: "Error",
          description: "Could not find the requested residency.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 700);
  }, [residencyId, toast]);

  const handleContactSubmit = () => {
    if (!contactMessage.trim()) {
      toast({
        title: "Message Empty",
        description: "Please enter your message.",
        variant: "destructive",
      });
      return;
    }
    console.log(
      `Placeholder: Sending message about ${residency?.title}: ${contactMessage}`
    );
    // --- API call for contact message would go here ---
    toast({
      title: "Message Sent (Placeholder)",
      description: "Your message has been sent.",
    });
    setIsContactDialogOpen(false);
    setContactMessage("");
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleBookingSelectChange = (field, value) => {
    setBookingFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookRoomSubmit = () => {
    console.log(
      `Placeholder: Submitting booking for Room ID ${selectedRoomForBooking} at ${residency?.title}`
    );
    console.log("Booking Form Data:", bookingFormData);
    // --- API call for booking submission would go here ---
    // Validate bookingFormData
    // On success:
    toast({
      title: "Booking Request Submitted (Placeholder)",
      description: "Your booking request has been sent for processing.",
    });
    setIsBookingDialogOpen(false);
    setSelectedRoomForBooking("");
    setBookingFormData(initialBookingFormData);
    // On failure:
    // toast({title: "Booking Error", description: "Failed to submit booking.", variant: "destructive"});
  };

  if (isLoading) {
    return (
      <DashboardShell role="student">
        <div className="container px-4 md:px-6 py-8">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell role="student">
        <div className="container px-4 md:px-6 py-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild variant="outline">
            <Link to="/student/residencies">
              {" "}
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Residencies{" "}
            </Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  if (!residency) {
    return (
      // Fallback if not loading and no error, but residency still null
      <DashboardShell role="student">
        <div className="container px-4 md:px-6 py-8 text-center">
          <p className="text-muted-foreground">
            Residency details not available.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/dashboard/student/residencies">
              {" "}
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Residencies{" "}
            </Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  // Main render after data is loaded
  return (
    <DashboardShell role="student">
      <div className="container px-4 md:px-6 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>

        {/* Residency Details */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Images & Description */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{residency.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {residency.wilaya}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Main Image Carousel/Gallery Placeholder */}
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <img
                    src={getRandomPlaceholderImage(residency.id + "main")}
                    alt={`${residency.title} main`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Additional Room Images Placeholder */}
                <h3 className="text-lg font-semibold mb-2">
                  Room Previews (Sample)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    residency.roomImages || [
                      placeholderImages[1],
                      placeholderImages[2],
                    ]
                  ).map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-muted rounded overflow-hidden"
                    >
                      <img
                        src={imgSrc}
                        alt={`Room view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Description & Amenities</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>{residency.description}</p>
                {residency.amenities && residency.amenities.length > 0 && (
                  <>
                    <h4 className="font-semibold mt-4">Amenities:</h4>
                    <ul className="list-disc list-inside">
                      {residency.amenities.map((amenity) => (
                        <li key={amenity}>{amenity}</li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Actions & Booking */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book a Room</CardTitle>
                <CardDescription>
                  Select an available room type and submit your application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="room-type-select">
                    Select Available Room
                  </Label>
                  {/* This select should list ACTUAL available rooms for THIS residency from API */}
                  <Select
                    onValueChange={setSelectedRoomForBooking}
                    value={selectedRoomForBooking}
                  >
                    <SelectTrigger id="room-type-select">
                      <SelectValue placeholder="Choose a room type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAvailableRooms.map(
                        (
                          room // Replace with API data
                        ) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.roomNumber} - {room.type} (€{room.price})
                          </SelectItem>
                        )
                      )}
                      {mockAvailableRooms.length === 0 && (
                        <SelectItem value="" disabled>
                          No rooms currently listed
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {!selectedRoomForBooking && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Please select a room to proceed.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog
                  open={isBookingDialogOpen}
                  onOpenChange={setIsBookingDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-rose-500 hover:bg-rose-600"
                      disabled={!selectedRoomForBooking}
                    >
                      <BedDouble className="mr-2 h-4 w-4" /> Apply for this Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md md:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Room Booking Application</DialogTitle>
                      <DialogDescription>
                        Provide your details to apply for room:{" "}
                        {mockAvailableRooms.find(
                          (r) => r.id === selectedRoomForBooking
                        )?.roomNumber || "Selected Room"}
                        .
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                      {/* Booking Form Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="matriculeBac">Matricule BAC*</Label>
                          <Input
                            id="matriculeBac"
                            name="matriculeBac"
                            value={bookingFormData.matriculeBac}
                            onChange={handleBookingFormChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="anneeBac">Année BAC*</Label>
                          <Input
                            id="anneeBac"
                            name="anneeBac"
                            type="number"
                            placeholder="YYYY"
                            value={bookingFormData.anneeBac}
                            onChange={handleBookingFormChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="sex">Sex*</Label>
                          <Select
                            name="sex"
                            value={bookingFormData.sex}
                            onValueChange={(val) =>
                              handleBookingSelectChange("sex", val)
                            }
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sex..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="dateNaissance">
                            Date de Naissance*
                          </Label>
                          <Input
                            id="dateNaissance"
                            name="dateNaissance"
                            type="date"
                            value={bookingFormData.dateNaissance}
                            onChange={handleBookingFormChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="filiere">Filière (Major)*</Label>
                          <Input
                            id="filiere"
                            name="filiere"
                            value={bookingFormData.filiere}
                            onChange={handleBookingFormChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="anneeEtude">Année d'Étude*</Label>
                          <Input
                            id="anneeEtude"
                            name="anneeEtude"
                            placeholder="e.g., 1st, L1, M2"
                            value={bookingFormData.anneeEtude}
                            onChange={handleBookingFormChange}
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="wilayaResidence">
                            Wilaya de Résidence (Origin)*
                          </Label>
                          <Input
                            id="wilayaResidence"
                            name="wilayaResidence"
                            value={bookingFormData.wilayaResidence}
                            onChange={handleBookingFormChange}
                            required
                          />
                        </div>
                      </div>
                      {/* Add more form fields here based on your complete list */}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        onClick={handleBookRoomSubmit}
                        className="bg-rose-500 hover:bg-rose-600"
                      >
                        Submit Application
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Residence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Have questions? Get in touch directly with the residence
                  administration.
                </p>
              </CardContent>
              <CardFooter>
                <Dialog
                  open={isContactDialogOpen}
                  onOpenChange={setIsContactDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Residence
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact {residency.title}</DialogTitle>
                      <DialogDescription>
                        Send a message to the residence.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                      <Label htmlFor="contactMessage">Your Message</Label>
                      <Textarea
                        id="contactMessage"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={5}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={handleContactSubmit}
                        disabled={!contactMessage.trim()}
                      >
                        Send Message
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </DashboardShell>
  );
}

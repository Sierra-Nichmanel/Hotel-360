
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Filter,
  Plus,
  Calendar,
  Search,
  Edit,
  Trash2,
  CalendarCheck,
  CalendarX,
  Check,
  X,
  Menu,
  ChevronRight,
  ChevronDown,
  User
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Demo data for bookings
const demoBookings = [
  {
    id: 1,
    guestName: "John Smith",
    roomNumber: "101",
    checkInDate: new Date("2023-07-15"),
    checkOutDate: new Date("2023-07-20"),
    status: "checked_in",
    totalAmount: 750.00,
    paymentStatus: "paid",
    guestId: 1,
    roomId: 1,
    bookingSource: "Website",
    specialRequests: "Extra pillows, late check-out",
    created: new Date("2023-07-01")
  },
  {
    id: 2,
    guestName: "Emily Johnson",
    roomNumber: "205",
    checkInDate: new Date("2023-07-18"),
    checkOutDate: new Date("2023-07-22"),
    status: "confirmed",
    totalAmount: 600.00,
    paymentStatus: "partial",
    guestId: 2,
    roomId: 15,
    bookingSource: "Booking.com",
    specialRequests: "High floor with city view",
    created: new Date("2023-07-05")
  },
  {
    id: 3,
    guestName: "Michael Lee",
    roomNumber: "310",
    checkInDate: new Date("2023-07-10"),
    checkOutDate: new Date("2023-07-13"),
    status: "checked_out",
    totalAmount: 450.00,
    paymentStatus: "paid",
    guestId: 3,
    roomId: 30,
    bookingSource: "Direct call",
    specialRequests: "",
    created: new Date("2023-06-20")
  },
  {
    id: 4,
    guestName: "Sarah Williams",
    roomNumber: "402",
    checkInDate: new Date("2023-07-25"),
    checkOutDate: new Date("2023-07-30"),
    status: "confirmed",
    totalAmount: 875.00,
    paymentStatus: "pending",
    guestId: 4,
    roomId: 42,
    bookingSource: "Expedia",
    specialRequests: "Allergic to feathers, require hypoallergenic bedding",
    created: new Date("2023-07-10")
  },
  {
    id: 5,
    guestName: "David Brown",
    roomNumber: "115",
    checkInDate: new Date("2023-07-12"),
    checkOutDate: new Date("2023-07-14"),
    status: "no_show",
    totalAmount: 300.00,
    paymentStatus: "pending",
    guestId: 5,
    roomId: 5,
    bookingSource: "Travel Agent",
    specialRequests: "",
    created: new Date("2023-07-01")
  },
  {
    id: 6,
    guestName: "Jennifer Martinez",
    roomNumber: "512",
    checkInDate: new Date("2023-07-30"),
    checkOutDate: new Date("2023-08-05"),
    status: "confirmed",
    totalAmount: 1200.00,
    paymentStatus: "deposit",
    guestId: 6,
    roomId: 52,
    bookingSource: "Website",
    specialRequests: "Birthday celebration, please prepare something special",
    created: new Date("2023-07-15")
  },
  {
    id: 7,
    guestName: "Robert Taylor",
    roomNumber: "208",
    checkInDate: new Date("2023-07-21"),
    checkOutDate: new Date("2023-07-24"),
    status: "cancelled",
    totalAmount: 450.00,
    paymentStatus: "refunded",
    guestId: 7,
    roomId: 18,
    bookingSource: "Phone",
    specialRequests: "",
    created: new Date("2023-07-05")
  }
];

// Demo data for available rooms
const demoRooms = [
  { id: 1, number: "101", type: "Standard", floor: 1, status: "occupied" },
  { id: 5, number: "115", type: "Standard", floor: 1, status: "available" },
  { id: 15, number: "205", type: "Deluxe", floor: 2, status: "occupied" },
  { id: 18, number: "208", type: "Deluxe", floor: 2, status: "available" },
  { id: 30, number: "310", type: "Suite", floor: 3, status: "available" },
  { id: 42, number: "402", type: "Presidential Suite", floor: 4, status: "booked" },
  { id: 52, number: "512", type: "Deluxe", floor: 5, status: "booked" }
];

// Demo data for guests
const demoGuests = [
  { id: 1, firstName: "John", lastName: "Smith", email: "john.smith@example.com", phone: "555-123-4567" },
  { id: 2, firstName: "Emily", lastName: "Johnson", email: "emily.johnson@example.com", phone: "555-234-5678" },
  { id: 3, firstName: "Michael", lastName: "Lee", email: "michael.lee@example.com", phone: "555-345-6789" },
  { id: 4, firstName: "Sarah", lastName: "Williams", email: "sarah.williams@example.com", phone: "555-456-7890" },
  { id: 5, firstName: "David", lastName: "Brown", email: "david.brown@example.com", phone: "555-567-8901" },
  { id: 6, firstName: "Jennifer", lastName: "Martinez", email: "jennifer.martinez@example.com", phone: "555-678-9012" },
  { id: 7, firstName: "Robert", lastName: "Taylor", email: "robert.taylor@example.com", phone: "555-789-0123" }
];

// Get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "checked_in":
      return "bg-green-100 text-green-800";
    case "checked_out":
      return "bg-gray-100 text-gray-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "no_show":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Get payment status badge color
const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "partial":
      return "bg-blue-100 text-blue-800";
    case "deposit":
      return "bg-purple-100 text-purple-800";
    case "refunded":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Format status for display
const formatStatus = (status: string) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

interface BookingFormData {
  id?: number;
  guestId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  bookingSource: string;
  specialRequests: string;
}

// Booking Card Component for mobile view
const BookingCard = ({ 
  booking, 
  onView, 
  onEdit, 
  onDelete 
}: { 
  booking: typeof demoBookings[0],
  onView: (booking: typeof demoBookings[0]) => void,
  onEdit: (booking: typeof demoBookings[0]) => void,
  onDelete: (id: number) => void
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">#{booking.id} - {booking.guestName}</CardTitle>
          <CardDescription>Room {booking.roomNumber}</CardDescription>
        </div>
        <Badge className={getStatusColor(booking.status)}>
          {formatStatus(booking.status)}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{format(booking.checkInDate, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{format(booking.checkOutDate, "MMM d, yyyy")}</span>
          </div>
          <div className="mt-1">
            <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
              {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
            </Badge>
          </div>
          <div className="mt-1 text-right">
            <span className="font-medium">${booking.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t text-sm">
            <p className="mb-2"><span className="font-medium">Source:</span> {booking.bookingSource || "N/A"}</p>
            {booking.specialRequests && (
              <p className="mb-2"><span className="font-medium">Requests:</span> {booking.specialRequests}</p>
            )}
            <p><span className="font-medium">Created:</span> {format(booking.created, "PPP")}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? "Show less" : "Show more"} 
          {isExpanded ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronRight className="h-3 w-3 ml-1" />}
        </Button>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(booking)}>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(booking)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onDelete(booking.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState(demoBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<typeof demoBookings[0] | null>(null);
  const [formTab, setFormTab] = useState("guest");
  const [view, setView] = useState<'card' | 'table'>(window.innerWidth < 768 ? 'card' : 'table');
  
  // Form data state
  const [formData, setFormData] = useState<BookingFormData>({
    guestId: 0,
    roomId: 0,
    checkInDate: new Date(),
    checkOutDate: new Date(Date.now() + 86400000), // Tomorrow
    status: "confirmed",
    totalAmount: 0,
    paymentStatus: "pending",
    bookingSource: "",
    specialRequests: "",
  });

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle booking form submission
  const handleSubmit = () => {
    if (formData.guestId === 0) {
      toast({
        title: "Error",
        description: "Please select a guest",
        variant: "destructive",
      });
      return;
    }

    if (formData.roomId === 0) {
      toast({
        title: "Error",
        description: "Please select a room",
        variant: "destructive",
      });
      return;
    }

    // Calculate nights and amount
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / oneDay));
    
    if (diffDays < 1) {
      toast({
        title: "Error",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    // Find room and guest details
    const room = demoRooms.find(r => r.id === formData.roomId);
    const guest = demoGuests.find(g => g.id === formData.guestId);

    if (!room || !guest) {
      toast({
        title: "Error",
        description: "Invalid room or guest selection",
        variant: "destructive",
      });
      return;
    }

    // Create new booking object
    const newBooking = {
      id: formData.id || Math.max(...bookings.map(b => b.id), 0) + 1,
      guestName: `${guest.firstName} ${guest.lastName}`,
      roomNumber: room.number,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      status: formData.status,
      totalAmount: formData.totalAmount,
      paymentStatus: formData.paymentStatus,
      guestId: formData.guestId,
      roomId: formData.roomId,
      bookingSource: formData.bookingSource,
      specialRequests: formData.specialRequests,
      created: new Date()
    };

    if (formData.id) {
      // Edit existing booking
      setBookings(bookings.map(b => b.id === formData.id ? newBooking : b));
      toast({
        title: "Booking updated",
        description: `Booking #${newBooking.id} has been updated`,
      });
    } else {
      // Add new booking
      setBookings([...bookings, newBooking]);
      toast({
        title: "Booking created",
        description: `New booking created for ${guest.firstName} ${guest.lastName}`,
      });
    }

    // Reset form and close dialog
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      guestId: 0,
      roomId: 0,
      checkInDate: new Date(),
      checkOutDate: new Date(Date.now() + 86400000), // Tomorrow
      status: "confirmed",
      totalAmount: 0,
      paymentStatus: "pending",
      bookingSource: "",
      specialRequests: "",
    });
    setFormTab("guest");
  };

  // Handle booking deletion
  const handleDeleteBooking = (id: number) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    toast({
      title: "Booking deleted",
      description: `Booking #${id} has been deleted`,
    });
  };

  // Handle booking status change
  const handleStatusChange = (id: number, newStatus: string) => {
    setBookings(bookings.map(booking => {
      if (booking.id === id) {
        return { ...booking, status: newStatus };
      }
      return booking;
    }));

    const statusText = formatStatus(newStatus);
    toast({
      title: `Booking ${statusText}`,
      description: `Booking #${id} has been marked as ${statusText.toLowerCase()}`,
    });
  };

  // Initialize form for editing
  const handleEditBooking = (booking: typeof demoBookings[0]) => {
    setFormData({
      id: booking.id,
      guestId: booking.guestId,
      roomId: booking.roomId,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      status: booking.status,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      bookingSource: booking.bookingSource,
      specialRequests: booking.specialRequests,
    });
    setIsAddDialogOpen(true);
  };

  // View booking details
  const handleViewBooking = (booking: typeof demoBookings[0]) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  // Recalculate total amount when room or dates change
  const calculateTotal = () => {
    if (formData.roomId === 0) return;
    
    const room = demoRooms.find(r => r.id === formData.roomId);
    if (!room) return;
    
    // Calculate number of nights
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / oneDay));
    
    // Calculate rate based on room type
    let ratePerNight = 0;
    switch (room.type) {
      case "Standard":
        ratePerNight = 100;
        break;
      case "Deluxe":
        ratePerNight = 150;
        break;
      case "Suite":
        ratePerNight = 250;
        break;
      case "Presidential Suite":
        ratePerNight = 500;
        break;
      default:
        ratePerNight = 100;
    }
    
    const total = ratePerNight * diffDays;
    setFormData({...formData, totalAmount: total});
  };

  // Toggle view between card and table
  const toggleView = () => {
    setView(view === 'card' ? 'table' : 'card');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-muted-foreground">Manage reservations and check-ins/outs.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{formData.id ? "Edit Booking" : "Add New Booking"}</DialogTitle>
              <DialogDescription>
                {formData.id 
                  ? "Update the booking information below." 
                  : "Fill in the details to create a new booking."}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={formTab} onValueChange={setFormTab} className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="guest">Guest Info</TabsTrigger>
                <TabsTrigger value="booking">Booking Details</TabsTrigger>
                <TabsTrigger value="payment">Payment & Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="guest" className="space-y-4 py-4">
                <div>
                  <Label htmlFor="guestId">Select Guest</Label>
                  <Select
                    value={formData.guestId.toString()}
                    onValueChange={(value) => setFormData({...formData, guestId: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a guest" />
                    </SelectTrigger>
                    <SelectContent>
                      {demoGuests.map((guest) => (
                        <SelectItem key={guest.id} value={guest.id.toString()}>
                          {guest.firstName} {guest.lastName} ({guest.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="roomId">Select Room</Label>
                  <Select
                    value={formData.roomId.toString()}
                    onValueChange={(value) => {
                      setFormData({...formData, roomId: parseInt(value)});
                      calculateTotal();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {demoRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          Room {room.number} ({room.type}) - {room.status === "available" ? "Available" : room.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.checkInDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.checkInDate ? (
                            format(formData.checkInDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formData.checkInDate}
                          onSelect={(date) => {
                            if (date) {
                              setFormData({...formData, checkInDate: date});
                              calculateTotal();
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.checkOutDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.checkOutDate ? (
                            format(formData.checkOutDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formData.checkOutDate}
                          onSelect={(date) => {
                            if (date) {
                              setFormData({...formData, checkOutDate: date});
                              calculateTotal();
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="booking" className="space-y-4 py-4">
                <div>
                  <Label htmlFor="status">Booking Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="checked_in">Checked In</SelectItem>
                      <SelectItem value="checked_out">Checked Out</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="bookingSource">Booking Source</Label>
                  <Select
                    value={formData.bookingSource}
                    onValueChange={(value) => setFormData({...formData, bookingSource: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select booking source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Walk-in">Walk-in</SelectItem>
                      <SelectItem value="Booking.com">Booking.com</SelectItem>
                      <SelectItem value="Expedia">Expedia</SelectItem>
                      <SelectItem value="Travel Agent">Travel Agent</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Input
                    id="specialRequests"
                    placeholder="Any special requests from the guest"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-4 py-4">
                <div>
                  <Label htmlFor="totalAmount">Total Amount ($)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({...formData, totalAmount: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value) => setFormData({...formData, paymentStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 sm:flex-initial" onClick={handleSubmit}>
                {formData.id ? "Update Booking" : "Create Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* View Booking Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
            {selectedBooking && (
              <>
                <DialogHeader>
                  <DialogTitle>Booking #{selectedBooking.id} Details</DialogTitle>
                  <DialogDescription>
                    Created on {format(selectedBooking.created, "PPP")}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Guest</h3>
                    <p>{selectedBooking.guestName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Room</h3>
                    <p>{selectedBooking.roomNumber}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Check-in</h3>
                    <p>{format(selectedBooking.checkInDate, "PPP")}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Check-out</h3>
                    <p>{format(selectedBooking.checkOutDate, "PPP")}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Status</h3>
                    <p className={`text-xs w-fit px-2 py-1 rounded-full ${getStatusColor(selectedBooking.status)}`}>
                      {formatStatus(selectedBooking.status)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Payment Status</h3>
                    <p className={`text-xs w-fit px-2 py-1 rounded-full ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                      {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Total Amount</h3>
                    <p>${selectedBooking.totalAmount.toFixed(2)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Booking Source</h3>
                    <p>{selectedBooking.bookingSource || "N/A"}</p>
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <h3 className="font-medium text-sm">Special Requests</h3>
                    <p className="text-sm">{selectedBooking.specialRequests || "None"}</p>
                  </div>
                </div>
                
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleEditBooking(selectedBooking);
                        setIsViewDialogOpen(false);
                      }}
                      className="flex-1 sm:flex-none"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDeleteBooking(selectedBooking.id);
                        setIsViewDialogOpen(false);
                      }}
                      className="flex-1 sm:flex-none"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
                    {selectedBooking.status === "confirmed" && (
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          handleStatusChange(selectedBooking.id, "checked_in");
                          setIsViewDialogOpen(false);
                        }}
                      >
                        <Check className="mr-2 h-4 w-4" /> Check In
                      </Button>
                    )}
                    
                    {selectedBooking.status === "checked_in" && (
                      <Button
                        variant="default"
                        onClick={() => {
                          handleStatusChange(selectedBooking.id, "checked_out");
                          setIsViewDialogOpen(false);
                        }}
                      >
                        <CalendarCheck className="mr-2 h-4 w-4" /> Check Out
                      </Button>
                    )}
                    
                    {(selectedBooking.status === "confirmed" || selectedBooking.status === "checked_in") && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleStatusChange(selectedBooking.id, "cancelled");
                          setIsViewDialogOpen(false);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guest or room..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked_in">Checked In</SelectItem>
              <SelectItem value="checked_out">Checked Out</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={toggleView} className="w-[40px] px-0" title="Toggle view">
            {view === 'card' ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg> : 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            }
          </Button>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredBookings.length} {statusFilter === "all" ? "" : formatStatus(statusFilter).toLowerCase()} bookings
        </p>
        
        {/* Mobile Card View */}
        {view === 'card' && (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center p-8 border rounded-md">
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onView={handleViewBooking}
                  onEdit={handleEditBooking}
                  onDelete={handleDeleteBooking}
                />
              ))
            )}
          </div>
        )}
        
        {/* Desktop Table View */}
        {view === 'table' && (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableCaption>List of all {statusFilter === "all" ? "" : formatStatus(statusFilter)} bookings</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-In</TableHead>
                  <TableHead>Check-Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{booking.guestName}</TableCell>
                      <TableCell>{booking.roomNumber}</TableCell>
                      <TableCell>{format(booking.checkInDate, "MMM d, yyyy")}</TableCell>
                      <TableCell>{format(booking.checkOutDate, "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                          {formatStatus(booking.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>${booking.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewBooking(booking)}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditBooking(booking)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDeleteBooking(booking.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;

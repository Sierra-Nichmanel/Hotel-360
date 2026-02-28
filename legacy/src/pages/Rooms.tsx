import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Search, Edit, Trash2, Filter, Check, X, Home, Coffee, Tv, Wifi, Droplets, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, Room } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useBreakpoint, useIsMobile } from '@/hooks/use-mobile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingDialog } from '@/components/rooms/BookingDialog';

const roomFormSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  type: z.string().min(1, "Room type is required"),
  floor: z.coerce.number().int().min(1, "Floor must be at least 1"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  pricePerNight: z.coerce.number().min(0.01, "Price must be greater than 0"),
  status: z.enum(["available", "occupied", "maintenance", "cleaning"]),
  amenities: z.array(z.string()).min(1, "Select at least one amenity")
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

function getStatusColor(status: Room['status']) {
  switch (status) {
    case 'available':
      return 'bg-green-500 hover:bg-green-600';
    case 'occupied':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'maintenance':
      return 'bg-amber-500 hover:bg-amber-600';
    case 'cleaning':
      return 'bg-purple-500 hover:bg-purple-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
}

function getAmenityIcon(amenity: string) {
  switch (amenity.toLowerCase()) {
    case 'tv':
      return <Tv className="h-4 w-4" />;
    case 'wifi':
      return <Wifi className="h-4 w-4" />;
    case 'coffee machine':
      return <Coffee className="h-4 w-4" />;
    case 'jacuzzi':
      return <Droplets className="h-4 w-4" />;
    default:
      return <Home className="h-4 w-4" />;
  }
}

const Rooms = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      number: "",
      type: "Standard",
      floor: 1,
      capacity: 2,
      pricePerNight: 100,
      status: "available",
      amenities: ["TV", "WiFi"]
    }
  });

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const allRooms = await db.rooms.toArray();
      return allRooms;
    }
  });

  const addRoomMutation = useMutation({
    mutationFn: async (newRoom: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = await db.rooms.add({
        ...newRoom,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id, ...newRoom };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsFormOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Room added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding room:', error);
      toast({
        title: "Error",
        description: "Failed to add room. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateRoomMutation = useMutation({
    mutationFn: async (room: Room) => {
      await db.rooms.update(room.id!, {
        ...room,
        updatedAt: new Date()
      });
      return room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsFormOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Room updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating room:', error);
      toast({
        title: "Error",
        description: "Failed to update room. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async (id: number) => {
      await db.rooms.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsDeleteDialogOpen(false);
      setSelectedRoom(null);
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting room:', error);
      toast({
        title: "Error",
        description: "Failed to delete room. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      searchQuery === "" || 
      room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "available" && room.status === "available") ||
      (activeTab === "occupied" && room.status === "occupied") ||
      (activeTab === "maintenance" && (room.status === "maintenance" || room.status === "cleaning"));
    
    return matchesSearch && matchesTab;
  });

  const onSubmit = (data: RoomFormValues) => {
    const roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'> = {
      number: data.number,
      type: data.type,
      floor: data.floor,
      capacity: data.capacity,
      pricePerNight: data.pricePerNight,
      status: data.status,
      amenities: data.amenities,
      lastCleanedAt: new Date(),
      nextMaintenanceAt: undefined,
      notes: ""
    };

    if (selectedRoom) {
      updateRoomMutation.mutate({
        ...selectedRoom,
        ...roomData
      });
    } else {
      addRoomMutation.mutate(roomData);
    }
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    form.reset({
      number: room.number,
      type: room.type,
      floor: room.floor,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      status: room.status,
      amenities: room.amenities
    });
    setIsFormOpen(true);
  };

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsDetailsOpen(true);
  };

  const handleDeleteRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
  };

  const handleNewRoom = () => {
    setSelectedRoom(null);
    form.reset({
      number: "",
      type: "Standard",
      floor: 1,
      capacity: 2,
      pricePerNight: 100,
      status: "available",
      amenities: ["TV", "WiFi"]
    });
    setIsFormOpen(true);
  };

  const availableAmenities = [
    "TV", 
    "WiFi", 
    "Air Conditioning", 
    "Mini Bar", 
    "Coffee Machine", 
    "Jacuzzi", 
    "Kitchen", 
    "Balcony", 
    "Private Pool"
  ];

  const handleBookingComplete = (bookingData: any) => {
    toast({
      title: "Booking Confirmed",
      description: `Room ${bookingData.roomId} booked for ${bookingData.guestName} from ${bookingData.checkInDate.toLocaleDateString()} to ${bookingData.checkOutDate.toLocaleDateString()}`,
    });
    
    if (bookingData.roomId) {
      const room = rooms.find(r => r.id === bookingData.roomId);
      if (room) {
        updateRoomMutation.mutate({
          ...room,
          status: "occupied"
        });
      }
    }
  };

  const RoomCard = ({ room }: { room: Room }) => (
    <Card key={room.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">Room {room.number}</CardTitle>
          <Badge className={`${getStatusColor(room.status)} capitalize`}>{room.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Type:</span>
            <span>{room.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Floor:</span>
            <span>{room.floor}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Capacity:</span>
            <span>{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Price:</span>
            <span>${room.pricePerNight}/night</span>
          </div>
          <div>
            <span className="font-medium block mb-1">Amenities:</span>
            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                  {getAmenityIcon(amenity)}
                  <span className="text-xs">{amenity}</span>
                </Badge>
              ))}
              {room.amenities.length > 3 && (
                <Badge variant="outline">+{room.amenities.length - 3} more</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 pt-2">
        <Button variant="outline" onClick={() => handleViewDetails(room)}>View Details</Button>
        {room.status === "available" ? (
          <BookingDialog
            roomId={room.id!}
            roomNumber={room.number}
            roomType={room.type}
            pricePerNight={room.pricePerNight}
            onBookingComplete={handleBookingComplete}
            trigger={<Button>Book Now</Button>}
          />
        ) : (
          <Button onClick={() => handleEditRoom(room)}>Edit</Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground">Manage room availability and status.</p>
        </div>
        <Button onClick={handleNewRoom} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rooms..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="occupied">Occupied</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Home className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No rooms found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search query" : "Start by adding a new room"}
            </p>
          </div>
        ) : breakpoint === "mobile" ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : breakpoint === "tablet" ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.number}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>${room.pricePerNight}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(room.status)} capitalize`}>{room.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                            {getAmenityIcon(amenity)}
                            <span className="text-xs truncate max-w-[60px]">{amenity}</span>
                          </Badge>
                        ))}
                        {room.amenities.length > 3 && (
                          <Badge variant="outline">+{room.amenities.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(room)}>
                          View
                        </Button>
                        {room.status === "available" && (
                          <BookingDialog
                            roomId={room.id!}
                            roomNumber={room.number}
                            roomType={room.type}
                            pricePerNight={room.pricePerNight}
                            onBookingComplete={handleBookingComplete}
                            trigger={
                              <Button variant="outline" size="sm">
                                Book
                              </Button>
                            }
                          />
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleEditRoom(room)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteRoom(room)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            <DialogDescription>
              {selectedRoom 
                ? `Update details for Room ${selectedRoom.number}`
                : 'Enter the details for the new room.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Deluxe">Deluxe</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                          <SelectItem value="Presidential Suite">Presidential Suite</SelectItem>
                          <SelectItem value="Penthouse">Penthouse</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pricePerNight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Amenities</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableAmenities.map((amenity) => (
                        <FormField
                          key={amenity}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={amenity}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, amenity])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== amenity
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {amenity}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="mt-2 sm:mt-0">
                  Cancel
                </Button>
                <Button type="submit" className="mt-2 sm:mt-0">
                  {selectedRoom ? 'Update Room' : 'Add Room'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-md overflow-auto">
          {selectedRoom && (
            <>
              <SheetHeader className="mb-5">
                <SheetTitle className="flex items-center justify-between">
                  <span>Room {selectedRoom.number}</span>
                  <Badge className={`${getStatusColor(selectedRoom.status)} capitalize`}>
                    {selectedRoom.status}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  Detailed information about this room
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Basic Details</h3>
                  <div className="text-sm grid grid-cols-2 gap-2">
                    <div className="font-medium">Type:</div>
                    <div>{selectedRoom.type}</div>
                    <div className="font-medium">Floor:</div>
                    <div>{selectedRoom.floor}</div>
                    <div className="font-medium">Capacity:</div>
                    <div>{selectedRoom.capacity} {selectedRoom.capacity === 1 ? 'person' : 'people'}</div>
                    <div className="font-medium">Price:</div>
                    <div>${selectedRoom.pricePerNight}/night</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Maintenance Information</h3>
                  <div className="text-sm grid grid-cols-2 gap-2">
                    <div className="font-medium">Last Cleaned:</div>
                    <div>{selectedRoom.lastCleanedAt ? new Date(selectedRoom.lastCleanedAt).toLocaleDateString() : 'Not recorded'}</div>
                    <div className="font-medium">Next Maintenance:</div>
                    <div>{selectedRoom.nextMaintenanceAt ? new Date(selectedRoom.nextMaintenanceAt).toLocaleDateString() : 'Not scheduled'}</div>
                  </div>
                </div>
                
                {selectedRoom.notes && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none">Notes</h3>
                    <p className="text-sm">{selectedRoom.notes}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Records</h3>
                  <div className="text-sm grid grid-cols-2 gap-2">
                    <div className="font-medium">Created:</div>
                    <div>{new Date(selectedRoom.createdAt).toLocaleDateString()}</div>
                    <div className="font-medium">Last Updated:</div>
                    <div>{new Date(selectedRoom.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleEditRoom(selectedRoom)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleDeleteRoom(selectedRoom)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Room {selectedRoom?.number}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="mt-2 sm:mt-0">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedRoom && deleteRoomMutation.mutate(selectedRoom.id!)}
              disabled={deleteRoomMutation.isPending}
              className="mt-2 sm:mt-0"
            >
              {deleteRoomMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;

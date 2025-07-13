
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserPlus, Search as SearchIcon, Eye as EyeIcon, UserCog, X } from 'lucide-react';
import { fetchDemoGuests, searchGuests, getRecentGuests, getVIPGuests, addNewGuest } from '@/lib/guest-data';
import { Guest, db, Room } from '@/lib/db';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useBreakpoint } from '@/hooks/use-mobile';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { GuestProfile } from '@/components/guests/GuestProfile';

// Define a schema for the guest form
const guestFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  vipStatus: z.boolean().default(false),
  notes: z.string().optional(),
});

// GuestFormValues type needs to match our schema
type GuestFormValues = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  idType?: string;
  idNumber?: string;
  vipStatus: boolean;
  notes?: string;
};

export default function Guests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewGuestDialog, setShowNewGuestDialog] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'vip' | 'recent'>('all');
  const [showGuestProfile, setShowGuestProfile] = useState(false);
  const breakpoint = useBreakpoint();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch guests data
  const { data: guests = [], isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: fetchDemoGuests,
  });

  // Get available rooms for bookings
  const { data: availableRooms = [] } = useQuery({
    queryKey: ['availableRooms'],
    queryFn: async () => {
      return db.rooms
        .where('status')
        .equals('available')
        .toArray()
        .then(rooms => 
          rooms.map(room => ({
            id: room.id!,
            number: room.number,
            type: room.type,
            pricePerNight: room.pricePerNight
          }))
        );
    }
  });

  // Filter guests based on search query and active tab
  const filteredGuests = searchGuests(guests, searchQuery, activeTab === 'vip' ? 'vip' : 'all');
  
  // Get filtered guests based on active tab
  const getFilteredGuestsList = () => {
    switch (activeTab) {
      case 'vip':
        return getVIPGuests(guests).filter(guest => 
          searchQuery === '' || 
          guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          guest.lastName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'recent':
        return getRecentGuests(guests).filter(guest => 
          searchQuery === '' || 
          guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          guest.lastName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      default:
        return filteredGuests;
    }
  };

  const displayGuests = getFilteredGuestsList();

  // Open guest details
  const openGuestDetails = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowGuestProfile(true);
  };

  // Create a React Query mutation for adding a new guest
  const addGuestMutation = useMutation({
    mutationFn: async (data: GuestFormValues) => {
      // Create full guest object with required fields
      const guestData: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        idType: data.idType,
        idNumber: data.idNumber,
        vipStatus: data.vipStatus === true, // Ensure boolean
        notes: data.notes
      };
      
      return await addNewGuest(guestData);
    },
    onSuccess: () => {
      // Invalidate and refetch guests
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Success",
        description: "Guest added successfully",
      });
      setShowNewGuestDialog(false);
      form.reset(); // Reset form after successful submission
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add guest: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Update a guest
  const updateGuestMutation = useMutation({
    mutationFn: async (data: { guestId: number; guestData: Partial<Guest> }) => {
      if (!data.guestId) {
        throw new Error('Guest ID is required for updates');
      }
      await db.guests.update(data.guestId, data.guestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    }
  });

  // Handle guest profile update
  const handleGuestUpdate = async (updatedData: Partial<Guest>) => {
    if (!selectedGuest?.id) {
      toast({
        title: "Error",
        description: "Cannot update guest: No guest selected",
        variant: "destructive",
      });
      return;
    }

    await updateGuestMutation.mutateAsync({
      guestId: selectedGuest.id,
      guestData: updatedData
    });
  };

  // Setup form for adding a new guest
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      idType: '',
      idNumber: '',
      vipStatus: false,
      notes: '',
    },
  });

  // Handle form submission
  const onSubmit = (data: GuestFormValues) => {
    addGuestMutation.mutate(data);
  };

  // Guest card component for mobile view
  const GuestCard = ({ guest }: { guest: Guest }) => (
    <Card key={guest.id} className="cursor-pointer hover:bg-accent/5 transition-colors" onClick={() => openGuestDetails(guest)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{guest.firstName} {guest.lastName}</CardTitle>
          {guest.vipStatus && <Badge variant="default" className="bg-amber-500">VIP</Badge>}
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <div className="grid grid-cols-2 gap-x-2 text-sm">
          <div className="text-muted-foreground">Email:</div>
          <div className="text-right truncate">{guest.email || 'N/A'}</div>
          <div className="text-muted-foreground">Phone:</div>
          <div className="text-right">{guest.phone || 'N/A'}</div>
          <div className="text-muted-foreground">Location:</div>
          <div className="text-right truncate">{guest.city || ''}{guest.state ? `, ${guest.state}` : ''}</div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="ml-auto">
          <EyeIcon className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );

  // Render guest profile if a guest is selected, otherwise render the guest list
  if (showGuestProfile && selectedGuest) {
    return (
      <div className="container mx-auto py-6">
        <GuestProfile 
          guest={selectedGuest} 
          onUpdate={handleGuestUpdate}
          onBack={() => setShowGuestProfile(false)}
          availableRooms={availableRooms}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Guests</h2>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => setShowNewGuestDialog(true)}
            className="w-full sm:w-auto"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Guest</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs 
          defaultValue="all" 
          className="w-full" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'all' | 'vip' | 'recent')}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Guests</TabsTrigger>
            <TabsTrigger value="vip">VIP</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-auto">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayGuests.length === 0 ? (
            <div className="text-center py-10">
              <UserCog className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold mb-1">No guests found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Add your first guest to get started"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop view - Table */}
              {breakpoint === "desktop" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayGuests.map((guest) => (
                      <TableRow key={guest.id} onClick={() => openGuestDetails(guest)} className="cursor-pointer">
                        <TableCell>
                          <div className="font-medium">{guest.firstName} {guest.lastName}</div>
                          <div className="text-sm text-muted-foreground">
                            {guest.idType}: {guest.idNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{guest.email}</div>
                          <div className="text-sm text-muted-foreground">{guest.phone}</div>
                        </TableCell>
                        <TableCell>
                          {guest.vipStatus ? (
                            <Badge variant="default" className="bg-amber-500">VIP</Badge>
                          ) : (
                            <Badge variant="outline">Regular</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{guest.city}{guest.state ? `, ${guest.state}` : ''}</div>
                          <div className="text-sm text-muted-foreground">{guest.country}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            openGuestDetails(guest);
                          }}>
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {/* Tablet and Mobile view - Cards */}
              {(breakpoint === "mobile" || breakpoint === "tablet") && (
                <div className={`grid ${breakpoint === "tablet" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                  {displayGuests.map((guest) => (
                    <GuestCard key={guest.id} guest={guest} />
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog for adding new guest */}
      <Dialog open={showNewGuestDialog} onOpenChange={setShowNewGuestDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Guest</DialogTitle>
            <DialogDescription>
              Enter the details for the new guest. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="555-123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Passport" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="US1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="vipStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>VIP Status</FormLabel>
                      <FormDescription>
                        Check if the guest has VIP status.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special notes about the guest"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNewGuestDialog(false)}
                  className="mt-2 sm:mt-0"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addGuestMutation.isPending}
                  className="mt-2 sm:mt-0"
                >
                  {addGuestMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Guest"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

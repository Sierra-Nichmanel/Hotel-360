
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X, User, Clock, MailOpen, Phone, Home, CreditCard, Flag, Edit, ArrowLeft, Plus } from 'lucide-react';
import { Guest } from '@/lib/db';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { BookingDialog } from '@/components/rooms/BookingDialog';

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
  }).optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  idType: z.string().optional().nullable(),
  idNumber: z.string().optional().nullable(),
  vipStatus: z.boolean().default(false),
  notes: z.string().optional().nullable(),
});

// GuestFormValues type needs to match our schema
type GuestFormValues = z.infer<typeof guestFormSchema>;

interface GuestProfileProps {
  guest: Guest;
  onUpdate: (updatedGuest: Partial<Guest>) => Promise<void>;
  onBack: () => void;
  availableRooms?: { id: number; number: string; type: string; pricePerNight: number }[];
}

export const GuestProfile: React.FC<GuestProfileProps> = ({ 
  guest, 
  onUpdate, 
  onBack,
  availableRooms = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Setup form for editing guest
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email || null,
      phone: guest.phone || null,
      address: guest.address || null,
      city: guest.city || null,
      state: guest.state || null,
      zipCode: guest.zipCode || null,
      country: guest.country || null,
      idType: guest.idType || null,
      idNumber: guest.idNumber || null,
      vipStatus: guest.vipStatus || false,
      notes: guest.notes || null,
    },
  });

  // Create a mutation for updating guest
  const updateGuestMutation = useMutation({
    mutationFn: async (data: GuestFormValues) => {
      return await onUpdate({
        ...data,
        updatedAt: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Success",
        description: "Guest profile updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update guest profile: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: GuestFormValues) => {
    updateGuestMutation.mutate(data);
  };

  // Handle booking completion
  const handleBookingComplete = (bookingData: any) => {
    toast({
      title: "Booking Created",
      description: `Successfully booked ${bookingData.roomNumber} for ${guest.firstName} ${guest.lastName}`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Guest Profile</CardTitle>
          {guest.vipStatus && <Badge variant="default" className="bg-amber-500">VIP</Badge>}
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
        )}
      </CardHeader>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start px-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="p-6 pt-2">
          {isEditing ? (
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
                          <Input type="email" placeholder="john.doe@example.com" {...field} value={field.value || ''} />
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
                          <Input placeholder="555-123-4567" {...field} value={field.value || ''} />
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
                        <Input placeholder="123 Main St" {...field} value={field.value || ''} />
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
                          <Input placeholder="New York" {...field} value={field.value || ''} />
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
                          <Input placeholder="NY" {...field} value={field.value || ''} />
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
                          <Input placeholder="10001" {...field} value={field.value || ''} />
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
                          <Input placeholder="USA" {...field} value={field.value || ''} />
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
                          <Input placeholder="Passport" {...field} value={field.value || ''} />
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
                          <Input placeholder="US1234567" {...field} value={field.value || ''} />
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
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updateGuestMutation.isPending}
                  >
                    {updateGuestMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
                  {guest.firstName[0]}{guest.lastName[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{guest.firstName} {guest.lastName}</h2>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>Guest since {new Date(guest.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{guest.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{guest.phone || 'No phone provided'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Address</h3>
                  <div className="flex items-start gap-2">
                    <Home className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p>{guest.address || 'No address provided'}</p>
                      {guest.city && <p>{guest.city}{guest.state ? `, ${guest.state}` : ''} {guest.zipCode || ''}</p>}
                      <p>{guest.country || ''}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Identification</h3>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {guest.idType && guest.idNumber 
                        ? `${guest.idType}: ${guest.idNumber}` 
                        : 'No ID information provided'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    {guest.vipStatus 
                      ? <Badge variant="default" className="bg-amber-500">VIP Guest</Badge>
                      : <Badge variant="outline">Regular Guest</Badge>
                    }
                  </div>
                </div>
              </div>
              
              {guest.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                    <p className="text-sm">{guest.notes}</p>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(guest.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(guest.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="p-6 pt-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Guest Bookings</h3>
            {availableRooms.length > 0 && (
              <BookingDialog
                roomId={availableRooms[0].id}
                roomNumber={availableRooms[0].number}
                roomType={availableRooms[0].type}
                pricePerNight={availableRooms[0].pricePerNight}
                existingGuestOptions={[{id: guest.id?.toString() || '', name: `${guest.firstName} ${guest.lastName}`}]}
                onBookingComplete={handleBookingComplete}
                trigger={
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Booking
                  </Button>
                }
              />
            )}
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <h4 className="font-medium mb-2">Booking History</h4>
            <p>The guest's booking history will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="p-6 pt-2">
          <div className="text-center py-8 text-muted-foreground">
            <h4 className="font-medium mb-2">Guest Preferences</h4>
            <p>Guest preferences and special requests will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

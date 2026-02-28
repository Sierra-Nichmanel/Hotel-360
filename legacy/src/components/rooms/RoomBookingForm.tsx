import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon, Users, CreditCard, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useButtonAction } from '@/hooks/use-button-action';
import { ActionButton } from '@/components/common/ActionButton';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bookingFormSchema = z.object({
  guestId: z.string().optional(),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email("Invalid email address"),
  guestPhone: z.string().optional(),
  checkInDate: z.date({
    required_error: "Check-in date is required",
  }),
  checkOutDate: z.date({
    required_error: "Check-out date is required",
  }),
  adults: z.coerce.number().int().min(1, "At least 1 adult required"),
  children: z.coerce.number().int().min(0, "Cannot be negative"),
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(["credit_card", "cash", "bank_transfer"]),
})
.refine(data => data.checkOutDate > data.checkInDate, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"],
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface RoomBookingFormProps {
  roomId: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  onBookingComplete?: (bookingData: any) => void;
  existingGuestOptions?: { id: string; name: string }[];
}

export const RoomBookingForm = ({
  roomId,
  roomNumber,
  roomType,
  pricePerNight,
  onBookingComplete,
  existingGuestOptions = [],
}: RoomBookingFormProps) => {
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [totalNights, setTotalNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(pricePerNight);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      checkInDate: new Date(),
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      adults: 1,
      children: 0,
      specialRequests: "",
      paymentMethod: "credit_card",
    },
  });

  // Update total nights and price when dates change
  React.useEffect(() => {
    const checkIn = form.watch("checkInDate");
    const checkOut = form.watch("checkOutDate");
    
    if (checkIn && checkOut && checkOut > checkIn) {
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      setTotalNights(nights);
      setTotalPrice(nights * pricePerNight);
    }
  }, [form.watch("checkInDate"), form.watch("checkOutDate"), pricePerNight]);

  // When selecting an existing guest, fill their details
  const handleGuestSelection = (guestId: string) => {
    setSelectedGuest(guestId);
    
    const selectedGuestData = existingGuestOptions.find(g => g.id === guestId);
    if (selectedGuestData) {
      form.setValue("guestName", selectedGuestData.name);
      form.setValue("guestId", guestId);
      // Other fields would be filled here if we had that data
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    // This would typically call an API to create the booking
    const bookingData = {
      ...data,
      roomId,
      totalNights,
      totalPrice,
      bookingStatus: "confirmed",
      bookingDate: new Date(),
    };
    
    console.log("Creating booking:", bookingData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onBookingComplete) {
      onBookingComplete(bookingData);
    }
    
    return bookingData;
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/50 rounded-md flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="font-medium">Room {roomNumber}</h3>
          <p className="text-sm text-muted-foreground">{roomType}</p>
        </div>
        <div className="text-right">
          <span className="font-medium">${pricePerNight}</span>
          <p className="text-sm text-muted-foreground">per night</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Guest Selection Section */}
          {existingGuestOptions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Guest Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="guestId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Existing Guest (Optional)</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleGuestSelection(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a guest" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {existingGuestOptions.map(guest => (
                            <SelectItem key={guest.id} value={guest.id}>
                              {guest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Guest Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Guest Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Stay Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Stay Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkInDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="checkOutDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => {
                            const checkInDate = form.getValues("checkInDate");
                            return date < (checkInDate || new Date());
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adults</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" min={1} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Children</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" min={0} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Special Requests Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Any special requirements or requests..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Payment Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Information</h3>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="credit_card">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Credit Card</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cash">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Cash</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Bank Transfer</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Summary Section */}
          <div className="rounded-md border p-4 space-y-2">
            <h3 className="font-medium">Booking Summary</h3>
            <div className="flex justify-between items-center text-sm">
              <span>Room {roomNumber} ({roomType})</span>
              <span>${pricePerNight} per night</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Duration</span>
              <span className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {totalNights} night{totalNights !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between items-center font-medium">
              <span>Total Amount</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <ActionButton
            type="submit"
            className="w-full"
            actionName="Create Booking"
            onAction={() => form.handleSubmit(onSubmit)()}
            successMessage="Booking created successfully"
            errorMessage="Failed to create booking"
          >
            Complete Booking
          </ActionButton>
        </form>
      </Form>
    </div>
  );
};

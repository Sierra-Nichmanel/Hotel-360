
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CalendarIcon, BedDouble, Users, CreditCard } from "lucide-react";
import { ActionButton } from "@/components/common/ActionButton";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function GuestBooking() {
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [roomType, setRoomType] = useState("");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;
  
  const handleNextStep = () => {
    if (step === 1) {
      if (!checkIn || !checkOut || !roomType) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      
      if (checkIn >= checkOut) {
        toast({
          title: "Invalid dates",
          description: "Check-out date must be after check-in date",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === 2) {
      if (!name || !email || !phone) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      
      // Simple email validation
      if (!/\S+@\S+\.\S+/.test(email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async () => {
    try {
      // Here you would submit the booking to your backend
      // For demo purposes, we'll just simulate a successful booking
      
      // const { data, error } = await supabase
      //   .from('bookings')
      //   .insert([{ 
      //     check_in: checkIn,
      //     check_out: checkOut,
      //     room_type: roomType,
      //     adults: parseInt(adults),
      //     children: parseInt(children),
      //     guest_name: name,
      //     guest_email: email,
      //     guest_phone: phone,
      //     status: 'confirmed'
      //   }]);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Booking confirmed!",
        description: "Your booking has been successfully confirmed. Check your email for details.",
      });
      
      // Reset form and go back to step 1
      setCheckIn(undefined);
      setCheckOut(undefined);
      setRoomType("");
      setAdults("1");
      setChildren("0");
      setName("");
      setEmail("");
      setPhone("");
      setStep(1);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const roomOptions = [
    { value: "standard", label: "Standard Room", price: 99, description: "Comfortable room with essential amenities" },
    { value: "deluxe", label: "Deluxe Room", price: 149, description: "Spacious room with premium amenities" },
    { value: "suite", label: "Executive Suite", price: 249, description: "Luxury suite with separate living area" },
    { value: "family", label: "Family Room", price: 199, description: "Spacious room with two double beds" },
  ];
  
  const selectedRoom = roomOptions.find(room => room.value === roomType);
  
  const numberOfNights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;
  
  const totalPrice = selectedRoom ? selectedRoom.price * numberOfNights : 0;
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Book Your Stay</CardTitle>
        <CardDescription className="text-center">
          Find your perfect room and make a reservation in just a few steps
        </CardDescription>
        <div className="w-full bg-secondary h-2 mt-6 rounded-full">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span className={step >= 1 ? "font-medium text-primary" : ""}>Room Selection</span>
          <span className={step >= 2 ? "font-medium text-primary" : ""}>Guest Information</span>
          <span className={step >= 3 ? "font-medium text-primary" : ""}>Confirmation</span>
        </div>
      </CardHeader>
      
      <CardContent>
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      initialFocus
                      disabled={(date) => 
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
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
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      initialFocus
                      disabled={(date) => 
                        date <= checkIn || date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Room Type</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomOptions.map(room => (
                    <SelectItem key={room.value} value={room.value}>
                      {room.label} - ${room.price}/night
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Adults</Label>
                <Select value={adults} onValueChange={setAdults}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Children</Label>
                <Select value={children} onValueChange={setChildren}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedRoom && numberOfNights > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <BedDouble className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">{selectedRoom.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedRoom.description}
                  </p>
                  <div className="flex justify-between mt-4 text-sm">
                    <span>Price per night:</span>
                    <span className="font-medium">${selectedRoom.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Number of nights:</span>
                    <span className="font-medium">{numberOfNights}</span>
                  </div>
                  <div className="flex justify-between mt-2 font-bold">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Your personal information will only be used for processing your booking and enhancing your stay experience.</p>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="font-medium">
                    {checkIn ? format(checkIn, "PPP") : "-"}
                  </span>
                  
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="font-medium">
                    {checkOut ? format(checkOut, "PPP") : "-"}
                  </span>
                  
                  <span className="text-muted-foreground">Room Type:</span>
                  <span className="font-medium">
                    {selectedRoom?.label || "-"}
                  </span>
                  
                  <span className="text-muted-foreground">Guests:</span>
                  <span className="font-medium">
                    {adults} Adult{parseInt(adults) !== 1 ? "s" : ""}, {children} Children
                  </span>
                  
                  <span className="text-muted-foreground">Guest Name:</span>
                  <span className="font-medium">{name}</span>
                  
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{email}</span>
                  
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{phone}</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total Price:</span>
                    <span className="text-lg">${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Payment Information</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                For demonstration purposes, this booking will be confirmed without actual payment processing.
              </p>
              <p className="text-sm font-medium">
                In a real application, secure payment integration would be implemented here.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        {step > 1 && (
          <Button 
            variant="outline" 
            onClick={handlePrevStep}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
        )}
        
        {step < totalSteps ? (
          <Button 
            onClick={handleNextStep}
            className="w-full sm:w-auto sm:ml-auto"
          >
            Continue
          </Button>
        ) : (
          <ActionButton
            actionName="Confirm Booking"
            onAction={handleSubmit}
            className="w-full sm:w-auto sm:ml-auto"
            successMessage="Booking confirmed!"
            errorMessage="Booking failed. Please try again."
          >
            Confirm Booking
          </ActionButton>
        )}
      </CardFooter>
    </Card>
  );
}

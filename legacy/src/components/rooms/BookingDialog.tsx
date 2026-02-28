
import React from "react";
import { Calendar } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoomBookingForm } from "./RoomBookingForm";

interface BookingDialogProps {
  roomId: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  trigger?: React.ReactNode;
  onBookingComplete?: (bookingData: any) => void;
  existingGuestOptions?: { id: string; name: string }[];
}

export const BookingDialog = ({
  roomId,
  roomNumber,
  roomType,
  pricePerNight,
  trigger,
  onBookingComplete,
  existingGuestOptions = []
}: BookingDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const handleBookingComplete = (bookingData: any) => {
    if (onBookingComplete) {
      onBookingComplete(bookingData);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Book Room</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Room {roomNumber}</DialogTitle>
          <DialogDescription>
            Complete the form below to create a new booking for this room.
          </DialogDescription>
        </DialogHeader>
        
        <RoomBookingForm
          roomId={roomId}
          roomNumber={roomNumber}
          roomType={roomType}
          pricePerNight={pricePerNight}
          onBookingComplete={handleBookingComplete}
          existingGuestOptions={existingGuestOptions}
        />
      </DialogContent>
    </Dialog>
  );
};

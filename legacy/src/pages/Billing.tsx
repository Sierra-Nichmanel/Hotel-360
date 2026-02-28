import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLanguage } from '@/lib/i18n/language-context';
import { PaymentProcessor } from '@/components/billing/PaymentProcessor';
import { db, Booking, Payment, Guest, Room } from '@/lib/db';
import { differenceInDays, format } from 'date-fns';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PaymentWithDetails extends Payment {
  guest?: Guest;
  room?: Room;
  booking?: Booking;
}

export default function Billing() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('unpaid');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [guests, setGuests] = useState<Map<number, Guest>>(new Map());
  const [rooms, setRooms] = useState<Map<number, Room>>(new Map());
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBookings = await db.bookings.toArray();
        setBookings(allBookings);
        
        const allPayments = await db.payments.toArray();
        
        const allGuests = await db.guests.toArray();
        const guestsMap = new Map(allGuests.map(guest => [guest.id, guest]));
        setGuests(guestsMap);
        
        const allRooms = await db.rooms.toArray();
        const roomsMap = new Map(allRooms.map(room => [room.id, room]));
        setRooms(roomsMap);
        
        const paymentsWithDetails = await Promise.all(
          allPayments.map(async (payment) => {
            const booking = allBookings.find(b => b.id === payment.bookingId);
            const paymentWithDetails: PaymentWithDetails = { ...payment };
            
            if (booking) {
              paymentWithDetails.booking = booking;
              paymentWithDetails.guest = guestsMap.get(booking.guestId);
              paymentWithDetails.room = roomsMap.get(booking.roomId);
            }
            
            return paymentWithDetails;
          })
        );
        
        setPayments(paymentsWithDetails);
        
        filterBookings(allBookings, allPayments, 'unpaid');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const filterBookings = (
    allBookings: Booking[], 
    allPayments: Payment[], 
    tab: string
  ) => {
    const paymentsByBooking = new Map<number, number>();
    
    allPayments.forEach(payment => {
      if (payment.status === 'completed') {
        const currentTotal = paymentsByBooking.get(payment.bookingId) || 0;
        paymentsByBooking.set(payment.bookingId, currentTotal + payment.amount);
      }
    });
    
    let filtered: Booking[];
    
    if (tab === 'unpaid') {
      filtered = allBookings.filter(booking => {
        const amountPaid = paymentsByBooking.get(booking.id as number) || 0;
        return amountPaid < booking.totalAmount;
      });
    } else if (tab === 'paid') {
      filtered = allBookings.filter(booking => {
        const amountPaid = paymentsByBooking.get(booking.id as number) || 0;
        return amountPaid >= booking.totalAmount;
      });
    } else {
      filtered = [...allBookings];
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => {
        const guest = guests.get(booking.guestId);
        const room = rooms.get(booking.roomId);
        
        return (
          (guest && 
            ((guest.firstName?.toLowerCase() || '').includes(query) || 
             (guest.lastName?.toLowerCase() || '').includes(query) || 
             (guest.email?.toLowerCase() || '').includes(query))) ||
          (room && 
            (room.number.toLowerCase().includes(query))) ||
          (booking.id?.toString().includes(query))
        );
      });
    }
    
    setFilteredBookings(filtered);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterBookings(bookings, payments, value);
    setSelectedBooking(null);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    filterBookings(bookings, payments, activeTab);
  };
  
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };
  
  const handlePaymentComplete = (payment: Payment) => {
    const fetchData = async () => {
      try {
        const allBookings = await db.bookings.toArray();
        const allPayments = await db.payments.toArray();
        
        setBookings(allBookings);
        
        const paymentsWithDetails = await Promise.all(
          allPayments.map(async (payment) => {
            const booking = allBookings.find(b => b.id === payment.bookingId);
            const paymentWithDetails: PaymentWithDetails = { ...payment };
            
            if (booking) {
              paymentWithDetails.booking = booking;
              paymentWithDetails.guest = guests.get(booking.guestId);
              paymentWithDetails.room = rooms.get(booking.roomId);
            }
            
            return paymentWithDetails;
          })
        );
        
        setPayments(paymentsWithDetails);
        filterBookings(allBookings, allPayments, activeTab);
        
        if (selectedBooking && selectedBooking.id === payment.bookingId) {
          const totalPaid = paymentsWithDetails
            .filter(p => p.bookingId === payment.bookingId && p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
          
          const booking = allBookings.find(b => b.id === payment.bookingId);
          
          if (booking && totalPaid >= booking.totalAmount) {
            setSelectedBooking(null);
          }
        }
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    };
    
    fetchData();
  };
  
  const getBookingFinancials = (bookingId: number) => {
    const relevantPayments = payments.filter(
      p => p.bookingId === bookingId && p.status === 'completed'
    );
    
    const totalPaid = relevantPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const booking = bookings.find(b => b.id === bookingId);
    const totalAmount = booking ? booking.totalAmount : 0;
    
    return {
      totalPaid,
      totalAmount,
      balance: totalAmount - totalPaid
    };
  };
  
  const getPaymentStatus = (bookingId: number) => {
    const { totalPaid, totalAmount } = getBookingFinancials(bookingId);
    
    if (totalPaid >= totalAmount) {
      return 'paid';
    } else if (totalPaid > 0) {
      return 'partial';
    } else {
      return 'unpaid';
    }
  };
  
  return (
    <div className="container space-y-6 p-4 lg:p-8">
      <PageHeader 
        title={t("Billing & Payments")} 
        description={t("Manage invoices, payments and billing operations")} 
        icon={<DollarSign className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("Bookings")}</CardTitle>
            <CardDescription>
              {t("Select a booking to process payment")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder={t("Search by guest name, room, or booking ID")}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="unpaid">{t("Unpaid")}</TabsTrigger>
                <TabsTrigger value="paid">{t("Paid")}</TabsTrigger>
                <TabsTrigger value="all">{t("All")}</TabsTrigger>
              </TabsList>
              <TabsContent value="unpaid" className="mt-4">
                <BookingList 
                  bookings={filteredBookings} 
                  guests={guests} 
                  rooms={rooms}
                  getPaymentStatus={getPaymentStatus}
                  getBookingFinancials={getBookingFinancials}
                  onSelectBooking={handleSelectBooking}
                  selectedBookingId={selectedBooking?.id}
                />
              </TabsContent>
              <TabsContent value="paid" className="mt-4">
                <BookingList 
                  bookings={filteredBookings} 
                  guests={guests} 
                  rooms={rooms}
                  getPaymentStatus={getPaymentStatus}
                  getBookingFinancials={getBookingFinancials}
                  onSelectBooking={handleSelectBooking}
                  selectedBookingId={selectedBooking?.id}
                />
              </TabsContent>
              <TabsContent value="all" className="mt-4">
                <BookingList 
                  bookings={filteredBookings} 
                  guests={guests} 
                  rooms={rooms}
                  getPaymentStatus={getPaymentStatus}
                  getBookingFinancials={getBookingFinancials}
                  onSelectBooking={handleSelectBooking}
                  selectedBookingId={selectedBooking?.id}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("Payment Processing")}</CardTitle>
            <CardDescription>
              {selectedBooking 
                ? t("Process payment for the selected booking") 
                : t("Select a booking to process payment")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedBooking ? (
              <div className="space-y-6">
                <BookingDetails 
                  booking={selectedBooking} 
                  guest={guests.get(selectedBooking.guestId)} 
                  room={rooms.get(selectedBooking.roomId)}
                  bookingFinancials={getBookingFinancials(selectedBooking.id as number)}
                />
                
                <PaymentProcessor
                  bookingId={selectedBooking.id as number}
                  totalAmount={getBookingFinancials(selectedBooking.id as number).balance}
                  onPaymentComplete={handlePaymentComplete}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t("No Booking Selected")}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {t("Select a booking from the list to process a payment or view payment details")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("Recent Payments")}</CardTitle>
            <CardDescription>
              {t("View all recent payment transactions")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentHistory payments={payments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BookingList({
  bookings,
  guests,
  rooms,
  getPaymentStatus,
  getBookingFinancials,
  onSelectBooking,
  selectedBookingId
}: {
  bookings: Booking[];
  guests: Map<number, Guest>;
  rooms: Map<number, Room>;
  getPaymentStatus: (bookingId: number) => 'paid' | 'partial' | 'unpaid';
  getBookingFinancials: (bookingId: number) => { totalPaid: number; totalAmount: number; balance: number };
  onSelectBooking: (booking: Booking) => void;
  selectedBookingId?: number;
}) {
  const { t } = useLanguage();
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {t("No bookings found")}
        </p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {bookings.map(booking => {
          const guest = guests.get(booking.guestId);
          const room = rooms.get(booking.roomId);
          const paymentStatus = getPaymentStatus(booking.id as number);
          const { totalPaid, totalAmount, balance } = getBookingFinancials(booking.id as number);
          
          return (
            <div
              key={booking.id}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedBookingId === booking.id 
                  ? 'bg-muted border-primary' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onSelectBooking(booking)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">
                    {guest ? `${guest.firstName} ${guest.lastName}` : t("Unknown Guest")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("Room")} {room?.number} • {format(new Date(booking.checkInDate), 'MMM d')} - {format(new Date(booking.checkOutDate), 'MMM d, yyyy')}
                  </div>
                </div>
                <PaymentStatusBadge status={paymentStatus} />
              </div>
              <div className="mt-2 text-sm flex justify-between">
                <span>
                  {t("Total")}: ${totalAmount.toFixed(2)}
                </span>
                {paymentStatus === 'partial' && (
                  <span className="font-medium">
                    {t("Balance")}: ${balance.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function BookingDetails({
  booking,
  guest,
  room,
  bookingFinancials
}: {
  booking: Booking;
  guest?: Guest;
  room?: Room;
  bookingFinancials: { totalPaid: number; totalAmount: number; balance: number };
}) {
  const { t } = useLanguage();
  const { totalPaid, totalAmount, balance } = bookingFinancials;
  
  const checkInDate = new Date(booking.checkInDate);
  const checkOutDate = new Date(booking.checkOutDate);
  const nights = differenceInDays(checkOutDate, checkInDate);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t("Booking Details")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <div className="text-sm text-muted-foreground">{t("Guest")}</div>
              <div className="font-medium">
                {guest ? `${guest.firstName} ${guest.lastName}` : t("Unknown Guest")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t("Room")}</div>
              <div className="font-medium">
                {room ? `${room.number} (${room.type})` : t("Unknown Room")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t("Check-in")}</div>
              <div className="font-medium">
                {format(checkInDate, 'MMM d, yyyy')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t("Check-out")}</div>
              <div className="font-medium">
                {format(checkOutDate, 'MMM d, yyyy')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t("Nights")}</div>
              <div className="font-medium">{nights}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t("Guests")}</div>
              <div className="font-medium">{booking.numberOfGuests}</div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">{t("Total Amount")}</div>
                <div className="text-lg font-bold">${totalAmount.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t("Amount Paid")}</div>
                <div className="text-lg font-medium">${totalPaid.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t("Balance Due")}</div>
                <div className="text-lg font-bold">${balance.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentHistory({ payments }: { payments: PaymentWithDetails[] }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>('all');
  
  const filteredPayments = payments
    .filter(payment => {
      if (filter === 'all') return true;
      return payment.status === filter;
    })
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t("Payment History")}</h3>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("Filter by status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Payments")}</SelectItem>
            <SelectItem value="completed">{t("Completed")}</SelectItem>
            <SelectItem value="pending">{t("Pending")}</SelectItem>
            <SelectItem value="refunded">{t("Refunded")}</SelectItem>
            <SelectItem value="failed">{t("Failed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredPayments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {t("No payment records found")}
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <div className="grid grid-cols-5 gap-4 p-4 border-b font-medium text-sm hidden md:grid">
            <div>{t("Date")}</div>
            <div>{t("Guest")}</div>
            <div>{t("Room")}</div>
            <div>{t("Amount")}</div>
            <div>{t("Status")}</div>
          </div>
          
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {filteredPayments.map(payment => (
                <div key={payment.id} className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="flex flex-col">
                    <span className="font-medium md:hidden">{t("Date")}:</span>
                    <span>{format(new Date(payment.paymentDate), 'MMM d, yyyy')}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-medium md:hidden">{t("Guest")}:</span>
                    <span>
                      {payment.guest 
                        ? `${payment.guest.firstName} ${payment.guest.lastName}` 
                        : t("Unknown Guest")}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-medium md:hidden">{t("Room")}:</span>
                    <span>
                      {payment.room 
                        ? `${payment.room.number}`
                        : t("Unknown Room")}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-medium md:hidden">{t("Amount")}:</span>
                    <span className="font-medium">${payment.amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-medium md:hidden">{t("Status")}:</span>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  
  if (status === 'completed' || status === 'paid') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="mr-1 h-3 w-3" />
        {status === 'paid' ? t("Paid") : t("Completed")}
      </Badge>
    );
  } else if (status === 'pending' || status === 'partial') {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        <Clock className="mr-1 h-3 w-3" />
        {status === 'partial' ? t("Partial") : t("Pending")}
      </Badge>
    );
  } else if (status === 'refunded') {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <DollarSign className="mr-1 h-3 w-3" />
        {t("Refunded")}
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <XCircle className="mr-1 h-3 w-3" />
        {status === 'unpaid' ? t("Unpaid") : t("Failed")}
      </Badge>
    );
  }
}

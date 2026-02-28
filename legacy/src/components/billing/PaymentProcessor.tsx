
import React, { useState } from 'react';
import { toast } from "sonner";
import { CreditCard, DollarSign, CheckCircle } from 'lucide-react';
import { ActionButton } from '@/components/common/ActionButton';
import { useLanguage } from '@/lib/i18n/language-context';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db, Payment } from '@/lib/db';

const paymentFormSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  cardHolder: z.string().min(3, "Cardholder name is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3-4 digits"),
  paymentMethod: z.enum(["credit_card", "debit_card", "bank_transfer", "cash"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentProcessorProps {
  bookingId: number;
  totalAmount: number;
  onPaymentComplete?: (payment: Payment) => void;
}

export function PaymentProcessor({ bookingId, totalAmount, onPaymentComplete }: PaymentProcessorProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      paymentMethod: 'credit_card',
      amount: totalAmount,
    },
  });

  async function onSubmit(values: PaymentFormValues) {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPayment: Omit<Payment, 'id'> = {
        bookingId,
        amount: values.amount,
        paymentMethod: values.paymentMethod as any,
        paymentDate: new Date(),
        status: 'completed',
        transactionId: 'tr_' + Math.random().toString(36).substring(2, 10),
        notes: 'Payment processed through the system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to local DB
      const paymentId = await db.payments.add(newPayment);
      
      // Update booking status if needed
      const booking = await db.bookings.get(bookingId);
      if (booking) {
        if (values.amount >= booking.totalAmount) {
          await db.bookings.update(bookingId, { 
            status: booking.status === 'confirmed' ? 'confirmed' : booking.status 
          });
        }
      }
      
      setIsSuccess(true);
      toast.success(t("Payment processed successfully"));
      
      if (onPaymentComplete) {
        onPaymentComplete({ id: paymentId, ...newPayment });
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error(t("Payment processing failed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Mask the card number as it's being typed
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    form.setValue('cardNumber', value);
  };

  // Format expiry date as MM/YY
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      form.setValue('expiryDate', value);
    } else {
      form.setValue('expiryDate', `${value.substring(0, 2)}/${value.substring(2, 4)}`);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
          <CardTitle>{t("Payment Successful")}</CardTitle>
          <CardDescription>{t("Your payment has been processed successfully")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t("Amount Paid")}</span>
              <span className="font-semibold">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium">{t("Transaction ID")}</span>
              <span className="text-xs text-muted-foreground">tr_********</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsSuccess(false)}
          >
            {t("Process Another Payment")}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("Payment Information")}</CardTitle>
        <CardDescription>
          {t("Enter your payment details to complete the booking")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("Payment Method")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="credit_card" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {t("Credit Card")}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="debit_card" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {t("Debit Card")}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="bank_transfer" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {t("Bank Transfer")}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {t("Cash")}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(form.watch('paymentMethod') === 'credit_card' || form.watch('paymentMethod') === 'debit_card') && (
              <>
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Card Number")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          {...field}
                          onChange={handleCardNumberChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Cardholder Name")}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Expiry Date")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MM/YY"
                            {...field}
                            onChange={handleExpiryDateChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("CVV")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              form.setValue('cvv', value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Amount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        form.setValue('amount', parseFloat(e.target.value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t("Total Amount")}</span>
                <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <ActionButton
              type="submit"
              actionName="Process Payment"
              onAction={() => form.handleSubmit(onSubmit)()}
              successMessage={t("Payment processed successfully")}
              errorMessage={t("Payment processing failed")}
              className="w-full"
            >
              {t("Process Payment")}
            </ActionButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

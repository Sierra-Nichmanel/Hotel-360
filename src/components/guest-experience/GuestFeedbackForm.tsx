
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/i18n/language-context';

export function GuestFeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bookingRef: '',
    rating: 5,
    cleanliness: 5,
    service: 5,
    amenities: 5,
    comments: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate saving feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
      });
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSubmissionSuccess(false);
        setFormData({
          name: '',
          email: '',
          bookingRef: '',
          rating: 5,
          cleanliness: 5,
          service: 5,
          amenities: 5,
          comments: '',
        });
      }, 2000);
    }, 1500);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {submissionSuccess ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h3 className="text-xl font-semibold">Thank You for Your Feedback!</h3>
          <p className="text-muted-foreground text-center">
            We appreciate you taking the time to share your experience with us.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="bookingRef">Booking Reference</Label>
            <Input 
              id="bookingRef" 
              name="bookingRef" 
              value={formData.bookingRef} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <Label className="mb-4 block">Overall Rating</Label>
              <div className="flex items-center justify-between">
                <Slider
                  value={[formData.rating]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => handleSliderChange('rating', value)}
                  className="w-3/4"
                />
                <div className="w-1/4 flex justify-end">
                  {renderStars(formData.rating)}
                </div>
              </div>
            </div>
            
            <div>
              <Label className="mb-4 block">Cleanliness</Label>
              <div className="flex items-center justify-between">
                <Slider
                  value={[formData.cleanliness]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => handleSliderChange('cleanliness', value)}
                  className="w-3/4"
                />
                <div className="w-1/4 flex justify-end">
                  {renderStars(formData.cleanliness)}
                </div>
              </div>
            </div>
            
            <div>
              <Label className="mb-4 block">Service</Label>
              <div className="flex items-center justify-between">
                <Slider
                  value={[formData.service]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => handleSliderChange('service', value)}
                  className="w-3/4"
                />
                <div className="w-1/4 flex justify-end">
                  {renderStars(formData.service)}
                </div>
              </div>
            </div>
            
            <div>
              <Label className="mb-4 block">Amenities</Label>
              <div className="flex items-center justify-between">
                <Slider
                  value={[formData.amenities]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => handleSliderChange('amenities', value)}
                  className="w-3/4"
                />
                <div className="w-1/4 flex justify-end">
                  {renderStars(formData.amenities)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Please share your experience..."
              rows={4}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      )}
    </div>
  );
}

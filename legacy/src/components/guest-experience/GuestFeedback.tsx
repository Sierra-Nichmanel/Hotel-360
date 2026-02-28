
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function GuestFeedback() {
  const [overallRating, setOverallRating] = useState(0);
  const [hoveringRating, setHoveringRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (overallRating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide an overall rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would save to Supabase
      // const { data, error } = await supabase
      //   .from('guest_feedback')
      //   .insert([{ 
      //     overall_rating: overallRating,
      //     service_rating: serviceRating,
      //     cleanliness_rating: cleanlinessRating,
      //     comments 
      //   }]);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your valuable feedback!",
      });
      
      // Reset form
      setOverallRating(0);
      setServiceRating(0);
      setCleanlinessRating(0);
      setComments('');
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ 
    rating, 
    setRating, 
    hovering, 
    setHovering 
  }: { 
    rating: number, 
    setRating: (rating: number) => void,
    hovering?: number,
    setHovering?: (hovering: number) => void
  }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onMouseEnter={() => setHovering?.(star)}
            onMouseLeave={() => setHovering?.(0)}
            onClick={() => setRating(star)}
          >
            <StarIcon
              className={`w-8 h-8 ${
                star <= (hovering || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-center">Your Feedback Matters</CardTitle>
          <CardDescription className="text-center">
            Help us improve our services by sharing your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Overall Experience</Label>
            <div className="flex justify-center py-2">
              <StarRating 
                rating={overallRating} 
                setRating={setOverallRating} 
                hovering={hoveringRating} 
                setHovering={setHoveringRating}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Service Quality</Label>
              <div className="flex justify-center py-2">
                <StarRating 
                  rating={serviceRating} 
                  setRating={setServiceRating}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Cleanliness</Label>
              <div className="flex justify-center py-2">
                <StarRating 
                  rating={cleanlinessRating} 
                  setRating={setCleanlinessRating}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Please share any additional thoughts or suggestions..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

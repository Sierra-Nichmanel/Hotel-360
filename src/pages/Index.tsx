
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, CalendarDays, User, MessageSquare, Award } from 'lucide-react';

export function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hospitify 360</h1>
          <nav>
            <Link to="/auth">
              <Button variant="ghost">Staff Login</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Hospitify 360</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive hotel management system designed to enhance guest experience 
            and streamline operations.
          </p>
        </section>
        
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/guest-portal" className="block">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Guest Portal
                  </CardTitle>
                  <CardDescription>
                    Book your stay, check-in, provide feedback, and view rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Access all guest services in one convenient place. Book your stay, check-in/out digitally, share your feedback, and manage your loyalty rewards.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Enter Guest Portal
                  </Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/booking" className="block">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Quick Booking
                  </CardTitle>
                  <CardDescription>
                    Make a reservation quickly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Need to make a reservation fast? Use our streamlined booking process to secure your stay in just a few steps.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/auth" className="block">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Staff Access
                  </CardTitle>
                  <CardDescription>
                    Hotel staff and management login
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Authorized personnel can access the hotel management system to manage bookings, rooms, guests, and other administrative tasks.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Staff Login
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Guest Feedback
              </CardTitle>
              <CardDescription>
                Share your experience with us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>We value your opinion! Share your thoughts about your stay and help us improve our services for future guests.</p>
            </CardContent>
            <CardFooter>
              <Link to="/guest-portal?tab=feedback">
                <Button variant="outline">
                  Provide Feedback
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Loyalty Program
              </CardTitle>
              <CardDescription>
                Earn rewards with every stay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Join our loyalty program to earn points with every stay. Redeem your points for free nights, room upgrades, and exclusive perks.</p>
            </CardContent>
            <CardFooter>
              <Link to="/guest-portal?tab=loyalty">
                <Button variant="outline">
                  View Rewards
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Hospitify 360. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

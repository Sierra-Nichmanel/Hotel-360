
import React, { useState } from 'react';
import { 
  Mail, Users, Send, PlusCircle, 
  FileText, Trash, BarChart, ArrowRight
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  created: string;
  lastUsed?: string;
  category: 'promo' | 'welcome' | 'confirmation' | 'followup';
}

interface EmailCampaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
  openRate?: number;
  clickRate?: number;
  sentDate?: string;
  scheduledDate?: string;
}

interface EmailSegment {
  id: string;
  name: string;
  count: number;
  criteria: string;
}

export function EmailMarketing() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 'template1',
      name: 'Summer Promotion',
      subject: 'Special Summer Rates Just For You!',
      created: '2023-04-15T12:00:00Z',
      lastUsed: '2023-05-01T09:30:00Z',
      category: 'promo'
    },
    {
      id: 'template2',
      name: 'Welcome Email',
      subject: 'Welcome to Our Hotel!',
      created: '2023-03-10T14:20:00Z',
      lastUsed: '2023-05-05T11:15:00Z',
      category: 'welcome'
    },
    {
      id: 'template3',
      name: 'Booking Confirmation',
      subject: 'Your Booking is Confirmed',
      created: '2023-02-22T10:45:00Z',
      lastUsed: '2023-05-08T16:30:00Z',
      category: 'confirmation'
    },
    {
      id: 'template4',
      name: 'Post-Stay Feedback',
      subject: 'How Was Your Stay With Us?',
      created: '2023-01-15T09:00:00Z',
      lastUsed: '2023-05-10T08:45:00Z',
      category: 'followup'
    }
  ]);

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: 'campaign1',
      name: 'Summer 2023 Special Offer',
      status: 'sent',
      recipients: 450,
      openRate: 32.4,
      clickRate: 12.8,
      sentDate: '2023-05-01T09:30:00Z'
    },
    {
      id: 'campaign2',
      name: 'Winter Holiday Promotion',
      status: 'draft',
      recipients: 0
    },
    {
      id: 'campaign3',
      name: 'Long Weekend Special',
      status: 'scheduled',
      recipients: 325,
      scheduledDate: '2023-06-15T08:00:00Z'
    }
  ]);

  const [segments, setSegments] = useState<EmailSegment[]>([
    {
      id: 'segment1',
      name: 'All Guests',
      count: 1250,
      criteria: 'All hotel guests'
    },
    {
      id: 'segment2',
      name: 'Past Guests',
      count: 875,
      criteria: 'Guests who stayed in the last 12 months'
    },
    {
      id: 'segment3',
      name: 'VIP Guests',
      count: 125,
      criteria: 'Guests with VIP status'
    },
    {
      id: 'segment4',
      name: 'Business Travelers',
      count: 450,
      criteria: 'Guests with business traveler tag'
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    segment: '',
    content: '',
    sendDate: ''
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.segment) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedSegment = segments.find(s => s.id === newCampaign.segment);
    
    const campaign: EmailCampaign = {
      id: `campaign${Date.now()}`,
      name: newCampaign.name,
      status: newCampaign.sendDate ? 'scheduled' : 'draft',
      recipients: selectedSegment?.count || 0,
      scheduledDate: newCampaign.sendDate || undefined
    };

    setCampaigns([campaign, ...campaigns]);
    
    toast.success('Email campaign created successfully');
    
    setNewCampaign({
      name: '',
      subject: '',
      segment: '',
      content: '',
      sendDate: ''
    });
  };

  const sendCampaignNow = (id: string) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === id) {
        toast.success(`Campaign "${campaign.name}" sent to ${campaign.recipients} recipients`);
        return {
          ...campaign,
          status: 'sent',
          sentDate: new Date().toISOString()
        };
      }
      return campaign;
    }));
  };

  const deleteCampaign = (id: string) => {
    const campaignToDelete = campaigns.find(c => c.id === id);
    if (campaignToDelete) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      toast.info(`Campaign "${campaignToDelete.name}" deleted`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Email Marketing</h2>
          <p className="text-muted-foreground">Engage with your guests through targeted email campaigns</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Email Campaign</DialogTitle>
              <DialogDescription>
                Create a new email campaign to send to your guests
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Campaign Name
                </label>
                <Input
                  id="name"
                  placeholder="Summer Special Offer"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Email Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Special offer just for you!"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="segment" className="text-sm font-medium">
                  Recipient Segment
                </label>
                <Select 
                  value={newCampaign.segment} 
                  onValueChange={(value) => setNewCampaign({...newCampaign, segment: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name} ({segment.count} recipients)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Email Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your email content here..."
                  rows={4}
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="sendDate" className="text-sm font-medium">
                  Send Date (optional)
                </label>
                <Input
                  id="sendDate"
                  type="datetime-local"
                  value={newCampaign.sendDate}
                  onChange={(e) => setNewCampaign({...newCampaign, sendDate: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to save as draft
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCampaign({
                name: '',
                subject: '',
                segment: '',
                content: '',
                sendDate: ''
              })}>Cancel</Button>
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="segments">Audience Segments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No campaigns yet</p>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardDescription>
                          {campaign.recipients} recipients
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          campaign.status === 'sent' 
                            ? "bg-green-500" 
                            : campaign.status === 'scheduled' 
                              ? "bg-blue-500" 
                              : "bg-orange-500"
                        }
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {campaign.status === 'sent' && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Sent: </span>
                            {campaign.sentDate && new Date(campaign.sentDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Open Rate: </span>
                            {campaign.openRate}%
                          </div>
                          <div>
                            <span className="text-muted-foreground">Click Rate: </span>
                            {campaign.clickRate}%
                          </div>
                        </div>
                      )}
                      
                      {campaign.status === 'scheduled' && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Scheduled for: </span>
                          {campaign.scheduledDate && new Date(campaign.scheduledDate).toLocaleString()}
                        </div>
                      )}
                      
                      {campaign.status === 'draft' && (
                        <div className="text-sm text-muted-foreground">
                          This campaign is not scheduled yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-2">
                      {campaign.status === 'draft' && (
                        <Button 
                          size="sm" 
                          onClick={() => sendCampaignNow(campaign.id)}
                        >
                          <Send className="h-3 w-3 mr-1" /> Send Now
                        </Button>
                      )}
                      
                      {campaign.status === 'scheduled' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          <ArrowRight className="h-3 w-3 mr-1" /> Edit Schedule
                        </Button>
                      )}

                      {campaign.status === 'sent' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          <BarChart className="h-3 w-3 mr-1" /> View Report
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCampaign(campaign.id)}
                      >
                        <Trash className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>
                        Subject: {template.subject}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-muted-foreground">Created: </span>
                      {new Date(template.created).toLocaleDateString()}
                    </div>
                    {template.lastUsed && (
                      <div>
                        <span className="text-muted-foreground">Last used: </span>
                        {new Date(template.lastUsed).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm">
                      <Send className="h-3 w-3 mr-1" /> Use Template
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-12">
                <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-center">
                  Create a new email template
                </p>
                <Button variant="outline" className="mt-4">
                  New Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {segments.map((segment) => (
              <Card key={segment.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {segment.name}
                  </CardTitle>
                  <CardDescription>
                    {segment.count} recipients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {segment.criteria}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Users className="h-3 w-3 mr-1" /> View Recipients
                    </Button>
                    <Button size="sm">
                      <Send className="h-3 w-3 mr-1" /> Send Email
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-12">
                <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-center">
                  Create a new audience segment
                </p>
                <Button variant="outline" className="mt-4">
                  New Segment
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import UpgradePrompt from '@/components/UpgradePrompt';

// Define proper types for user details
interface UserDetails {
  id?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Dashboard() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const { toast } = useToast();
  const [location] = useLocation();
  
  // Self-hosted version - default user
  const user = {
    id: 1,
    email: 'user@localhost'
  };
  const isLoading = false;

  useEffect(() => {
    // Self-hosted version - use default user details
    console.log('Self-hosted version - using default user details');
    setUserDetails({
      id: '1',
      email: 'user@localhost',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsLoadingDetails(false);
  }, []);
  


  // Force refresh button handler
  const handleForceRefresh = async () => {
    try {
      // Reload the page to refresh all data
      window.location.reload();
      
      toast({
        title: "Data Refreshed",
        description: "Your account information has been updated"
      });
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Could not refresh user data"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-foreground">Dashboard</h1>
            
            <button 
              onClick={handleForceRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh Data
            </button>
          </div>
          
          <div className="mt-8 bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Your Account</h2>
            
            {isLoadingDetails ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : userDetails ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userDetails.email || user.email || 'No email found'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="font-medium capitalize">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Self-hosted
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="bg-green-50 p-4 rounded-md mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-green-700">
                          You have unlimited access to all features in this self-hosted version.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Could not load your account details. Please try again later.</p>
            )}
          </div>
          
          <div className="mt-8 bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <p className="text-muted-foreground">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
}        
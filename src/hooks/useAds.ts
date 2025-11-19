import { useCallback, useState } from 'react';
import { Ad, AdType, AdViewResponse } from '@/types/ad';
import { useRaffleStore } from '@/store/raffleStore';
import { useAuthStore } from '@/store/authStore';
import { config } from '@/constants/config';

export const useAds = () => {
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { incrementTickets, myMultiplier } = useRaffleStore();
  const { user } = useAuthStore();

  // Fetch active ads for current sprint
  const fetchActiveAds = useCallback(async (sprintId: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.get(`/ads/sprint/${sprintId}`);
      // return { success: true, data: response.data };

      // Mock ads
      const mockAds: Ad[] = [
        {
          id: '1',
          advertiserId: '1',
          type: AdType.SPONSOR,
          title: 'Premium Kozmetik Markası',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          duration: 30,
          isActive: true,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000).toISOString(),
          impressionCount: 0,
          clickCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          advertiserId: '2',
          type: AdType.ADMOB,
          title: 'Google Ad',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          duration: 25,
          isActive: true,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000).toISOString(),
          impressionCount: 0,
          clickCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setIsLoading(false);
      return { success: true, data: mockAds };
    } catch (error: any) {
      setIsLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || 'Reklamlar yüklenemedi',
      };
    }
  }, []);

  // Get next ad to watch
  const getNextAd = useCallback(async (sprintId: string) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.get(`/ads/next?sprintId=${sprintId}`);
      // setCurrentAd(response.data);

      // Mock ad selection
      const adsResult = await fetchActiveAds(sprintId);
      if (adsResult.success && adsResult.data && adsResult.data.length > 0) {
        const randomAd = adsResult.data[Math.floor(Math.random() * adsResult.data.length)];
        setCurrentAd(randomAd);
        return { success: true, data: randomAd };
      }

      return { success: false, error: 'Aktif reklam bulunamadı' };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Reklam alınamadı',
      };
    }
  }, [fetchActiveAds]);

  // Record ad view and award tickets
  const recordAdView = useCallback(async (adId: string, viewDuration: number) => {
    try {
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı girişi gerekli',
        };
      }

      // Check minimum view duration
      if (viewDuration < config.minAdViewDuration) {
        return {
          success: false,
          raffleTicketEarned: false,
          error: `Minimum ${config.minAdViewDuration} saniye izlenmelidir`,
        };
      }

      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.post('/ads/view', {
      //   adId,
      //   viewDuration,
      //   userId: user.id,
      // });

      // Mock ad view recording
      await new Promise(resolve => setTimeout(resolve, 500));

      // Calculate tickets with multiplier
      const baseTickets = 1;
      const ticketsEarned = Math.floor(baseTickets * myMultiplier);

      // Award tickets
      incrementTickets(ticketsEarned);

      const response: AdViewResponse = {
        success: true,
        raffleTicketEarned: true,
        multiplier: myMultiplier,
        message: `${ticketsEarned} çekiliş hakkı kazandınız!`,
      };

      return response;
    } catch (error: any) {
      return {
        success: false,
        raffleTicketEarned: false,
        error: error.response?.data?.message || 'Reklam izlenme kaydedilemedi',
      };
    }
  }, [user, myMultiplier, incrementTickets]);

  // Get banner ads for home page
  const getBannerAds = useCallback(async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.get('/ads/banners');
      // return { success: true, data: response.data };

      // Mock banner ads
      const mockBanners: Ad[] = [
        {
          id: 'banner-1',
          advertiserId: '1',
          type: AdType.BANNER,
          title: 'Sponsor Banner',
          imageUrl: 'https://via.placeholder.com/400x200',
          bannerUrl: 'https://via.placeholder.com/400x200',
          duration: 0,
          isActive: true,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          impressionCount: 0,
          clickCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return { success: true, data: mockBanners };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Banner reklamlar yüklenemedi',
      };
    }
  }, []);

  // Get cover ad
  const getCoverAd = useCallback(async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.get('/ads/cover');
      // return { success: true, data: response.data };

      // Mock cover ad
      const mockCover: Ad = {
        id: 'cover-1',
        advertiserId: '1',
        type: AdType.COVER,
        title: 'Weekly Sponsor',
        coverUrl: 'https://via.placeholder.com/800x400',
        duration: 0,
        isActive: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        impressionCount: 0,
        clickCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { success: true, data: mockCover };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Cover reklam yüklenemedi',
      };
    }
  }, []);

  return {
    currentAd,
    isLoading,
    fetchActiveAds,
    getNextAd,
    recordAdView,
    getBannerAds,
    getCoverAd,
  };
};


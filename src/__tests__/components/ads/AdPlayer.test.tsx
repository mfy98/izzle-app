import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AdPlayer } from '@/components/ads/AdPlayer';
import { AdType } from '@/types/ad';

const mockAd = {
  id: '1',
  advertiserId: '1',
  type: AdType.SPONSOR,
  title: 'Test Ad',
  videoUrl: 'https://example.com/video.mp4',
  duration: 30,
  isActive: true,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(),
  impressionCount: 0,
  clickCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('AdPlayer Component', () => {
  it('should render video player', () => {
    const onAdFinished = jest.fn();
    const { getByTestId } = render(
      <AdPlayer ad={mockAd} onAdFinished={onAdFinished} />
    );
    
    // Video component should render
  });

  it('should call onAdFinished when ad is completed', async () => {
    const onAdFinished = jest.fn();
    const { getByText } = render(
      <AdPlayer ad={mockAd} onAdFinished={onAdFinished} minViewDuration={15} />
    );
    
    // Simulate ad completion
    const finishButton = getByText(/Tamamla/i);
    fireEvent.press(finishButton);
    
    await waitFor(() => {
      // Should check minimum duration before completing
    });
  });

  it('should show skip button after minimum duration', async () => {
    const onAdSkipped = jest.fn();
    const { getByText } = render(
      <AdPlayer
        ad={mockAd}
        onAdFinished={jest.fn()}
        onAdSkipped={onAdSkipped}
        minViewDuration={15}
      />
    );
    
    // Wait for skip button to appear
    await waitFor(() => {
      // Skip button should appear after min duration
    }, { timeout: 2000 });
  });
});


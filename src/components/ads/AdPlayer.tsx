import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors, sizes } from '@/constants';
import { Ad } from '@/types/ad';

interface AdPlayerProps {
  ad: Ad;
  onAdFinished: () => void;
  onAdSkipped?: () => void;
  minViewDuration?: number; // seconds
}

export const AdPlayer: React.FC<AdPlayerProps> = ({
  ad,
  onAdFinished,
  onAdSkipped,
  minViewDuration = 15,
}) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewedDuration, setViewedDuration] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (status?.isLoaded) {
        const currentTime = status.positionMillis / 1000;
        setViewedDuration(currentTime);

        // Can skip after minimum view duration
        if (currentTime >= minViewDuration && !canSkip) {
          setCanSkip(true);
        }

        // Auto finish when video ends
        if (status.didJustFinish) {
          handleFinish();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, canSkip, minViewDuration]);

  const handleFinish = () => {
    if (viewedDuration >= minViewDuration) {
      onAdFinished();
    }
  };

  const handleSkip = () => {
    if (canSkip && onAdSkipped) {
      onAdSkipped();
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    if (status.isLoaded) {
      setIsLoading(false);
    }
  };

  if (!ad.videoUrl) {
    return (
      <Card style={styles.card}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Reklam yüklenemedi</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: ad.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping={false}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          {ad.logoUrl && (
            <View style={styles.logoContainer}>
              {/* Logo will be displayed here */}
              <Text style={styles.sponsorText}>{ad.title}</Text>
            </View>
          )}
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {Math.floor(viewedDuration)}s / {ad.duration}s
            </Text>
            {!canSkip && (
              <Text style={styles.skipHint}>
                {Math.ceil(minViewDuration - viewedDuration)}s sonra geçebilirsiniz
              </Text>
            )}
          </View>

          <View style={styles.buttonsContainer}>
            {canSkip && onAdSkipped && (
              <Button
                variant="outlined"
                onPress={handleSkip}
                style={styles.skipButton}
              >
                Geç
              </Button>
            )}
            <Button
              variant="primary"
              onPress={handleFinish}
              disabled={viewedDuration < minViewDuration}
              style={styles.finishButton}
            >
              Tamamla
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: sizes.md,
  },
  container: {
    padding: sizes.md,
  },
  videoContainer: {
    width: '100%',
    height: 250,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.md,
    overflow: 'hidden',
    marginBottom: sizes.md,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  infoContainer: {
    marginBottom: sizes.md,
  },
  logoContainer: {
    alignItems: 'center',
  },
  sponsorText: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  controlsContainer: {
    gap: sizes.sm,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  progressText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  skipHint: {
    fontSize: sizes.fontSize.xs,
    color: colors.textLight,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: sizes.sm,
  },
  skipButton: {
    flex: 1,
  },
  finishButton: {
    flex: 1,
  },
  errorContainer: {
    padding: sizes.xl,
    alignItems: 'center',
  },
  errorText: {
    fontSize: sizes.fontSize.md,
    color: colors.error,
  },
});


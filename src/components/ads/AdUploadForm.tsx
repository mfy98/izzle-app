import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, sizes } from '@/constants';
import { apiClient } from '@/services/api/client';
import { AdType } from '@/types/ad';

interface AdUploadFormProps {
  onUploadSuccess?: () => void;
}

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_DURATION = 300; // 5 minutes
const MIN_VIDEO_DURATION = 15; // 15 seconds

export const AdUploadForm: React.FC<AdUploadFormProps> = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [adType, setAdType] = useState<AdType>(AdType.SPONSOR);
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    type: string;
    size: number;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        if (asset.fileSize && asset.fileSize > MAX_VIDEO_SIZE) {
          Alert.alert('Hata', 'Video dosyası 100MB\'dan büyük olamaz.');
          return;
        }

        if (asset.duration && (asset.duration < MIN_VIDEO_DURATION || asset.duration > MAX_VIDEO_DURATION)) {
          Alert.alert('Hata', `Video süresi ${MIN_VIDEO_DURATION}-${MAX_VIDEO_DURATION} saniye arasında olmalıdır.`);
          return;
        }

        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || 'video.mp4',
          type: 'video/mp4',
          size: asset.fileSize || 0,
        });
        setAdType(AdType.SPONSOR);
      }
    } catch (error) {
      Alert.alert('Hata', 'Video seçilirken bir hata oluştu.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE) {
          Alert.alert('Hata', 'Görsel dosyası 10MB\'dan büyük olamaz.');
          return;
        }

        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || 'image.jpg',
          type: 'image/jpeg',
          size: asset.fileSize || 0,
        });
        setAdType(AdType.BANNER);
      }
    } catch (error) {
      Alert.alert('Hata', 'Görsel seçilirken bir hata oluştu.');
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert('Uyarı', 'Lütfen reklam başlığı girin.');
      return;
    }

    if (!selectedFile) {
      Alert.alert('Uyarı', 'Lütfen bir dosya seçin.');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Uyarı', 'Lütfen başlangıç ve bitiş tarihlerini girin.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type,
      } as any);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('adType', adType);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);

      const response = await apiClient.post('/advertiser/ads/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? (progressEvent.loaded / progressEvent.total) * 100
            : 0;
          setUploadProgress(progress);
        },
      });

      Alert.alert('Başarılı', 'Reklam yüklendi! Admin onayı bekleniyor.');
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setStartDate('');
      setEndDate('');
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Reklam yüklenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Card style={styles.card}>
      <CardHeader title="Reklam Yükle" />
      
      <Input
        label="Reklam Başlığı"
        value={title}
        onChangeText={setTitle}
        placeholder="Reklam başlığını girin"
        style={styles.input}
      />

      <Input
        label="Açıklama"
        value={description}
        onChangeText={setDescription}
        placeholder="Reklam açıklaması (opsiyonel)"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <View style={styles.fileSelection}>
        <Text style={styles.label}>Dosya Seçimi</Text>
        <View style={styles.fileButtons}>
          <Button
            variant="outlined"
            onPress={pickVideo}
            style={styles.fileButton}
          >
            Video Seç
          </Button>
          <Button
            variant="outlined"
            onPress={pickImage}
            style={styles.fileButton}
          >
            Görsel Seç
          </Button>
        </View>
        
        {selectedFile && (
          <View style={styles.selectedFile}>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
            <Text style={styles.fileSize}>{formatFileSize(selectedFile.size)}</Text>
            <TouchableOpacity
              onPress={() => setSelectedFile(null)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Kaldır</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Input
        label="Başlangıç Tarihi"
        value={startDate}
        onChangeText={setStartDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <Input
        label="Bitiş Tarihi"
        value={endDate}
        onChangeText={setEndDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      {isUploading && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.progressText}>
            Yükleniyor... %{Math.round(uploadProgress)}
          </Text>
        </View>
      )}

      <Button
        variant="primary"
        onPress={handleUpload}
        disabled={isUploading}
        style={styles.uploadButton}
      >
        {isUploading ? 'Yükleniyor...' : 'Reklamı Yükle'}
      </Button>

      <Text style={styles.note}>
        * Yüklenen reklamlar admin onayından sonra yayınlanacaktır.
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: sizes.md,
  },
  input: {
    marginBottom: sizes.md,
  },
  fileSelection: {
    marginBottom: sizes.md,
  },
  label: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  fileButtons: {
    flexDirection: 'row',
    gap: sizes.sm,
  },
  fileButton: {
    flex: 1,
  },
  selectedFile: {
    marginTop: sizes.sm,
    padding: sizes.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.md,
  },
  fileName: {
    fontSize: sizes.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
    marginBottom: sizes.xs,
  },
  fileSize: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: sizes.sm,
  },
  removeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    backgroundColor: colors.error + '20',
    borderRadius: sizes.borderRadius.sm,
  },
  removeButtonText: {
    fontSize: sizes.fontSize.xs,
    color: colors.error,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.md,
    gap: sizes.sm,
  },
  progressText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  uploadButton: {
    marginTop: sizes.sm,
  },
  note: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
    marginTop: sizes.sm,
    textAlign: 'center',
  },
});


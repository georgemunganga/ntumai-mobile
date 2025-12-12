// Location and mapping service
import * as Location from 'expo-location';
import { LocationObject, LocationSubscription } from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Address {
  address: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

class LocationService {
  private currentLocation: LocationObject | null = null;
  private locationListener: LocationSubscription | null = null;
  private isTracking = false;

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request location permissions:', error);
      return false;
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Location permission not granted');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      this.currentLocation = location;
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }

  /**
   * Get current location cached
   */
  getCurrentLocationCached(): Coordinates | null {
    if (!this.currentLocation) return null;
    return {
      latitude: this.currentLocation.coords.latitude,
      longitude: this.currentLocation.coords.longitude,
    };
  }

  /**
   * Start tracking location
   */
  async startTracking(
    callback: (location: Coordinates) => void,
    intervalMs: number = 5000
  ): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Location permission not granted');
        return;
      }

      this.isTracking = true;
      this.locationListener = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: intervalMs,
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          this.currentLocation = location;
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    } catch (error) {
      console.error('Failed to start location tracking:', error);
    }
  }

  /**
   * Stop tracking location
   */
  stopTracking(): void {
    if (this.locationListener) {
      this.locationListener.remove();
      this.locationListener = null;
      this.isTracking = false;
    }
  }

  /**
   * Check if tracking
   */
  isTrackingActive(): boolean {
    return this.isTracking;
  }

  /**
   * Geocode address to coordinates
   */
  async geocodeAddress(address: string): Promise<Coordinates | null> {
    try {
      const results = await Location.geocodeAsync(address);
      if (results.length > 0) {
        return {
          latitude: results[0].latitude,
          longitude: results[0].longitude,
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to geocode address:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocodeCoordinates(
    latitude: number,
    longitude: number
  ): Promise<Address | null> {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length > 0) {
        const result = results[0];
        return {
          address: `${result.street || ''} ${result.name || ''}`.trim(),
          city: result.city || '',
          region: result.region || '',
          country: result.country || '',
          latitude,
          longitude,
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to reverse geocode coordinates:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(coord2.latitude - coord1.latitude);
    const dLon = this.toRad(coord2.longitude - coord1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.latitude)) *
        Math.cos(this.toRad(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Calculate bearing between two coordinates
   */
  calculateBearing(coord1: Coordinates, coord2: Coordinates): number {
    const dLon = this.toRad(coord2.longitude - coord1.longitude);
    const y = Math.sin(dLon) * Math.cos(this.toRad(coord2.latitude));
    const x =
      Math.cos(this.toRad(coord1.latitude)) * Math.sin(this.toRad(coord2.latitude)) -
      Math.sin(this.toRad(coord1.latitude)) *
        Math.cos(this.toRad(coord2.latitude)) *
        Math.cos(dLon);
    const bearing = Math.atan2(y, x);
    return (this.toDeg(bearing) + 360) % 360;
  }

  /**
   * Convert radians to degrees
   */
  private toDeg(rad: number): number {
    return rad * (180 / Math.PI);
  }

  /**
   * Check if coordinates are within radius
   */
  isWithinRadius(
    center: Coordinates,
    point: Coordinates,
    radiusKm: number
  ): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radiusKm;
  }

  /**
   * Get nearby coordinates (simulate geofencing)
   */
  getNearbyCoordinates(
    center: Coordinates,
    radiusKm: number,
    count: number = 5
  ): Coordinates[] {
    const nearby: Coordinates[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * 2 * Math.PI);
      const distance = Math.random() * radiusKm;
      const lat = center.latitude + (distance / 111) * Math.cos(angle);
      const lon = center.longitude + (distance / (111 * Math.cos(this.toRad(center.latitude)))) * Math.sin(angle);
      nearby.push({ latitude: lat, longitude: lon });
    }
    return nearby;
  }
}

export const locationService = new LocationService();

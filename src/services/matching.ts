// Auto-matching service for job assignment
import { locationService } from './location';

interface Tasker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  completionRate: number;
  acceptanceRate: number;
  badge: 'bronze' | 'silver' | 'gold';
  isOnline: boolean;
  currentJobCount: number;
}

interface Job {
  id: string;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  type: 'delivery' | 'task' | 'errand';
  specialization?: string;
  priority: 'low' | 'medium' | 'high';
}

interface MatchScore {
  taskerId: string;
  score: number;
  proximity: number;
  rating: number;
  completionRate: number;
  acceptanceRate: number;
}

class MatchingService {
  private maxConcurrentJobs = 3;
  private proximityWeight = 0.4;
  private ratingWeight = 0.3;
  private completionRateWeight = 0.15;
  private acceptanceRateWeight = 0.15;

  /**
   * Find best tasker for a job
   */
  findBestTasker(job: Job, availableTaskers: Tasker[]): Tasker | null {
    // Filter eligible taskers
    const eligibleTaskers = availableTaskers.filter(
      (tasker) =>
        tasker.isOnline &&
        tasker.currentJobCount < this.maxConcurrentJobs &&
        tasker.rating >= 4.0
    );

    if (eligibleTaskers.length === 0) {
      return null;
    }

    // Calculate match scores
    const scores = eligibleTaskers.map((tasker) =>
      this.calculateMatchScore(job, tasker)
    );

    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);

    // Return tasker with highest score
    const bestMatch = scores[0];
    return eligibleTaskers.find((t) => t.id === bestMatch.taskerId) || null;
  }

  /**
   * Find multiple taskers for a job (for reassignment)
   */
  findTaskersForJob(job: Job, availableTaskers: Tasker[], count: number = 5): Tasker[] {
    // Filter eligible taskers
    const eligibleTaskers = availableTaskers.filter(
      (tasker) =>
        tasker.isOnline &&
        tasker.currentJobCount < this.maxConcurrentJobs &&
        tasker.rating >= 3.5
    );

    if (eligibleTaskers.length === 0) {
      return [];
    }

    // Calculate match scores
    const scores = eligibleTaskers.map((tasker) =>
      this.calculateMatchScore(job, tasker)
    );

    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);

    // Return top N taskers
    return scores
      .slice(0, count)
      .map((score) => eligibleTaskers.find((t) => t.id === score.taskerId))
      .filter((t) => t !== undefined) as Tasker[];
  }

  /**
   * Calculate match score for a tasker
   */
  private calculateMatchScore(job: Job, tasker: Tasker): MatchScore {
    // Calculate proximity score (0-1, 1 is closest)
    const proximityScore = this.calculateProximityScore(
      { latitude: job.pickupLatitude, longitude: job.pickupLongitude },
      { latitude: tasker.latitude, longitude: tasker.longitude }
    );

    // Calculate rating score (0-1, normalized to 3.5-5.0 range)
    const ratingScore = Math.max(0, (tasker.rating - 3.5) / 1.5);

    // Completion rate score (0-1)
    const completionRateScore = tasker.completionRate / 100;

    // Acceptance rate score (0-1)
    const acceptanceRateScore = tasker.acceptanceRate / 100;

    // Calculate weighted score
    const totalScore =
      proximityScore * this.proximityWeight +
      ratingScore * this.ratingWeight +
      completionRateScore * this.completionRateWeight +
      acceptanceRateScore * this.acceptanceRateWeight;

    return {
      taskerId: tasker.id,
      score: totalScore,
      proximity: proximityScore,
      rating: ratingScore,
      completionRate: completionRateScore,
      acceptanceRate: acceptanceRateScore,
    };
  }

  /**
   * Calculate proximity score
   */
  private calculateProximityScore(
    pickupLocation: { latitude: number; longitude: number },
    taskerLocation: { latitude: number; longitude: number }
  ): number {
    const distance = locationService.calculateDistance(
      {
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
      },
      {
        latitude: taskerLocation.latitude,
        longitude: taskerLocation.longitude,
      }
    );

    // Distance in km, closer is better
    // 0 km = 1.0, 5 km = 0.5, 10+ km = 0.0
    return Math.max(0, 1 - distance / 10);
  }

  /**
   * Estimate wait time for job
   */
  estimateWaitTime(availableTaskers: Tasker[]): string {
    const onlineCount = availableTaskers.filter((t) => t.isOnline).length;

    if (onlineCount === 0) {
      return '5-10 minutes';
    } else if (onlineCount < 5) {
      return '2-3 minutes';
    } else if (onlineCount < 10) {
      return '1-2 minutes';
    } else {
      return '30 seconds';
    }
  }

  /**
   * Check if tasker is specialized for job type
   */
  isSpecializedForJob(tasker: Tasker, job: Job): boolean {
    if (!job.specialization) return true;

    // Check if tasker has relevant specialization
    // This would be expanded based on actual specialization data
    return true;
  }

  /**
   * Get tasker availability
   */
  getTaskerAvailability(tasker: Tasker): 'available' | 'busy' | 'offline' {
    if (!tasker.isOnline) {
      return 'offline';
    }
    if (tasker.currentJobCount >= this.maxConcurrentJobs) {
      return 'busy';
    }
    return 'available';
  }

  /**
   * Calculate estimated earnings for job
   */
  calculateEstimatedEarnings(
    distance: number,
    jobType: 'delivery' | 'task' | 'errand'
  ): number {
    // Base rates per km
    const baseRates = {
      delivery: 0.5,
      task: 0.75,
      errand: 1.0,
    };

    // Minimum earnings
    const minimumEarnings = {
      delivery: 2.0,
      task: 3.0,
      errand: 5.0,
    };

    const baseRate = baseRates[jobType];
    const minimum = minimumEarnings[jobType];

    return Math.max(minimum, distance * baseRate);
  }

  /**
   * Calculate ETA (estimated time of arrival)
   */
  calculateETA(
    taskerLocation: { latitude: number; longitude: number },
    pickupLocation: { latitude: number; longitude: number }
  ): number {
    // Calculate distance
    const distance = locationService.calculateDistance(
      taskerLocation,
      pickupLocation
    );

    // Assume average speed of 30 km/h in urban areas
    const averageSpeed = 30;
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = timeInHours * 60;

    return Math.ceil(timeInMinutes);
  }

  /**
   * Update tasker weights based on performance
   */
  updateWeights(badge: 'bronze' | 'silver' | 'gold'): void {
    // Adjust weights based on badge level
    // Higher badge levels get higher priority
    switch (badge) {
      case 'gold':
        this.proximityWeight = 0.3;
        this.ratingWeight = 0.4;
        this.completionRateWeight = 0.15;
        this.acceptanceRateWeight = 0.15;
        break;
      case 'silver':
        this.proximityWeight = 0.35;
        this.ratingWeight = 0.35;
        this.completionRateWeight = 0.15;
        this.acceptanceRateWeight = 0.15;
        break;
      case 'bronze':
      default:
        this.proximityWeight = 0.4;
        this.ratingWeight = 0.3;
        this.completionRateWeight = 0.15;
        this.acceptanceRateWeight = 0.15;
        break;
    }
  }
}

export const matchingService = new MatchingService();


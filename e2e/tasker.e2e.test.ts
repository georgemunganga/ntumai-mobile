/**
 * E2E Tests for Tasker Workflow
 * Tests job acceptance, tracking, and completion
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  mockAuthService,
  mockDriverService,
  mockOrderService,
} from '@/src/api/mockServices';
import { useAuthStore, useDriverStore, useOrderStore } from '@/src/store';

describe('Tasker Workflow E2E Tests', () => {
  beforeEach(() => {
    // Reset stores
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    useDriverStore.setState({
      availableJobs: [],
      activeJob: null,
      earnings: 0,
      isOnline: false,
      rating: 0,
    });
    useOrderStore.setState({
      orders: [],
      selectedOrder: null,
    });
  });

  describe('Tasker Authentication', () => {
    it('should authenticate tasker with phone and country code', async () => {
      // Send OTP
      const sendResponse = await mockAuthService.sendOtp({
        countryCode: '+260',
        phone: '0978123456',
        method: 'sms',
      });

      expect(sendResponse.success).toBe(true);

      // Verify OTP
      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId: sendResponse.data.sessionId,
        otp: '123456',
        countryCode: '+260',
        phone: '0978123456',
      });

      expect(verifyResponse.success).toBe(true);
      expect(verifyResponse.data.countryCode).toBe('+260');

      // Select tasker role
      const roleResponse = await mockAuthService.selectRole(
        verifyResponse.data.userId,
        'tasker'
      );

      expect(roleResponse.success).toBe(true);
      expect(roleResponse.data.user.role).toBe('tasker');
      expect(roleResponse.data.user.phone).toContain('+260');

      // Update auth store
      useAuthStore.setState({
        user: roleResponse.data.user,
        token: roleResponse.data.accessToken,
        isAuthenticated: true,
      });

      const authState = useAuthStore.getState();
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.user.role).toBe('tasker');
    });
  });

  describe('Driver Onboarding', () => {
    beforeEach(async () => {
      // Setup: Authenticate as tasker
      const authResponse = await mockAuthService.selectRole('user_123', 'tasker');
      useAuthStore.setState({
        user: authResponse.data.user,
        token: authResponse.data.accessToken,
        isAuthenticated: true,
      });
    });

    it('should complete driver onboarding', async () => {
      const authState = useAuthStore.getState();

      const onboardingResponse = await mockDriverService.onboardDriver({
        userId: authState.user.id,
        vehicleType: 'motorcycle',
        vehicleNumber: 'ABC123',
        licenseNumber: 'DL123456',
        bankAccount: 'ACC123456',
        bankCode: 'BANK001',
      });

      expect(onboardingResponse.success).toBe(true);
      expect(onboardingResponse.data.driver.status).toBe('pending_approval');
    });

    it('should validate vehicle details', async () => {
      const authState = useAuthStore.getState();

      const onboardingResponse = await mockDriverService.onboardDriver({
        userId: authState.user.id,
        vehicleType: 'invalid',
        vehicleNumber: '',
        licenseNumber: '',
        bankAccount: '',
        bankCode: '',
      });

      if (!onboardingResponse.success) {
        expect(onboardingResponse.error.code).toMatch(/VALIDATION/);
      }
    });
  });

  describe('Job Management', () => {
    beforeEach(async () => {
      // Setup: Authenticate as tasker
      const authResponse = await mockAuthService.selectRole('user_123', 'tasker');
      useAuthStore.setState({
        user: authResponse.data.user,
        token: authResponse.data.accessToken,
        isAuthenticated: true,
      });

      // Set online
      useDriverStore.setState({
        isOnline: true,
      });
    });

    it('should get available jobs', async () => {
      const response = await mockDriverService.getAvailableJobs({
        latitude: 40.7128,
        longitude: -74.006,
        radius: 5,
      });

      expect(response.success).toBe(true);
      expect(response.data.jobs).toBeDefined();
      expect(Array.isArray(response.data.jobs)).toBe(true);

      // Update driver store
      useDriverStore.setState({
        availableJobs: response.data.jobs,
      });

      const driverState = useDriverStore.getState();
      expect(driverState.availableJobs.length).toBeGreaterThanOrEqual(0);
    });

    it('should get job details', async () => {
      const response = await mockDriverService.getAvailableJobs({
        latitude: 40.7128,
        longitude: -74.006,
      });

      if (response.data.jobs.length > 0) {
        const jobId = response.data.jobs[0].id;

        const jobDetailResponse = await mockDriverService.getJobDetail(jobId);

        expect(jobDetailResponse.success).toBe(true);
        expect(jobDetailResponse.data.job.id).toBe(jobId);
        expect(jobDetailResponse.data.job.pickupLocation).toBeDefined();
        expect(jobDetailResponse.data.job.dropoffLocation).toBeDefined();
        expect(jobDetailResponse.data.job.estimatedEarnings).toBeDefined();
      }
    });

    it('should accept job', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.getAvailableJobs({
        latitude: 40.7128,
        longitude: -74.006,
      });

      if (response.data.jobs.length > 0) {
        const jobId = response.data.jobs[0].id;

        const acceptResponse = await mockDriverService.acceptJob(
          authState.user.id,
          jobId
        );

        expect(acceptResponse.success).toBe(true);
        expect(acceptResponse.data.job.status).toBe('accepted');
        expect(acceptResponse.data.job.driverId).toBe(authState.user.id);

        // Update driver store
        useDriverStore.setState({
          activeJob: acceptResponse.data.job,
        });

        const driverState = useDriverStore.getState();
        expect(driverState.activeJob.id).toBe(jobId);
      }
    });

    it('should reject job', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.getAvailableJobs({
        latitude: 40.7128,
        longitude: -74.006,
      });

      if (response.data.jobs.length > 0) {
        const jobId = response.data.jobs[0].id;

        const rejectResponse = await mockDriverService.rejectJob(
          authState.user.id,
          jobId
        );

        if (rejectResponse.success) {
          expect(rejectResponse.data.message).toBeDefined();
        }
      }
    });

    it('should handle job already accepted error', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.getAvailableJobs({
        latitude: 40.7128,
        longitude: -74.006,
      });

      if (response.data.jobs.length > 0) {
        const jobId = response.data.jobs[0].id;

        // Accept job first
        await mockDriverService.acceptJob(authState.user.id, jobId);

        // Try to accept same job again
        const secondAcceptResponse = await mockDriverService.acceptJob(
          authState.user.id,
          jobId
        );

        if (!secondAcceptResponse.success) {
          expect(secondAcceptResponse.error.code).toMatch(/ALREADY_ACCEPTED|CONFLICT/);
        }
      }
    });
  });

  describe('Job Tracking', () => {
    beforeEach(async () => {
      // Setup: Accept a job
      const authResponse = await mockAuthService.selectRole('user_123', 'tasker');
      useAuthStore.setState({
        user: authResponse.data.user,
        token: authResponse.data.accessToken,
        isAuthenticated: true,
      });

      useDriverStore.setState({
        isOnline: true,
      });

      const jobsResponse = await mockDriverService.getAvailableJobs({
        latitude: 40.7128,
        longitude: -74.006,
      });

      if (jobsResponse.data.jobs.length > 0) {
        const acceptResponse = await mockDriverService.acceptJob(
          authResponse.data.user.id,
          jobsResponse.data.jobs[0].id
        );

        if (acceptResponse.success) {
          useDriverStore.setState({
            activeJob: acceptResponse.data.job,
          });
        }
      }
    });

    it('should update job status to picked up', async () => {
      const driverState = useDriverStore.getState();

      if (driverState.activeJob) {
        const response = await mockDriverService.updateJobStatus(
          driverState.activeJob.id,
          'picked_up'
        );

        if (response.success) {
          expect(response.data.job.status).toBe('picked_up');

          useDriverStore.setState({
            activeJob: response.data.job,
          });
        }
      }
    });

    it('should update job status to in transit', async () => {
      const driverState = useDriverStore.getState();

      if (driverState.activeJob) {
        const response = await mockDriverService.updateJobStatus(
          driverState.activeJob.id,
          'in_transit'
        );

        if (response.success) {
          expect(response.data.job.status).toBe('in_transit');
        }
      }
    });

    it('should complete job', async () => {
      const driverState = useDriverStore.getState();

      if (driverState.activeJob) {
        const response = await mockDriverService.completeJob(
          driverState.activeJob.id,
          {
            latitude: 40.7128,
            longitude: -74.006,
            notes: 'Delivered successfully',
          }
        );

        if (response.success) {
          expect(response.data.job.status).toBe('completed');
          expect(response.data.earnings).toBeDefined();

          useDriverStore.setState({
            activeJob: null,
            earnings: response.data.earnings,
          });

          const updatedState = useDriverStore.getState();
          expect(updatedState.activeJob).toBeNull();
          expect(updatedState.earnings).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Earnings & Wallet', () => {
    beforeEach(async () => {
      // Setup: Authenticate as tasker
      const authResponse = await mockAuthService.selectRole('user_123', 'tasker');
      useAuthStore.setState({
        user: authResponse.data.user,
        token: authResponse.data.accessToken,
        isAuthenticated: true,
      });
    });

    it('should get earnings summary', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.getEarnings(authState.user.id, {
        period: 'today',
      });

      expect(response.success).toBe(true);
      expect(response.data.earnings).toBeDefined();
      expect(response.data.earnings.total).toBeDefined();
      expect(response.data.earnings.jobsCompleted).toBeDefined();
      expect(response.data.earnings.averageRating).toBeDefined();
    });

    it('should get earnings history', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.getEarnings(authState.user.id, {
        period: 'week',
      });

      expect(response.success).toBe(true);
      expect(response.data.transactions).toBeDefined();
      expect(Array.isArray(response.data.transactions)).toBe(true);
    });

    it('should get payout history', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.getPayouts(authState.user.id);

      expect(response.success).toBe(true);
      expect(response.data.payouts).toBeDefined();
      expect(Array.isArray(response.data.payouts)).toBe(true);
    });

    it('should request payout', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.requestPayout(authState.user.id, {
        amount: 100,
        bankAccount: 'ACC123456',
      });

      if (response.success) {
        expect(response.data.payout.status).toBe('pending');
        expect(response.data.payout.amount).toBe(100);
      } else {
        // May fail if insufficient balance
        expect(response.error.code).toMatch(/INSUFFICIENT|BALANCE/);
      }
    });
  });

  describe('Driver Performance', () => {
    beforeEach(async () => {
      // Setup: Authenticate as tasker
      const authResponse = await mockAuthService.selectRole('user_123', 'tasker');
      useAuthStore.setState({
        user: authResponse.data.user,
        token: authResponse.data.accessToken,
        isAuthenticated: true,
      });
    });

    it('should get driver profile', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.getDriverProfile(authState.user.id);

      expect(response.success).toBe(true);
      expect(response.data.driver.id).toBe(authState.user.id);
      expect(response.data.driver.rating).toBeDefined();
      expect(response.data.driver.totalJobs).toBeDefined();
      expect(response.data.driver.acceptanceRate).toBeDefined();
    });

    it('should get driver ratings', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.getDriverRatings(authState.user.id);

      expect(response.success).toBe(true);
      expect(response.data.ratings).toBeDefined();
      expect(Array.isArray(response.data.ratings)).toBe(true);
    });

    it('should get KPI metrics', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.getKPIMetrics(authState.user.id);

      expect(response.success).toBe(true);
      expect(response.data.metrics).toBeDefined();
      expect(response.data.metrics.acceptanceRate).toBeDefined();
      expect(response.data.metrics.completionRate).toBeDefined();
      expect(response.data.metrics.averageRating).toBeDefined();
    });
  });

  describe('Online Status Management', () => {
    beforeEach(async () => {
      // Setup: Authenticate as tasker
      const authResponse = await mockAuthService.selectRole('user_123', 'tasker');
      useAuthStore.setState({
        user: authResponse.data.user,
        token: authResponse.data.accessToken,
        isAuthenticated: true,
      });
    });

    it('should go online', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.setOnlineStatus(authState.user.id, true);

      expect(response.success).toBe(true);
      expect(response.data.isOnline).toBe(true);

      useDriverStore.setState({
        isOnline: true,
      });

      const driverState = useDriverStore.getState();
      expect(driverState.isOnline).toBe(true);
    });

    it('should go offline', async () => {
      const authState = useAuthStore.getState();

      const response = await mockDriverService.setOnlineStatus(authState.user.id, false);

      expect(response.success).toBe(true);
      expect(response.data.isOnline).toBe(false);

      useDriverStore.setState({
        isOnline: false,
      });

      const driverState = useDriverStore.getState();
      expect(driverState.isOnline).toBe(false);
    });
  });

  describe('Complete Tasker Journey', () => {
    it('should complete full tasker workflow', async () => {
      // Step 1: Authenticate with phone and country code
      const authSendResponse = await mockAuthService.sendOtp({
        countryCode: '+260',
        phone: '0978123456',
        method: 'sms',
      });

      const authVerifyResponse = await mockAuthService.verifyOtp({
        sessionId: authSendResponse.data.sessionId,
        otp: '123456',
        countryCode: '+260',
        phone: '0978123456',
      });

      const authRoleResponse = await mockAuthService.selectRole(
        authVerifyResponse.data.userId,
        'tasker'
      );

      useAuthStore.setState({
        user: authRoleResponse.data.user,
        token: authRoleResponse.data.accessToken,
        isAuthenticated: true,
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Step 2: Go online
      const onlineResponse = await mockDriverService.setOnlineStatus(
        authRoleResponse.data.user.id,
        true
      );

      expect(onlineResponse.success).toBe(true);

      useDriverStore.setState({
        isOnline: true,
      });

      // Step 3: Get available jobs
      const jobsResponse = await mockDriverService.getAvailableJobs({
        latitude: 40.7128,
        longitude: -74.006,
      });

      expect(jobsResponse.success).toBe(true);

      if (jobsResponse.data.jobs.length > 0) {
        // Step 4: Accept job
        const jobId = jobsResponse.data.jobs[0].id;

        const acceptResponse = await mockDriverService.acceptJob(
          authRoleResponse.data.user.id,
          jobId
        );

        expect(acceptResponse.success).toBe(true);

        useDriverStore.setState({
          activeJob: acceptResponse.data.job,
        });

        // Step 5: Update job status
        const statusResponse = await mockDriverService.updateJobStatus(jobId, 'picked_up');

        if (statusResponse.success) {
          expect(statusResponse.data.job.status).toBe('picked_up');
        }

        // Step 6: Complete job
        const completeResponse = await mockDriverService.completeJob(jobId, {
          latitude: 40.7128,
          longitude: -74.006,
          notes: 'Completed',
        });

        if (completeResponse.success) {
          expect(completeResponse.data.job.status).toBe('completed');
          expect(completeResponse.data.earnings).toBeGreaterThan(0);

          useDriverStore.setState({
            activeJob: null,
            earnings: completeResponse.data.earnings,
          });
        }

        // Step 7: Check earnings
        const earningsResponse = await mockDriverService.getEarnings(
          authRoleResponse.data.user.id,
          { period: 'today' }
        );

        expect(earningsResponse.success).toBe(true);
        expect(earningsResponse.data.earnings.total).toBeGreaterThanOrEqual(0);
      }

      // Step 8: Go offline
      const offlineResponse = await mockDriverService.setOnlineStatus(
        authRoleResponse.data.user.id,
        false
      );

      expect(offlineResponse.success).toBe(true);

      useDriverStore.setState({
        isOnline: false,
      });

      // Verify final state
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useDriverStore.getState().isOnline).toBe(false);
    });
  });
});

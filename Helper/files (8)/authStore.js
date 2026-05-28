import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { clearAuth } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ─── OTP Flow ────────────────────────────────────────

      sendOTP: async (phone) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/send-otp', { phone });
          set({ isLoading: false });
          return { success: true, isNewUser: data.data.isNewUser };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to send OTP.';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      verifyOTP: async ({ phone, otp, role }) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/verify-otp', { phone, otp, role });
          const { accessToken, refreshToken, user, profile, isNewUser } = data.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({
            user,
            profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, isNewUser, role: user.role };
        } catch (error) {
          const message = error.response?.data?.message || 'Invalid OTP.';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      resendOTP: async (phone) => {
        try {
          await api.post('/auth/resend-otp', { phone });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data?.message || 'Failed to resend.' };
        }
      },

      // ─── Session ─────────────────────────────────────────

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.data.user, profile: data.data.profile });
          return data.data;
        } catch {
          return null;
        }
      },

      updateProfile: (profile) => set({ profile }),

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Logout server-side failure is non-blocking
        } finally {
          clearAuth();
          set({ user: null, profile: null, isAuthenticated: false, error: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'even-cargo-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

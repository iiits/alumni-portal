import { axiosInstance } from "@/lib/api/axios";
import { useUserStore } from "@/lib/store/user";

export const handleLogout = async () => {
  try {
    // Call logout API
    await axiosInstance.post("/auth/logout");

    // Clear user store
    useUserStore.getState().logout();

    // Clear cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Clear local storage
    localStorage.removeItem("user-storage");

    // Refresh the page to ensure clean state
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

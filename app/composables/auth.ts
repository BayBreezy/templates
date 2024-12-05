/**
 * The logged in user state.
 *
 * @returns A state object containing the logged in user or null.
 */
export const useUser = () => useState<typeof authClient.$Infer.Session | null>("template_user");

export const useAuth = () => {
  const router = useRouter();
  /** The state of the logged in user */
  const user = useUser();
  /** State indicating if the user is logged in or not */
  const isAuth = computed(() => !!user.value);

  /**
   * Fetch the current user and update the user state.
   */
  const getUser = async () => {
    const { data } = await authClient.useSession(useFetch);
    if (data.value) {
      user.value = data.value;
    }
  };

  /**
   * Log out the current user and clear the user state.
   */
  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          user.value = null;
          router.push("/auth/login"); // Redirect to login page after logout
        },
      },
    });
  };

  return {
    user,
    isAuth,
    getUser,
    logout,
  };
};

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Local interface to prevent circular dependency with RootState
interface LocalRootState {
  auth: {
    token: string | null;
  };
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as LocalRootState;
      const token = state.auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Logs",
    "Delegations",
    "Tenant",
    "Stats",
    "Workflows",
    "Tasks",
    "Delegation",
    "Execution",
  ],
  endpoints: (builder) => ({
    // RE-ADD: Health Check from Slice 1
    getHealthCheck: builder.query<{ status: string }, void>({
      query: () => "/health",
      transformResponse: (response: {
        success: boolean;
        data: { status: string };
      }) => response.data,
    }),

    // AUTH & USER: Slice 2
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => "/users/self",
      providesTags: ["User"],
    }),
    getMyLogs: builder.query({
      query: () => "/governance/logs/self",
      providesTags: ["Logs"],
    }),
    createDelegation: builder.mutation({
      query: (data) => ({
        url: "/governance/delegations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Delegations"],
    }),
    getBranding: builder.query<any, void>({
      query: () => "/tenant/branding",
      providesTags: ["Tenant"],
    }),
    updateBranding: builder.mutation<any, any>({
      query: (body) => ({
        url: "/tenant/branding",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tenant"],
    }),
    storeVaultSecret: builder.mutation<any, { keyName: string; value: string }>(
      {
        query: (body) => ({
          url: "/vault/secrets", // Adjusted to match backend route
          method: "POST",
          body,
        }),
      },
    ),
    getDashboardStats: builder.query<
      { activeFlows: number; completedTasks: number },
      void
    >({
      query: () => "/dashboard/stats",
      providesTags: ["Stats", "Workflows", "Tasks"],
    }),

    getRecentWorkflows: builder.query<any[], { limit: number }>({
      query: ({ limit }) => `/workflows/recent?limit=${limit}`,
      providesTags: ["Workflows"],
    }),
    getDashboardOverview: builder.query<any, void>({
      query: () => "/dashboard/mobile-overview",
      // transformResponse pulls the nested 'data' object from our Node response
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["Stats", "Workflows"],
    }),
    getWorkflows: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) =>
        `/workflows?page=${page}&limit=${limit}`,
      providesTags: ["Workflows"],
    }),

    getWorkflowById: builder.query<any, string>({
      query: (id) => `/workflows/${id}`,
      providesTags: (result, error, id) => [{ type: "Workflows", id }],
    }),
    // --- SLICE 7: MOBILE TASK ACTIONS & COLLABORATION ---
    getMyTasks: builder.query<any, void>({
      query: () => "/tasks/my",
      providesTags: ["Tasks"],
    }),
    getTaskById: builder.query<any, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: ["Tasks"],
    }),
    handleTaskAction: builder.mutation<
      any,
      { taskId: string; action: string; formData?: any; targetUserId?: string }
    >({
      query: ({ taskId, ...body }) => ({
        url: `/tasks/${taskId}/action`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks", "Execution", "Workflows"],
    }),
    getComments: builder.query<any, string>({
      query: (executionId) => `/tasks/executions/${executionId}/comments`,
      providesTags: (result, error, id) => [{ type: "Tasks", id: "COMMENTS" }],
    }),
    addComment: builder.mutation<
      any,
      { executionId: string; content: string; taskId?: string }
    >({
      query: ({ executionId, ...body }) => ({
        url: `/tasks/executions/${executionId}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tasks", id: "COMMENTS" }],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useGetHealthCheckQuery,
  useLoginMutation,
  useGetProfileQuery,
  useGetMyLogsQuery,
  useCreateDelegationMutation,
  useGetBrandingQuery,
  useUpdateBrandingMutation,
  useStoreVaultSecretMutation,
  useGetDashboardStatsQuery,
  useGetRecentWorkflowsQuery,
  useGetDashboardOverviewQuery,
  useGetWorkflowsQuery,
  useGetWorkflowByIdQuery,
  useGetMyTasksQuery,
  useGetTaskByIdQuery,
  useHandleTaskActionMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
} = baseApi;

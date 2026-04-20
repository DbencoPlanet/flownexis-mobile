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
    "Templates",
    "TemplateCategories",
    "Documents",
    "Wallet",
    "Transaction",
    "Subscription",
    "Vault",
    "Jobs",
    "Analytics",
    "Notifications",
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
    getExecutionTrace: builder.query<any, string>({
      query: (id) => `/executions/${id}`,
      providesTags: (result, error, id) => [{ type: "Execution", id }],
    }),
    /**
     * GET /executions/ongoing
     * Fetches paginated active workflow requests
     */
    getOngoingExecutions: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) =>
        `/executions/ongoing?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: any) => ({
                type: "Executions" as const,
                id,
              })),
              { type: "Executions", id: "LIST" },
            ]
          : [{ type: "Executions", id: "LIST" }],
    }),
    getTemplates: builder.query<
      any,
      { marketplace?: boolean; categoryId?: string; search?: string }
    >({
      query: (params) => ({
        url: "/templates",
        params,
      }),
      providesTags: ["Templates"],
    }),
    getTemplateCategories: builder.query<any, void>({
      query: () => "/templates/categories",
      providesTags: ["TemplateCategories"],
    }),
    forgeTemplate: builder.mutation<any, string>({
      query: (id) => ({
        url: `/templates/${id}/forge`,
        method: "POST",
      }),
      // This tells RTK Query to refetch any component currently showing "Templates"
      invalidatesTags: ["Templates"],
    }),

    // --- DOCUMENTS ---
    getDocuments: builder.query<any, any>({
      query: (params) => ({
        url: "/documents",
        // RTK Query automatically converts this object into query strings:
        // ?search=val&page=1&limit=10
        params,
      }),
      providesTags: ["Documents"],
    }),
    getWallet: builder.query<any, void>({
      query: () => "/wallet",
      providesTags: ["Wallet"],
    }),
    getTransactions: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => `/transactions?page=${page}&limit=${limit}`,
      providesTags: ["Transaction"],
    }),
    fundWallet: builder.mutation<any, { amount: number }>({
      query: (body) => ({
        url: "/wallet/fund",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet", "Transaction"],
    }),
    getSubscription: builder.query<any, void>({
      query: () => "/subscriptions",
      providesTags: ["Subscription"],
    }),
    getSubscriptionPlans: builder.query<any, void>({
      query: () => "/subscriptions/plans", // Assuming you added this endpoint to backend as we did for web
    }),
    upgradeSubscription: builder.mutation<any, { planId: string }>({
      query: (body) => ({
        url: "/subscriptions/upgrade",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
    getVaultSecrets: builder.query<any, void>({
      query: () => "/billing/integrations", // Adjust path based on your routes
      providesTags: ["Vault"],
    }),
    storebillingVaultSecret: builder.mutation<
      any,
      { keyName: string; secretValue: string }
    >({
      query: (body) => ({
        url: "/billing/vault/secrets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vault"],
    }),
    // Integrations & Vault
    getIntegrations: builder.query<any, void>({
      query: () => "/integrations",
      providesTags: ["Vault"],
    }),
    storeintegrationVaultSecret: builder.mutation<
      any,
      { keyName: string; secretValue: string }
    >({
      query: (body) => ({
        url: "/integrations/vault",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vault"],
    }),
    deleteIntegration: builder.mutation<any, string>({
      query: (id) => ({
        url: `/integrations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vault"],
    }),

    // Background Jobs
    getJobStatus: builder.query<any, string>({
      query: (id) => `/integrations/jobs/${id}`,
    }),
    triggerManualJob: builder.mutation<any, { jobName: string; data: any }>({
      query: (body) => ({
        url: "/integrations/jobs/trigger",
        method: "POST",
        body,
      }),
    }),
    getJobHistory: builder.query<any, void>({
      query: () => "/integrations/jobs/history",
      providesTags: ["Jobs"],
    }),

    // --- 📊 INTELLIGENCE & PROCESS MINING ---
    getAnalyticsDashboard: builder.query<any, void>({
      query: () => "/analytics/dashboard",
      providesTags: ["Analytics"],
    }),
    getBottlenecks: builder.query<any, void>({
      query: () => "/analytics/bottlenecks",
      providesTags: ["Analytics"],
    }),
    getProcessMining: builder.query<any, void>({
      query: () => "/analytics/process-mining",
      providesTags: ["Analytics"],
    }),

    // --- 🔔 DEDICATED NOTIFICATIONS ---
    getNotifications: builder.query<any, void>({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
    getKnowledge: builder.query<any, void>({
      query: () => "/intelligence/knowledge",
      providesTags: ["Logs"],
    }),
    uploadKnowledge: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/intelligence/knowledge/ingest",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Logs"],
    }),
    executeAgenticTask: builder.mutation<any, any>({
      query: (data) => ({
        url: "/intelligence/agent/execute",
        method: "POST",
        body: data,
      }),
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
  useGetExecutionTraceQuery,
  useGetOngoingExecutionsQuery,
  useGetTemplatesQuery,
  useGetTemplateCategoriesQuery,
  useGetDocumentsQuery,
  useForgeTemplateMutation,
  useGetWalletQuery,
  useGetTransactionsQuery,
  useFundWalletMutation,
  useGetSubscriptionQuery,
  useGetSubscriptionPlansQuery,
  useUpgradeSubscriptionMutation,
  useGetVaultSecretsQuery,
  useStorebillingVaultSecretMutation,
  useGetIntegrationsQuery,
  useStoreintegrationVaultSecretMutation,
  useDeleteIntegrationMutation,
  useGetJobStatusQuery,
  useTriggerManualJobMutation,
  useGetJobHistoryQuery,
  useGetAnalyticsDashboardQuery,
  useGetBottlenecksQuery,
  useGetProcessMiningQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useExecuteAgenticTaskMutation,
  useGetKnowledgeQuery,
  useUploadKnowledgeMutation,
} = baseApi;

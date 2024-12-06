<template>
  <div class="container py-5">
    <PageHeading :title="title" :description="description">
      <div class="flex items-center gap-3">
        <TemplateCreate>
          <UiButton size="sm"><Icon name="lucide:plus" /> Add Template</UiButton>
        </TemplateCreate>
      </div>
    </PageHeading>

    <UiDivider class="my-8" />

    <div class="mt-10">
      <UiDatatable :options="options" :columns="columns" @ready="tableRef = $event">
        <template #actions="{ cellData }: { cellData: Template }">
          <div class="flex items-center justify-end gap-2">
            <UiButton
              class="size-8"
              size="icon-sm"
              @click="
                () =>
                  $router.push(`/admin/projects/${data?.data.id}/templates/${cellData.id}/editor`)
              "
            >
              <UiIcon name="lucide:pen-line" />
            </UiButton>
            <TemplateDelete :template="cellData" @refresh="tableRef?.draw()">
              <UiButton class="size-8" size="icon-sm" variant="outline">
                <UiIcon name="lucide:trash-2"
              /></UiButton>
            </TemplateDelete>
          </div>
        </template>
      </UiDatatable>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DTRef from "datatables.net";
  import type { Config, ConfigColumns } from "datatables.net";

  definePageMeta({ layout: "project" });
  const route = useRoute("admin-projects-id-templates");

  const { data } = await useAsyncData(() => useProject().getById(route.params.id));
  const title = computed(() => data.value?.data.name || "");
  const description = computed(
    () => data.value?.data.description || "Manage your project templates here."
  );
  useSeoMeta({ title, description });
  // provide project data so child comps can access it
  provide("project-details", data);
  // Set the current project
  const currentProject = useCurrentProject();
  currentProject.value = data.value?.data;

  const tableRef = shallowRef<InstanceType<typeof DTRef<Template[]>> | null>(null);
  const columns: ConfigColumns[] = [
    { data: "id", title: "ID", visible: false },
    { data: "name", title: "Template name", responsivePriority: 0.5 },
    {
      data: "createdAt",
      title: "Created At",
      render(data) {
        return useDateFormat(data, "MMM DD, YYYY [at] h:mm A").value;
      },
    },
    {
      data: null,
      title: "",
      className: "no-export no-column",
      searchable: false,
      orderable: false,
      width: "150px",
      name: "actions",
      render: "#actions",
      responsivePriority: 1,
    },
  ];

  const options: Config = {
    buttons: [
      {
        extend: "colvis",
        text: "Columns",
        columns: ":not(.no-column)",
      },
      {
        extend: "excel",
        title: `Templates - ${useDateFormat(new Date(), "MMM DD, YYYY").value}`,
        exportOptions: { columns: ":not(.no-export)" },
      },
    ],
    language: {
      search: "",
      searchPlaceholder: "Search...",
      zeroRecords: getEmptyTableMessage(
        "Search not found",
        'You can create a new template by clicking <span class="text-primary">Add Template</span>.'
      ),
      emptyTable: getEmptyTableMessage(
        undefined,
        'You can create a new template by clicking <span class="text-primary">Add Template</span>.'
      ),
    },
    dom: "<'flex flex-col lg:flex-row w-full lg:items-start lg:justify-between gap-5 mb-5'Bf><'border rounded-md't><'flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between py-4 px-0'li><''p>",
    responsive: {
      details: {
        // @ts-expect-error - hidden nodes
        renderer: DTRef.Responsive.renderer.listHiddenNodes(),
      },
    },
    order: [[columns.findIndex((c) => c.data == "createdAt"), "desc"]],
    autoWidth: true,
    serverSide: true,
    processing: true,
    async ajax(data: any, callback: any) {
      const res = await useTemplate().get(route.params.id, {
        sort: data.order.map((o: any) => ({
          [data.columns[o.column].data]: o.dir,
        })),
        search: data.search?.value,
        page: data.start / data.length + 1,
        limit: data.length,
      });
      callback({
        draw: Number(data.draw),
        data: res.data,
        recordsTotal: res.meta?.totalCount,
        recordsFiltered: res.data.length + (res.meta?.totalCount || 0) - res.data.length,
      });
    },
  };
</script>

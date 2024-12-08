<template>
  <div>
    <MainNav />
    <div class="container py-5">
      <PageHeading :title="title" :description="description">
        <ProjectCreate>
          <UiButton size="sm">Add Project</UiButton>
        </ProjectCreate>
      </PageHeading>

      <UiDivider class="my-8" />

      <UiDatatable :options="options" :columns="columns">
        <template #actions="{ cellData }: { cellData: Project }">
          <div class="flex items-center justify-end gap-2">
            <UiButton
              class="h-8"
              size="sm"
              @click="() => $router.push(`/admin/projects/${cellData.id}/templates`)"
              >Manage</UiButton
            >
          </div>
        </template>
      </UiDatatable>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DTRef from "datatables.net";
  import type { Config, ConfigColumns } from "datatables.net";

  const title = "Projects";
  const description = "Here you can manage your projects.";
  useSeoMeta({ title, description });

  const columns: ConfigColumns[] = [
    { data: "id", title: "ID" },
    { data: "name", title: "Project name", responsivePriority: 0.5 },
    { title: "Template count", data: "_count.templates", orderable: false, searchable: false },
    {
      data: "createdAt",
      title: "Created At",
      render(data, type) {
        return type == "display" || type === "filter"
          ? useDateFormat(data, "MMMM DD, YYYY [at] h:mm A").value
          : data;
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
        title: `Projects - ${useDateFormat(new Date(), "MMM DD, YYYY").value}`,
        exportOptions: { columns: ":not(.no-export)" },
      },
    ],
    language: {
      search: "",
      searchPlaceholder: "Search...",
      zeroRecords: getEmptyTableMessage(
        "Search not found",
        'You can create a new project by clicking <span class="text-primary">Add Project</span>.'
      ),
      emptyTable: getEmptyTableMessage(
        undefined,
        'You can create a new project by clicking <span class="text-primary">Add Project</span>.'
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
      const res = await useProject().get({
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

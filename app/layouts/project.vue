<template>
  <UiSidebarProvider v-slot="{ isMobile, state }">
    <!-- App Sidebar -->
    <UiSidebar collapsible="icon">
      <!-- Team switcher -->
      <UiSidebarHeader>
        <UiSidebarMenu>
          <UiSidebarMenuItem>
            <div v-if="state != 'collapsed'" class="p-2">
              <p class="line-clamp-1 font-semibold">{{ currentProject?.name }}</p>
              <p
                v-tippy="currentProject?.description"
                class="line-clamp-1 text-sm text-muted-foreground"
              >
                {{ currentProject?.description }}
              </p>
            </div>
            <div v-else v-tippy.right="currentProject?.name" class="p-2 pb-0">
              <p class="line-clamp-1 font-semibold">{{ currentProject?.name.substring(0, 1) }}</p>
              <UiDivider class="mt-6" />
            </div>
          </UiSidebarMenuItem>
        </UiSidebarMenu>
      </UiSidebarHeader>
      <UiSidebarContent>
        <!-- Projects -->
        <UiSidebarGroup>
          <UiSidebarGroupLabel label="Project configuration" />
          <UiSidebarMenu>
            <UiSidebarMenuItem>
              <ProjectEdit :project="currentProject">
                <UiSidebarMenuButton tooltip="Edit the project name">
                  <Icon name="lucide:pen-line" />
                  <span>Edit project name</span>
                </UiSidebarMenuButton>
              </ProjectEdit>
            </UiSidebarMenuItem>
            <UiSidebarMenuItem>
              <ProjectDelete :project="currentProject">
                <UiSidebarMenuButton tooltip="Delete the project name">
                  <Icon name="lucide:trash-2" />
                  <span>Delete project name</span>
                </UiSidebarMenuButton>
              </ProjectDelete>
            </UiSidebarMenuItem>
          </UiSidebarMenu>
        </UiSidebarGroup>
      </UiSidebarContent>
      <UiSidebarRail />
      <!-- Footer-->
      <UiSidebarFooter>
        <UiSidebarMenu>
          <UiSidebarMenuItem>
            <UiDropdownMenu>
              <UiDropdownMenuTrigger as-child>
                <UiSidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UiAvatar class="size-9 rounded-lg">
                    <UiAvatarFallback>
                      <Icon name="lucide:user" class="size-5" />
                    </UiAvatarFallback>
                  </UiAvatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="line-clamp-1 font-semibold">{{ user?.user?.name }}</span>
                    <span class="line-clamp-1 text-xs">{{ user?.user.email }}</span>
                  </div>
                  <Icon name="lucide:chevrons-up-down" class="ml-auto size-4" />
                </UiSidebarMenuButton>
              </UiDropdownMenuTrigger>
              <UiDropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                :side="isMobile ? 'bottom' : 'right'"
                :side-offset="4"
                align="end"
              >
                <UiDropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UiAvatar class="size-9">
                      <UiAvatarFallback>
                        <Icon name="lucide:user" class="size-5" />
                      </UiAvatarFallback>
                    </UiAvatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span v-tippy="user?.user.name" class="line-clamp-1 font-semibold">{{
                        user?.user?.name
                      }}</span>
                      <span v-tippy="user?.user.email" class="line-clamp-1 text-xs">{{
                        user?.user.email
                      }}</span>
                    </div>
                  </div>
                </UiDropdownMenuLabel>
                <UiDropdownMenuSeparator />
                <UiDropdownMenuGroup>
                  <UiDropdownMenuItem icon="lucide:badge-check" title="Account" />
                </UiDropdownMenuGroup>
                <UiDropdownMenuSeparator />
                <UiDropdownMenuItem
                  icon="lucide:log-out"
                  title="Log out"
                  @select="useAuth().logout()"
                />
              </UiDropdownMenuContent>
            </UiDropdownMenu>
          </UiSidebarMenuItem>
        </UiSidebarMenu>
      </UiSidebarFooter>
    </UiSidebar>
    <!-- Sidebar main content -->
    <UiSidebarInset>
      <!-- Navbar -->
      <MainNav>
        <template #sidebar-trigger>
          <div class="mr-3 flex items-center gap-3">
            <UiSidebarTrigger class="-ml-1 size-9">
              <Icon name="lucide:panel-left" class="size-5 text-muted-foreground" />
            </UiSidebarTrigger>
            <UiSeparator orientation="vertical" class="h-4" />
          </div>
        </template>
      </MainNav>
      <slot />
    </UiSidebarInset>
  </UiSidebarProvider>
</template>

<script lang="ts" setup>
  const currentProject = useCurrentProject();
  const user = useUser();
</script>

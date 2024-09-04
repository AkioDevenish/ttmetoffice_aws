<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @setSidebarOpen="setSidebarOpen" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @setSidebarOpen="setSidebarOpen" />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <!-- Dashboard actions -->
          <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <!-- Left: Title -->
            <div class="mb-4 sm:mb-0">
              <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Automatic Weather</h1>
            </div>

            <!-- Right: Actions -->
            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <!-- Filter button -->
              <FilterButton align="right" />
              <!-- Datepicker built with flatpickr -->
              <Datepicker align="right" />
              <!-- Add view button -->
              <button class="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                <svg class="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span class="max-xs:sr-only">Add View</span>
              </button>
            </div>
          </div>

          <!-- Cards -->
          <div class="grid grid-cols-12 gap-6">
            <!-- Line chart (Real Time Value Brasso) -->
            <DashboardCard02 />
            <!-- Line chart (Real Time Value Piarco) -->
            <DashboardCard03 />
            <!-- Line chart (Real Time Value Penal) -->
            <DashboardCard04 />
            <!-- Line chart (Real Time Value Guayaguayare) -->
            <DashboardCard05 />
            <!-- Line chart (Real Time Value Port-of-Spain) -->
            <DashboardCard06 />
            <!-- Line chart (Real Time Value Toco) -->
            <DashboardCard07 />
            <!-- Line chart (Real Time Value Synoptic) -->
            <DashboardCard08 />
            <!-- Line chart (Real Time Value UWI) -->
            <DashboardCard09 />
            <!-- Line chart (Real Time Value UTT) -->
            <DashboardCard10 />
            <!-- Line chart (Real Time Value ASJA) -->
            <DashboardCard11 />
            <!-- Table (Top Channels) -->
            <DashboardCard01 />
          </div>
        </div>
      </main>

      <Banner />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Sidebar from '../partials/Sidebar.vue';
import Header from '../partials/Header.vue';
import FilterButton from '../components/DropdownFilter.vue';
import Datepicker from '../components/Datepicker.vue';
import DashboardCard11 from '../partials/dashboard/DashboardCard11.vue';
import DashboardCard10 from '../partials/dashboard/DashboardCard10.vue';
import DashboardCard09 from '../partials/dashboard/DashboardCard09.vue';
import DashboardCard08 from '../partials/dashboard/DashboardCard08.vue';
import DashboardCard07 from '../partials/dashboard/DashboardCard07.vue';
import DashboardCard06 from '../partials/dashboard/DashboardCard06.vue';
import DashboardCard05 from '../partials/dashboard/DashboardCard05.vue';
import DashboardCard04 from '../partials/dashboard/DashboardCard04.vue';
import DashboardCard03 from '../partials/dashboard/DashboardCard03.vue';
import DashboardCard02 from '../partials/dashboard/DashboardCard02.vue';
import DashboardCard01 from '../partials/dashboard/DashboardCard01.vue';
import Banner from '../partials/Banner.vue';

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    Header,
    FilterButton,
    Datepicker,
    DashboardCard11,
    DashboardCard10,
    DashboardCard09,
    DashboardCard08,
    DashboardCard07,
    DashboardCard06,
    DashboardCard05,
    DashboardCard04,
    DashboardCard03,
    DashboardCard02,
    DashboardCard01,
    Banner,
  },
  setup() {
    const sidebarOpen = ref(false);

    const setSidebarOpen = (value) => {
      sidebarOpen.value = value;
    };

    return {
      sidebarOpen,
      setSidebarOpen,
    };
  },
};
</script>

<style scoped>
/* Add any scoped styles here */
</style>
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-sm mt-4">
    <div class="flex items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Учетные записи</h2>
      <button
        class="p-2 ml-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md cursor-pointer"
        @click="usersStore.addUser"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div class="mb-4 bg-blue-50 p-3 rounded-lg">
      <p class="text-sm text-blue-700">
        Для указания нескольких меток для одной пары логин/пароль используйте
        разделитель <span class="font-mono bg-blue-100 px-1 rounded">;</span>
      </p>
    </div>

    <!-- Заголовки полей -->
    <div class="grid grid-cols-12 gap-3 mb-2 px-3">
      <div
        class="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
      >
        Метки
      </div>
      <div
        class="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider"
      >
        Тип записи
      </div>
      <div
        class="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
      >
        Логин
      </div>
      <div
        class="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
      >
        Пароль
      </div>
      <div class="col-span-1"></div>
    </div>

    <div class="space-y-3">
      <!-- Обычные строки -->
      <RowInTable
        v-for="user in usersStore.users"
        :key="user.id"
        :user="user"
      />
      <!-- Последняя строка с объединенными полями -->
    </div>
  </div>
</template>

<script setup>
import RowInTable from "./RowInTable.vue";
import { useUsersStore } from "../stores/usersStore.ts";

const usersStore = useUsersStore();
function addEmptyUser() {
  usersStore.addUSer({
    tags: [],
    type: "Локальная",
    pogin: "",
    password: "",
  });
}
</script>


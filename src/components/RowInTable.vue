<template>
  <div
    class="grid grid-cols-12 gap-3 items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
  >
    <input
      type="text"
      v-model="tags"
      placeholder="Введите метки"
      :class="[
        'col-span-3 border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition',
        errors.tags ? 'border-red-500' : 'border-gray-200',
      ]"
      @blur="validationAndSave"
      :id="'tags' + user.id"
    />

    <select
      v-model="type"
      @change="validationAndSave"
      class="col-span-2 border cursor-pointer border-gray-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none bg-white transition"
    >
      <option>Локальная</option>
      <option>LDAP</option>
    </select>

    <input
      type="text"
      v-model="login"
      placeholder="Введите логин"
      :class="[
        'col-span-3 border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition',
        errors.login ? 'border-red-500' : 'border-gray-200',
      ]"
      v-if="type === 'Локальная'"
      @blur="validationAndSave"
    />

    <div class="col-span-3 relative" v-if="type === 'Локальная'">
      <input
        :type="isPasswordVisible ? 'text' : 'password'"
        v-model="password"
        placeholder="Введите пароль"
        :class="[
          'w-full border rounded-md p-2 text-sm pr-10 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition',
          errors.password ? 'border-red-500' : 'border-gray-200',
        ]"
        @blur="validationAndSave"
      />
      <button
        class="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        @click="isPasswordVisible = !isPasswordVisible"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <!-- Глаз (скрыт) -->
          <template v-if="!isPasswordVisible">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </template>

          <!-- Глаз перечеркнутый (показан) -->
          <template v-else>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.99 9.99 0 012.442-4.033M6.58 6.58A9.966 9.966 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.128 5.101M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <line
              x1="3"
              y1="3"
              x2="21"
              y2="21"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </template>
        </svg>
      </button>
    </div>

    <div class="col-span-6 relative flex" v-if="type === 'LDAP'">
      <input
        type="text"
        v-model="login"
        placeholder="Значение"
        :class="[
          'w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition',
          errors.login ? 'border-red-500' : 'border-gray-200',
        ]"
        @blur="validationAndSave"
      />
    </div>

    <button
      class="col-span-1 text-red-400 hover:text-red-600 transition-colors flex justify-center cursor-pointer"
      @click="removeUser"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUsersStore } from "../stores/usersStore.ts";

const isPasswordVisible = ref(false);
const usersStore = useUsersStore();

const tags = ref("");
const type = ref<"Локальная" | "LDAP">("Локальная");
const login = ref("");
const password = ref("");

const errors = ref<{
  tags?: boolean;
  login?: boolean;
  password?: boolean;
}>({});

interface User {
  id: number;
  tags?: { text: string }[];
  type: "LDAP" | "Локальная";
  login: string;
  password: string | null;
}

const props = defineProps<{
  user: User;
}>();

tags.value = props.user.tags?.map((t) => t.text).join(";") || "";
type.value = props.user.type || "Локальная";
login.value = props.user.login || "";
password.value = props.user.password || "";

function removeUser() {
  usersStore.removeUserById(props.user.id);
}

function validationAndSave() {
  errors.value = {};

  let isValid = true;

  if (!tags.value.trim() || tags.value.trim().length > 50) {
    errors.value.tags = true;
    isValid = false;
  }

  if (!login.value.trim() || login.value.trim().length > 100) {
    errors.value.login = true;
    isValid = false;
  }

  if (
    type.value === "Локальная" &&
    (!password.value ||
      password.value.length < 3 ||
      password.value.length > 100)
  ) {
    errors.value.password = true;
    isValid = false;
  }

  if (isValid) {
    usersStore.updateUser({
      id: props.user.id,
      tags: tags.value
        .split(";")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
        .map((tag) => ({ text: tag })),
      type: type.value,
      login: login.value.trim(),
      password: type.value === "Локальная" ? password.value : null,
    });
  }
}
</script>

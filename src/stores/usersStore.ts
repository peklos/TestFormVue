import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useUsersStore = defineStore("users", () => {
  interface User {
    id: number;
    tags?: { text: string }[];
    type: "LDAP" | "Локальная";
    login: string;
    password: string | null;
  }

  const users = ref<User[]>([]);
  const lastId = ref(0);

  const storedUsers = localStorage.getItem("users");
  const storedLastId = localStorage.getItem("lastId");

  if (storedUsers) {
    try {
      users.value = JSON.parse(storedUsers);
    } catch (e) {
      console.error("Ошибка парсинга пользователей из ЛокалСторейдж: ", e);
    }
  }

  if (!users.value.length) {
    lastId.value = 0;
  } else if (storedLastId) {
    lastId.value = parseInt(storedLastId, 10) || 0;
  }

  watch(
    users,
    (newVal) => {
      localStorage.setItem("users", JSON.stringify(newVal));
      if (!users.value.length) {
        localStorage.setItem("lastId", String(0));
        lastId.value = 0
      } else {
        localStorage.setItem("lastId", String(lastId.value));
      }
    },
    { deep: true }
  );

  function addUser(user: Omit<User, "id">) {
    lastId.value += 1;
    users.value.push({ ...user, id: lastId.value });
  }

  function removeUserById(id: number) {
    users.value = users.value.filter((user) => user.id !== id);
  }

  function updateUser(updatedUser: User) {
    const index = users.value.findIndex((user) => user.id === updatedUser.id);

    if (index !== -1) {
      users.value[index] = { ...updatedUser };
    }

    console.log(users.value);
  }

  return {
    users,
    addUser,
    removeUserById,
    updateUser,
  };
});

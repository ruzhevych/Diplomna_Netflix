
import Footer from "../../components/Footer/Footer";
import { useState } from "react";
import { useGetUsersQuery } from "../../services/adminApi";
import UserSearch from "../../components/Admin/UserSearch";
import Pagination from "../../components/Admin/Pagination";
import { useBlockUserMutation, useSendMessageMutation, useDeleteUserMutation, useChangeUserRoleMutation, useUnblockUserMutation } from "../../services/adminApi";


export default function AdminDashboardPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [blockUser] = useBlockUserMutation();
const [unblockUser] = useUnblockUserMutation();
const [changeUserRole] = useChangeUserRoleMutation();
const [deleteUser] = useDeleteUserMutation();
const [sendMessage] = useSendMessageMutation();

  const { data, isLoading, isError } = useGetUsersQuery({
    page,
    pageSize: 10,
    search,
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Адмінка — Користувачі</h1>

        {/* Пошук */}
        <div className="mb-4">
          <UserSearch onSearch={(val) => { setPage(1); setSearch(val); }} />
        </div>

        {/* Стани */}
        {isLoading && <p className="text-gray-400">Завантаження...</p>}
        {isError && <p className="text-red-500">Помилка завантаження</p>}

        {/* Таблиця */}
        {data && (
          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#1f1f1f] text-gray-300">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Ім’я</th>
                  <th className="px-4 py-3">Роль</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Роль</th>
                  <th className="px-4 py-3">Дії</th>
                  <th className="px-4 py-3">Дії</th>
                  <th className="px-4 py-3">Написати</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.items.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">{u.id}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.fullName || "—"}</td>
                    <td className="px-4 py-3">{u.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs ${
                          u.isBlocked ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {u.isBlocked ? "Заблокований" : "Активний"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                    <select
                        value={u.role}
                        onChange={(e) => changeUserRole({ id: u.id, role: e.target.value })}
                        className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    </td>
                    <td className="px-4 py-3">
                    {u.isBlocked ? (
                        <button
                        onClick={() => unblockUser(u.id)}
                        className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                        Розблокувати
                        </button>
                    ) : (
                        <button
                        onClick={() => blockUser(u.id)}
                        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs"
                        >
                        Заблокувати
                        </button>
                    )}
                    </td>
                    <td className="px-4 py-3">
                    <button
                        onClick={() => {
                        if (window.confirm(`Ви впевнені, що хочете видалити ${u.email}?`)) {
                            deleteUser(u.id);
                        }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Видалити
                    </button>
                    </td>
                    <button
                    onClick={() => {
                        const subject = prompt("Введіть тему повідомлення:");
                        if (!subject) return;
                        const message = prompt("Введіть текст повідомлення:");
                        if (!message) return;

                        sendMessage({ userId: u.id, subject, message });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mr-2"
                    >
                    Написати
                    </button>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Пагінація */}
        {data && (
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            totalCount={data.totalCount}
            onPageChange={setPage}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

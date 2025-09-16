// src/components/UsersTable.tsx
import { useState, useMemo } from "react";
import {
  useGetUsersQuery,
  useBlockUserMutation,
  useSendMessageMutation,
  useDeleteUserMutation,
  useChangeUserRoleMutation,
  useUnblockUserMutation
} from "../../services/adminApi";
import { useGetProfileQuery } from "../../services/userApi";
import UserSearch from "./UserSearch";
import Pagination from "./Pagination";
import SendMessageModal from "./SendMessageModal";
import BlockUserModal from "./BlockUserModal";

type SortField = "id" | "email" | "fullName" | "role";
type SortOrder = "asc" | "desc";

function UsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [changeUserRole] = useChangeUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [sendMessage] = useSendMessageMutation();
  const { data: profile } = useGetProfileQuery();
  
  const adminId = profile?.id;

  const [isMsgOpen, setMsgOpen] = useState(false);
  const [isBlockOpen, setBlockOpen] = useState(false);
  type SelectedUser = { id: number; email: string };
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  const { data, isLoading, isError } = useGetUsersQuery({ page, pageSize: 10, search });

  const openMsgModal = (id: number, email: string) => {
    setSelectedUser({ id, email });
    setMsgOpen(true);
  };

  const openBlockModal = (id: number, email: string) => {
    setSelectedUser({ id, email });
    setBlockOpen(true);
  };

  const handleSend = async (subject: string, message: string) => {
    if (!selectedUser) return;
    await sendMessage({
      userId: selectedUser.id,
      subject,
      message,
    }).unwrap();
  };

  const sortedData = useMemo(() => {
    if (!data) return null;
    const items = [...data.items];
    items.sort((a, b) => {
      let valA: string | number = a[sortField] ?? "";
      let valB: string | number = b[sortField] ?? "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return { ...data, items };
  }, [data, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  
  return (
    <>
      <div className="mb-4">
        <UserSearch onSearch={(val) => { setPage(1); setSearch(val); }} />
      </div>

      {isLoading && <p className="text-gray-400">Завантаження...</p>}
      {isError && <p className="text-red-500">Помилка завантаження</p>}

      {sortedData && (
        <div className="overflow-x-auto rounded-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-700/30 text-gray-300">
              <tr>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("id")}>
                  ID {sortField === "id" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("email")}>
                  Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("fullName")}>
                  Ім’я {sortField === "fullName" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("role")}>
                  Роль {sortField === "role" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Роль</th>
                <th className="px-4 py-3">Блокування</th>
                <th className="px-4 py-3">Видалити</th>
                <th className="px-4 py-3">Написати</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sortedData.items.map((u) => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="text-xs text-white/55 px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.fullName || "—"}</td>
                  <td className="px-4 py-3">{u.role}</td>
                   <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-sm text-xs ${u.isBlocked ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                         {u.isBlocked ? "Заблокований" : "Активний"}
                      </span>
                   </td>
                   <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole({ id: u.id, role: e.target.value })}
                        className="rounded-sm bg-gray-700 px-2 py-1 text-sm text-white"
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Moderator">Moderator</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                       <div className="flex gap-2 justify-center">
                          {u.isBlocked ? (
                              <button
                                onClick={() => {
                                if (adminId === undefined) return; 
                                unblockUser({ userId: u.id, adminId });
                              }}
                              className="rounded-sm bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">
                                Розблокувати
                              </button>
                          ) : (
                              <button
                                onClick={() => openBlockModal(u.id, u.email)}
                                className="px-3 py-1 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs">
                                Заблокувати
                              </button>
                          )}
                       </div>
                    </td>
                    <td className="px-4 py-3">
                       <div className="flex gap-2 justify-center">
                          <button
                              onClick={() => {
                                 if (window.confirm(`Ви впевнені, що хочете видалити ${u.email}?`)) {
                                    deleteUser(u.id);
                                 }
                              }}
                              className="rounded-sm bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
                              Видалити
                          </button>
                       </div>
                    </td>
                    <td className="px-4 py-3">
                       <div className="flex gap-2 justify-center">
                          <button
                              onClick={() => openMsgModal(u.id, u.email)}
                              className="rounded-sm bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                              Написати
                          </button>
                       </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sortedData && (
        <Pagination
          page={sortedData.page}
          pageSize={sortedData.pageSize}
          totalCount={sortedData.totalCount}
          onPageChange={setPage}
        />
      )}
      
      <SendMessageModal
        open={isMsgOpen}
        onClose={() => setMsgOpen(false)}
        onSend={handleSend}
        userEmail={selectedUser?.email}
      />

      <BlockUserModal
        open={isBlockOpen}
        onClose={() => setBlockOpen(false)}
        onConfirm={(reason, days) => {
          if (!selectedUser || !adminId) return;
          blockUser({
            userId: selectedUser.id,
            adminId,
            durationDays: days ?? 0,
            reason: reason ?? '',
          });
        }}
        userEmail={selectedUser?.email}
      />
    </>
  );
};

export default UsersTable;
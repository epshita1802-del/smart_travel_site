import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch, FiTrash2, FiShield, FiSlash, FiCheckCircle } from "react-icons/fi";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";
import ConfirmModal from "../../../components/ConfirmModal";
import * as userService from "../../../services/userService";
import { getErrorMessage } from "../../../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers({ search });
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleRole = async (user) => {
    try {
      await userService.updateUser(user._id, { role: user.role === "admin" ? "user" : "admin" });
      toast.success("User role updated");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const toggleActive = async (user) => {
    try {
      await userService.updateUser(user._id, { isActive: !user.isActive });
      toast.success(user.isActive ? "User deactivated" : "User activated");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await userService.deleteUser(deleteTarget._id);
      toast.success("User deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 card p-3 max-w-sm">
        <FiSearch className="text-ink/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="outline-none text-sm w-full bg-transparent" />
      </div>

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/5 text-left text-ink/40 text-xs uppercase">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-ink/5 last:border-0">
                  <td className="p-4 font-semibold">{u.name}</td>
                  <td className="p-4 text-ink/60">{u.email}</td>
                  <td className="p-4">
                    <span className={`badge capitalize ${u.role === "admin" ? "bg-ocean-50 text-ocean-700" : "bg-sand-100 text-ink/60"}`}>{u.role}</span>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${u.isActive ? "bg-ocean-50 text-ocean-700" : "bg-coral-50 text-coral-700"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-ink/40 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => toggleRole(u)} title="Toggle admin role" className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center hover:bg-ocean-50 hover:text-ocean-700">
                        <FiShield size={14} />
                      </button>
                      <button onClick={() => toggleActive(u)} title="Toggle active status" className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center hover:bg-sand-100">
                        {u.isActive ? <FiSlash size={14} /> : <FiCheckCircle size={14} />}
                      </button>
                      <button onClick={() => setDeleteTarget(u)} title="Delete user" className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center hover:bg-coral-50 hover:text-coral-600">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this user?"
        message={`This will permanently remove ${deleteTarget?.name}. This action cannot be undone.`}
        confirmLabel="Delete user"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageUsers;

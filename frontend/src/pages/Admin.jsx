import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import socket from "../socket";
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,} from "recharts";

export default function Admin() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [form, setForm] = useState({title: "", desc: "", category: "", img: "", link: "",});
  const [charts, setCharts] = useState({userGrowth: [], bookTrend: [], });

  /* ================= SOCKET (REAL-TIME ADMIN) ================= */
  useEffect(() => {
    socket.connect();

    socket.emit("admin-join");

    socket.on("admin-update", () => {
      fetchStats();
      fetchUsers();
      fetchCharts();
      fetchBooks();
    });

    return () => socket.off("admin-update");
  }, []);

  /* ================= AUTO REFRESH ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
      fetchCharts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ================= INIT LOAD ================= */
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchCharts();
    fetchBooks();
  }, []);

  /* ================= FETCH ================= */
  const fetchBooks = async () => {
    try {
      setFetching(true);
      const res = await API.get("/books");
      setBooks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCharts = async () => {
    try {
      const res = await API.get("/admin/stats");
      setCharts(res.data?.charts || { userGrowth: [], bookTrend: [] });
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SAVE BOOK ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category) return alert("Fill required fields");

    setLoading(true);

    try {
      if (editingId) {
        await API.put(`/books/${editingId}`, form);
      } else {
        await API.post("/books", form);
      }

      setForm({
        title: "",
        desc: "",
        category: "",
        img: "",
        link: "",
      });

      setEditingId(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (book) => {
    setForm(book);
    setEditingId(book.id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;

    try {
      await API.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= NOTIFICATIONS ================= */
  const handleSendNotification = async () => {
    if (!selectedUserId) return alert("Select a user");

    try {
      await API.post("/notifications", {
        userId: selectedUserId,
        title: "New Course Assigned",
        message: "You have been enrolled in a new course",
        type: "admin",
      });

      alert("Notification sent!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMsg) return;

    try {
      await API.post("/notifications/broadcast", {
        title: "Announcement",
        message: broadcastMsg,
        type: "broadcast",
      });

      setBroadcastMsg("");
      alert("Broadcast sent!");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome Admin!</h1>

        {/* NOTIFICATION */}
        <button
          onClick={handleSendNotification}
          className="bg-purple-600 text-white p-2 rounded mb-4"
        >
          Send Notification
        </button>

        {/* BROADCAST */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <input
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            className="border p-2 w-full mb-2"
            placeholder="Broadcast message..."
          />
          <button
            onClick={handleBroadcast}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Send to All
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h3>Total Users</h3>
            <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3>Total Courses</h3>
            <p className="text-2xl font-bold">{stats?.totalCourses || 0}</p>
          </div>
        </div>

        {/* USER SELECT */}
        <select
          className="border p-2 w-full mb-4"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>

        {/* USERS */}
        <div className="bg-white p-4 rounded shadow mb-6">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between border-b py-2"
            >
              <div>
                <p>{u.email}</p>
                <p className="text-sm text-gray-500">{u.role}</p>
              </div>

              <button
                onClick={async () => {
                  if (!window.confirm("Delete user?")) return;
                  await API.delete(`/admin/users/${u.id}`);
                  fetchUsers();
                  fetchStats();
                }}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={charts?.userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="users" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={charts?.bookTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="books" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
          <input name="title" onChange={handleChange} value={form.title} className="border p-2 w-full mb-2" placeholder="Title" />
          <input name="desc" onChange={handleChange} value={form.desc} className="border p-2 w-full mb-2" placeholder="Desc" />
          <input name="category" onChange={handleChange} value={form.category} className="border p-2 w-full mb-2" placeholder="Category" />
          <input name="img" onChange={handleChange} value={form.img} className="border p-2 w-full mb-2" placeholder="Image" />
          <input name="link" onChange={handleChange} value={form.link} className="border p-2 w-full mb-2" placeholder="Link" />

          <button className="bg-purple-600 text-white px-4 py-2 rounded">
            {loading ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
        </form>

        {/* LIST */}
        <div className="mt-6">
          {books.map((b) => (
            <div key={b.id} className="flex justify-between p-2 border-b">
              <p>{b.title}</p>
              <div>
                <button onClick={() => handleEdit(b)} className="text-blue-500 mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-red-500">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
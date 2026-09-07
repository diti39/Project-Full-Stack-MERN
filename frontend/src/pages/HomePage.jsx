import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes", {
          params: {
            search,
            sort,
            page,
            limit: 5,
          },
        });
        const data = res.data;
        setNotes(data.notes);
        setTotalPages(data.totalPages);
        console.log("Fetched notes:", data);
        setIsRateLimited(false); // Reset rate limit state on successful fetch
      } catch (error) {
        console.error("Error fetching notes:");
        console.log(error.response);

        if (error.response?.status === 429) {
          setIsRateLimited(true);
          toast.error("Rate limit exceeded. Please try again later.");
        } else {
          toast.error("Failed to fetch notes. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [search, sort, page]);

  return (
    <div>
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input input-bordered w-full"
        />

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="select select-bordered"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}

        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            className="btn btn-outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ← Previous
          </button>

          <span className="font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;

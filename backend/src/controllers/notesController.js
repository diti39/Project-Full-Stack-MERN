import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    const {
      search = "",
      sort = "newest",
      page = 1,
      limit = 5,
    } = req.query;

    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit) || 5, 1), 20);

    const filter = {
      user: req.user.userId,
    };

    // Search title and content
    if (search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          content: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "title") {
      sortOption = { title: 1 };
    }

    // Count total matching notes
    const totalNotes = await Note.countDocuments(filter);

    const totalPages = Math.ceil(totalNotes / limitNumber);

    // Calculate how many documents to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Get notes for current page
    const notes = await Note.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      notes,
      currentPage: pageNumber,
      totalPages,
      totalNotes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({
      message: "Error fetching notes",
    });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({
      message: "Error fetching note",
    });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      user: req.user.userId,
    });

    await note.save();

    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({
      message: "Error creating note",
    });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({
      message: "Error updating note",
    });
  }
}

export async function deleteNote(req, res) {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({
      message: "Error deleting note",
    });
  }
}
const { Router } = require("express");
const config = require("config");
const Book = require("../models/Book");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.post("/generate/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { title, genre, tags, shortDecr, chapters } = req.body;

    if (userId === 'undefined') {
      const book = new Book({
        title,
        genre,
        tags,
        shortDecr,
        chapters,
        owner: req.user.userId,
      });
      await book.save();
      res.status(201).json(book);

    }
    else {
      const book = new Book({
        title,
        genre,
        tags,
        shortDecr,
        chapters,
        owner: userId,
      });
      await book.save();
      res.status(201).json({ book });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.userId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    Book.findByIdAndRemove({ _id: req.params.id }).then(function (books) {
      res.json(books);
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const obj = req.body;
    Book.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $addToSet: {
          chapters: obj,
        },
      },
      function (err, model) {
        res.json(model.chapters);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});
router.put("/:id/up", auth, async (req, res) => {
  try {
    Book.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
      Book.findOne({ _id: req.params.id }).then(function (books) {
        res.json(books);
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.delete("/:id/:index", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const index = req.params.index;
    const chapter = book.chapters[index];
    Book.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $pull: {
          chapters: chapter,
        },
      },
      function (err, model) {
        res.json(model.chapters[index]);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

module.exports = router;

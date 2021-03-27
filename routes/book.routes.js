const { Router } = require("express");
const config = require("config");
const Book = require("../models/Book");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.post("/generate/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { title, genre, tags, shortDecr, chapters,urlImg } = req.body;
    const comments = [];
    const raiting = [];
    if (userId === 'undefined') {
      const book = new Book({
        raiting,
        comments,
        urlImg,
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
        raiting,
        comments,
        urlImg,
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

    // books[0].avgRait = 4;
    // console.log(books);
    // books[0]['test'] = '11111111111111111';
    //  books.map((data, index) => {
    //   if (data.raiting.length !== 0) {

    //     books[index]['avgRait'] = data.raiting.reduce((a, b) => (a + b.rait),0);
    //     console.log(data.avgRait);
    //     console.log(books);

    //   }else{
    //     console.log(1234);
    //     data.avgRait = 0;
    //   }
    // });
    // console.log(books);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.get("/:id",  async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book.comments);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.get("/:id/rait",  async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book.raiting);
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
router.put("/:id/:arr", auth, async (req, res) => {
  try {
    const obj = req.body;
    // res.json(req.params.arr)
    Book.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $addToSet: {
          [req.params.arr]: obj,
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

router.put("/:id/:obj/uprait", auth, async (req, res) => {
  try {
    const obj = req.body;
    const field = req.params.obj;
    res.json(obj)
    Book.findOneAndUpdate(
      {
         "raiting.userId" : obj.userId,
      },
      {
        $set: {
          "raiting.$.rait": obj.rait,
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

router.put("/:id/chapter/obj", auth, async (req, res) => {
  try {
    const obj = req.body;
    res.json(obj)
    Book.findOneAndUpdate(
      {
         "chapters.default" : obj.defaultName,
      },
      {
        $set: {
          "chapters.$.name" : obj.name,
          "chapters.$.text" : obj.text,
          "chapters.$.urlImgChapter" : obj.urlImgChapter,

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

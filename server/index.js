const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser());
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb' }));

const sequelize = new Sequelize('photomaster', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

const User = sequelize.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  name: Sequelize.STRING,
  surname: Sequelize.STRING,
});

const Photo = sequelize.define('Photo', {
  image: {
    type: Sequelize.BLOB('medium'),
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Board = sequelize.define('Board', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

User.hasMany(Board, { foreignKey: 'userId' });
User.hasMany(Photo, { foreignKey: 'userId' });
Photo.belongsTo(User, { foreignKey: 'userId' });
Board.belongsTo(User, { foreignKey: 'userId' });

app.post('/register', async (req, res) => {
  const { username, password, name, surname } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      surname,
    });
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ error: 'Cannot register user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'secret-key', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/photos', upload.single('image'), async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret-key', async (err, user) => {
    if (err) return res.sendStatus(403);

    const file = req.file;
    const photo = await Photo.create({ image: file.buffer, userId: user.id });
    res.json(photo);
  });
});

app.delete('/photos/:id', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret-key', async (err, user) => {
    if (err) return res.sendStatus(403);

    const photo = await Photo.findOne({ where: { id: req.params.id } });
    await photo.destroy();
    res.json({ message: 'Photo deleted' });
  });
});

app.get('/photos', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret-key', async (err, user) => {
    if (err) return res.sendStatus(403);

    const photos = await Photo.findAll({
      where: { userId: user.id },
      include: User,
    });

    res.json(photos);
  });
});

app.post('/boards', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret-key', async (err, user) => {
    if (err) return res.sendStatus(403);

    const { content } = req.body;

    try {
      const board = await Board.create({ content, userId: user.id });
      res.status(201).json(board);
    } catch (err) {
      res.status(500).json({ error: 'Cannot create board' });
    }
  });
});

app.get('/boards', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret-key', async (err, user) => {
    if (err) return res.sendStatus(403);

    try {
      const boards = await Board.findAll({
        where: { userId: user.id },
        include: User,
      });
      res.json(boards);
    } catch (err) {
      res.status(500).json({ error: 'Cannot fetch boards' });
    }
  });
});

app.put('/photos/:id', upload.single('image'), async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret-key', async (err, user) => {
    if (err) return res.sendStatus(403);

    const file = req.file;
    const photo = await Photo.findOne({
      where: { id: req.params.id, userId: user.id },
    });

    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    photo.image = file.buffer;
    await photo.save();

    res.json(photo);
  });
});

app.delete('/boards/:id', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret-key', async (err, user) => {
    if (err) return res.sendStatus(403);

    const board = await Board.findOne({ where: { id: req.params.id } });
    await board.destroy();
    res.json({ message: 'Board deleted' });
  });
});

sequelize
  .sync()
  .then(() => {
    app.listen(3001, () => console.log('Server running on port 3001'));
  })
  .catch((err) => console.error('Unable to connect to the database:', err));

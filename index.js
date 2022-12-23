let notes = require('./database/notes')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors)
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Bienvenido a mi nueva API')
})

app.get('/api/notes', (req, res) => {
  console.log(notes)
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const note = notes.find((note) => {
    return note.id === Number(id)
  })
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params
  notes = notes.filter((note) => {
    return note.id !== Number(id)
  })
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map((note) => note.id)
  const max = Math.max(...ids)

  const newNote = {
    id: max + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes.push(newNote)
  res.status(201).end()
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found'
  })
})

const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})

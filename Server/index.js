const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
// middle ware 

app.use(cors());
app.use(express.json());

//Routes//

//create a todo 

app.post('/todo', async(req, res) => {
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
        res.json(newTodo)
    } catch (error) {
        console.error(error)
    }
});


// get all todos

app.get('/todo', async(req,res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error);
    }
});



// Update the todo 
app.put('/todo/:id', async (req,res) => {
    try {
       const {id} = req.params;
        const {completed} = req.body;
        const updateTodo = await pool.query("UPDATE todo SET completed =  $1 WHERE todo_id = $2", [completed, id]);
        res.json(updateTodo.rows[0]);
    } catch (error) {
      console.error("err.message");  
    }
});

// Delete a Todo

app.delete('/todo/:id', async(req,res) => {
    try {
        const {id} = req.params;
        await pool.query("DELETE FROM todo WHERE todo_id =$1",[
            id ]);
        res.json("TODO was deleted!");
    } catch (error) {
        console.error(err.message);
    }
});




// DELETE all todos

app.delete('/todos', async (req,res) => {
    try {
        await pool.query("DELETE FROM TODO");
        res.json({message: 'All todos were deleted'});
    } catch (error) {
        console.error(error.message);
    }
})

// filter fetch 

app.get('/todo/filter', async(req,res) =>{
    try {
        const {completed} = req.query;
        const filterFetch = await pool.query("SELECT * FROM todo WHERE completed =$1",[completed])
        res.json(filterFetch.rows)
    } catch (error) {
        console.error(error.message);
    }
} )





const PORT = process.env.PORT || 5000;

app.listen(PORT , () => console.log(`Server running on port ${PORT}`));
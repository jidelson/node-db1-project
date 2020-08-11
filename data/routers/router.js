const express = require('express');

const db = require('../dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    db.select("*")
        .from("accounts")
        .then(accounts => {
            res.status(200).json({ data: accounts })
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: error.message})
    })
    });

router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.select("*")
    .from("accounts")
    .then((account) => {
        if(account[0] === undefined){
            res.status(404).json({ message: "That specified ID does not exist."})
        } else {
            res.status(200).json({ data: account})
        }
    })
    .catch((error) => {
        res.status(500).json({error: "The account information could not be retrieved"})
    })
})

router.post('/', (req, res) => {
    const account = req.body;
    db("accounts")
    .insert(account)
    .returning("id")
    .then((ids) => {
        res.status(201).json({ inserted: ids })
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: error.message })
    });
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    const accountId = req.params.id;
    

    db("accounts")
    .where({ id: accountId })
    .update(changes)
    .then((count) => {
        if(count) {
            res.status(200).json({ message: 'updated successfully' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: error.message })
    })
});

// router.put("/:id", (req, res) => {
//     const accountId = req.params.id
// })

router.delete('/:id', (req, res) => {
    const accountId = req.params.id;

    db("accounts")
    .where({ id: accountId})
    .del()
    .then((count) => {
        if(count) {
            res.status(200).json({message: "removed succesfully"});
        } else {
            res.status(404).json({message:"not found"})
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: error.message});
    });
});



    module.exports = router;
    
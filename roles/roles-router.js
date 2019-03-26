const router = require("express").Router();

//Step 1: We bring in the library
const knex = require("knex");

//Step 2: Configuration object- we tell library, this is the type of db or client we're going to be using & the driver we're going to be using. Connection for sqlight only really requires the file name.
const knexConfig = {
  client: "sqlite3", //this is my client, sqlite3 is the package we installed & the driver and it’s going to look for sqlite3 in my node modules folder
  useNullAsDefault: true, //needed for sqlite, not other dbs}
  connection: {
    //connection either string or object
    filename: "./data/roles.db3" //relative path to db file
  },
  debug: true
};

const db = knex(knexConfig); //this gives you back an instance of knex that *knows* how to connect to your db, it’s going to be pointing to your db depending on this knexConfig.

router.get("/", (req, res) => {
  // get the roles from the database
  db("roles") //returns a promise that resolves to all records in the table, since it returns a promise to get to the data we need the broooos then and catch
    .then(roles => {
      res.status(200).json(roles);
    })
    .catch(error => res.status(500).json(error));
  // res.send("Write code to retrieve all roles");
});

router.get("/:id", (req, res) => {
  // retrieve a role by id
  const { id } = req.params;
  //same as const roleID = req.params.id and passing where({id: roleId})
  db("roles")
    .where({ id })
    .first() //method for situations like this when only getting 1 back- just so its not an array of objs; with this you only get one obj, without you get an array of one obj. could also do this with json(role[0])
    .then(role => res.status(200).json(role))
    .catch(err => res.status(500).json(error));
});

router.post("/", (req, res) => {
  // add a role to the database tat we get passed in body
  //in THIS library, you get back an array with  the last id generated, the reason is bc u can insert more than one el at a time [3]
  db("roles")
    .insert(req.body)
    .then(ids => {
      const id = ids[0]; //if you wanted to return whole object, do something similar to above.
      db("roles")
        .where({ id })
        .first() //method for situations like this when only getting 1 back- just so its not an array of objs; with this you only get one obj, without you get an array of one obj. could also do this with json(role[0])
        .then(role => res.status(201).json(role));
    })
    .catch(err => res.status(500).json(error)); //catch all of the errors inside of this
});

router.put("/:id", (req, res) => {
  // update roles
  //dont forget we need to filter any time we make changes
  //returns count of records affected (i.e. if update affects 10 records, you get back 10
  //if can't find record, returns 0
  db("roles")
    .where({ id: req.params.id })
    .update(req.body, req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ count });
      } else {
        res.status(404).json({ errorMessage: "Record not found" });
      }
    })
    .catch(err => res.status(500).json(error)); //catch all of the errors inside of this
});

router.delete("/:id", (req, res) => {
  // remove roles (inactivate the role)
  db("roles")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({ count });
      } else {
        res.status(404).json({ errorMessage: "Record not found" });
      }
    })
    .catch(err => res.status(500).json(error)); //catch all of the errors inside of this
});

module.exports = router;

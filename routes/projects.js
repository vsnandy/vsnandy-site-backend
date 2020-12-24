const express = require('express');
const pdb = require('../db/projectsDatabase');

const router = express.Router();

router.get('/list', async (req, res) => {
  try {
    res.status(200).json({
      data: pdb.projects
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

router.get('/list/:id', async (req, res) => {
  let { id } = req.params;
  id = Number(id);

  try {
    const project = pdb.projects.find(project => project.id === id);
    res.status(200).json({
      data: project
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

exports.router = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');


// general products/ GET route 
router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs);
      console.log('Length of the docs array: ' + docs.length);
      
      if(docs.length > 0){
        res.status(200).json(docs);
      } else {
        res.status(405).json({
          message: 'no entries found!'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// general products/ POST route
router.post('/', (req, res, next) => {
  // store product into the db
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Handling POST requests to /products',
      createdProduct: result
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
});

// products/productId GET route
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log("From database!", doc);
      if(doc){
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: 'No valid entry found for the provided ID!'
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });


  /*
  if(id === 'special'){
    res.status(200).json({
      message: 'You discovered the special ID!',
      id: id
    });
  } else{
    res.status(200).json({
      message: 'You passed and ID!',
      id: id
    })
  }
  */
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};

  for(const ops of req.body){
    updateOps[ops.propName] = ops.value
  }

  Product.updateOne(
    {
      _id: id
    }, {
      $set: updateOps
    }
  )
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json(result);
  })
  .catch(err => {
    console.log(result);
    res.status(200).json({
      error: err
    });
  })
});

// products/productId DELETE route
router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  /* not working
  Product.remove({
    _id: id
  })
  */
  Product.deleteOne({
    _id: id
  })
  .exec()
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router; 
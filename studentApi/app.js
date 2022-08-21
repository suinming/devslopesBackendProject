const http = require('http')
const express  = require('express')
const fs = require('fs')

const app  = express()
const server = http.createServer(app)
const port = 3001

// parse the request body
app.use(express.json())



// utility function 
// read the user data from the json file 

const saveData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync('students.json', stringifyData)
}

// get the user data from the json file 
const getData = () => {
  const jsonData = fs.readFileSync('students.json')
  return JSON.parse(jsonData)
}

// generate the ID
const newId = () => Math.random().toString(36) .substring(2,12);

// check request body
const checkRequestBody = (obj, allPropsRequired = false) => {
  const props = ["firstName", "lastName", "grade", "class"]

  const objKeys = Object.keys(obj)
  const num = objKeys.map(key => props.includes(key))
                     .reduce((acc, cur) => acc + cur)
  if(allPropsRequired){
    return num === props.length
  } 
  return num === objKeys.length 
}

// sort the obj by the last lastName
const sortByLastName = (students, order) => {
  const sortBy = "lastName"

  return students.sort((a,b) => {
        if (a[sortBy]< b[sortBy]) {
            return order === 'asc' ? -1 : 1;
        } else if (a[sortBy]> b[sortBy]) {
            return order === 'asc' ? 1 : -1;
        } else {
            return 0;
        }
  })
}

// delete the item in class array
const removeElementInArray = (array, deleteItem) => {
    for(const element of deleteItem){
        array = array.filter(item => item !== element)
    }
    return array
}

// POST
app.post('/students', (req, res) => {
  const students = getData()
  const id = newId()

  if(!checkRequestBody(req.body, true)){
    return res.status(401).send({error:true})
  }
  // const newStudent = {
  //   "id":id,
  //   "firstName":req.body.firstName, 
  //   "lastName":req.body.lastName,
  //   "createOn":new Date(),
  //   "updateOn":null,
  //   "grade":req.body.grade,
  //   "class":req.body.class
  // }

  // code refinment => use the spread operator
  const newStudent = {
    ...req.body,
    id : id,
    createOn : new Date(),
    updateOn : null
  }

  students.push(newStudent)
  saveData(students)
  res.send({success:true, message:'Student create!!', data: newStudent}) 
  // don't forget to send back the data   

})

// GET
app.get('/students', (req, res) => {
  const obj = req.query
  let respondData = getData()
  
  // if parameters sort and limit both exist
  // sort first or limit first??
  if(obj.hasOwnProperty('sort')){
    respondData = sortByLastName(respondData, obj.sort)
  }

  if(obj.hasOwnProperty('limit')){
    respondData = respondData.slice(0,obj.limit)
  }
  
  res.send(respondData)
})

// get the class array by student id
app.get('/students/:id', (req, res) => {
  const students = getData()
  const found = students.find(student => student.id === req.params.id)
  
  if(found){
    res.send(found.class)
  } else{
    // remember to send the message back if the student was not found
    res.status(404).send({error:true})
  }

})

// PUT
app.put('/students/:id', (req, res) => {
  const students = getData()
  const found = students.find(student => student.id === req.params.id)

  if(found && checkRequestBody(req.body, false)){
    for(key in req.body){
      // this is a better way to update the students array
      found[key] = req.body[key]
    }

    // better way add update date
    found.updateOn = new Date()
    // saveData([...students, found])
    saveData(students)
    // include the data with the post
    res.send({success:true, data: found, message:`student id = ${req.params.id} has been updated`})
  } else{
    res.sendStatus(404)
  }
})

// Delete 
app.delete('/students/:id',(req, res) =>{
  const students = getData()
  const found = students.find(student => student.id === req.params.id)
  if(found){
    const targetIndex = students.indexOf(found)
    students.splice(targetIndex,1)
    saveData(students)
    res.send({success:true, message:`delete student with id ${req.params.id}`})
  } else{
    res.sendStatus(404)
  }
})

// delete class by using the delete class array send from the request body 
app.delete('/students/:id/class', (req, res) => {
  const students = getData()
  const found = students.find(student => student.id === req.params.id)
  const deleteClass = req.body.class

  if(found){
    // delete the class
    found.class = removeElementInArray(found.class, deleteClass)

    // update the update time
    found.updateOn = new Date()

    // save the data
    saveData(students)
    res.send({success:true, message:"delete the student class"})

  } else{
    res.sendStatus(404)
  }
})

server.listen(port, () => console.log(`server is running on ${port}`))

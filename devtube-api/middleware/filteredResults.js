const filteredResults = (model) => async(req, res, next) => {
    let reqQuery = {...req.query}
    let removeFields = ['select', 'sort', 'limit', 'page']
    removeFields.forEach(field => delete reqQuery[field]);

    let queryStr = JSON.stringify(reqQuery)
    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    let query = model.find(JSON.parse(queryStr))

    // select query
    if(req.query.select){
      const fields = req.query.select.split(",").join(" ")
      query = query.select(fields)
    }
    
    // sort query
    if(req.query.sort){
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else{
      query = query.sort('-createdAt')
    }
    
    // pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 2
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = model.countDocuments()

    query = query.skip(startIndex).limit(limit)
    
    const pagination = {}
    if(startIndex > 0){
      pagination.prev = {page: page - 1, limit}
    }

    if(endIndex < total){
      pagination.next = {page: page + 1,limit}
    }

    const courses = await query 
    res.filteredResults = {
      success: true,
      count: courses.length,
      pagination,
      data: courses,
    }
    next()
    // res.status(200).json({success:true, count:courses.length, pagination, data: courses})
}

module.exports = filteredResults

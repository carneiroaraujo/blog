function dummy(blogs) {
    return 1
}
function totalLikes(blogs) {
    return blogs.reduce((sum, blog) => sum+blog.likes, 0)
}
function favoriteBlog(blogs) {
    return blogs.reduce((previous, current) => current.likes > previous.likes ? current : previous)
}
function mostBlogs(blogs) {
    const authors = {}
    blogs.forEach(blog => {
        if (authors[blog.author] === undefined) {
            authors[blog.author] = 1
        } else {
            authors[blog.author] ++
        }
    })
    const result = Object.entries(authors).reduce((previous, current) => previous[1] > current[1] ? previous : current)
    return {author:result[0], blogs:result[1]}
}
function mostLikes(blogs) {
    const authors = {}
    blogs.forEach(blog => {
        if (authors[blog.author] === undefined) {
            authors[blog.author] = blog.likes
        } else {
            authors[blog.author] += blog.likes
        }
    })
    const result = Object.entries(authors).reduce((previous, current) => previous[1] > current[1] ? previous : current)
    return {author:result[0], likes:result[1]}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
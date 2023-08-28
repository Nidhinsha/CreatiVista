'use client'

import { useEffect, useState } from "react"
import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleTagClick, searchText }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {
        data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
            searchText={searchText}
          />
        ))
      }
    </div>
  )
}

const Feed = () => {

  const [allPosts, setAllPosts] = useState([])

  const fetchPosts = async () => {
    const response = await fetch(`/api/prompt`)
    const data = await response.json()
    setAllPosts(data)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // search
  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchedResult, setSearchedResult] = useState([])

  const filterPrompts = (searchText) => {

    const regex = new RegExp(searchText, 'i')

    return allPosts.filter((item) =>
      regex.test(item.creator.userName) ||
      regex.test(item.tag) ||
      regex.test(item.prompt)
    )
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout)
    e.preventDefault()
    setSearchText(e.target.value)

    // debounce
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value)
        setSearchedResult(searchResult)
      }, 500)
    )
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName)

    const searchResult = filterPrompts(tagName)
    setSearchedResult(searchResult)
  }


  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          className="search_input peer"
          required
        />

      </form>
      {
        searchText ? (
          <PromptCardList
            data={searchedResult}
            handleTagClick={handleTagClick}
            searchText={searchText}
          />)
          : (<PromptCardList
            data={allPosts}
            handleTagClick={handleTagClick}
          />
          )}

    </section>
  )
}

export default Feed
